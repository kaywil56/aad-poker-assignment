import { useContext, useEffect, useState } from "react";
import {
  updateHandRank,
  getPlayers,
  setNextPlayerTurn,
  dealPlayersInitialCards,
} from "../firestore.functions";
import Players from "../components/Game/Players";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../AuthContext";
import GameOver from "../components/Game/GameOver";

const Game = () => {
  const { authContext } = useContext(AuthContext);
  const location = useLocation();
  const [deck, setDeck] = useState(createDeck());
  const [hand, setHand] = useState([]);
  const [handRank, setHandRank] = useState("");
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState({});

  const handTypes = [
    { type: "Royal Flush", level: 10, evaluator: () => royalFlush() },
    { type: "Straight Flush", level: 9, evaluator: () => straightFlush() },
    { type: "Four of a Kind", level: 8, evaluator: () => multiples(4) },
    { type: "Full House", level: 7, evaluator: () => fullHouse() },
    { type: "Flush", level: 6, evaluator: () => flush() },
    { type: "Straight", level: 5, evaluator: () => straight() },
    { type: "Three of a Kind", level: 4, evaluator: () => multiples(3) },
    { type: "Two Pair", level: 3, evaluator: () => twoPair() },
    { type: "One Pair", level: 2, evaluator: () => multiples(2) },
  ];

  function createDeck() {
    const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
    const deck = [];

    for (const suit of suits) {
      for (let i = 2; i < 15; i++) {
        const card = {
          suit: suit,
          value: i,
        };
        deck.push(card);
      }
    }

    return deck;
  }

  const calculateHandStrength = (cards) => {
    const multipliers = [10000, 1000, 100, 10, 1];
    let totalSum = 0;

    for (let i = 0; i < cards.length; i++) {
      totalSum += cards[i].value * multipliers[i];
    }

    return totalSum;
  };

  const fullHouse = (hand) => {
    const tieBreaker = multiples(hand, 3);
    if (multiples(hand, 2) && tieBreaker) {
      return tieBreaker;
    }
    return false;
  };

  // This function can be used for 1 pair, three of a kind and four of a kind
  // by passing a value for the count paramater.
  const multiples = (count) => {
    const values = hand.map((card) => card.value);
    const valueCounts = {};

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (valueCounts[value]) {
        valueCounts[value] += 1;
      } else {
        valueCounts[value] = 1;
      }

      if (valueCounts[value] === count) {
        const multipleCardValue = parseInt(value, 10);
        // If it is one pair
        if (count === 2) {
          const currentHand = hand;
          currentHand.sort((a, b) => {
            return b.value - a.value;
          });
          // Shift the pair to the front of the array
          currentHand.sort((a, b) => {
            if (a.value === multipleCardValue && b !== multipleCardValue) {
              return -1;
            } else if (a !== multipleCardValue && b === multipleCardValue) {
              return 1;
            } else {
              return 0;
            }
          });
          const handStrength = calculateHandStrength(currentHand);
          return handStrength;
        }
        return multipleCardValue;
      }
    }

    return false;
  };

  const twoPair = () => {
    const valueCounts = {};

    // Track the amount of times a value appears in the hand
    for (const card of hand) {
      valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    }

    const pairValues = Object.entries(valueCounts)
      .filter(([value, count]) => count === 2)
      .map(([value, count]) => parseInt(value, 10));

    // Find the remaining value in the case of tie breakers
    const kicker = Object.keys(valueCounts).find(
      (value) => valueCounts[value] === 1
    );

    // Sort the pair values from highest to lowest
    pairValues.sort((a, b) => {
      return b - a;
    });

    if (pairValues.length === 2) {
      const multipliers = [100, 10, 1];
      const cards = [...pairValues, parseInt(kicker, 10)];
      let tieBreaker = 0;
      for (let i = 0; i < 3; i++) {
        tieBreaker += cards[i] * multipliers[i];
      }
      return tieBreaker;
    }

    return false;
  };

  const straight = () => {
    // Use a set to extract unique values only
    let uniqueValues = new Set(hand.map((card) => card.value));

    // Impossible to have a straight with less than 5 unique values
    if (uniqueValues.size < 5) {
      return false;
    }

    // Convert to array
    uniqueValues = [...uniqueValues];

    uniqueValues.sort((a, b) => {
      return b - a;
    });

    // Iterate over unique values, checking if the current value
    // is is equal to the previous value when you add 1
    for (let i = 1; i < uniqueValues.length; i++) {
      if (uniqueValues[i] !== uniqueValues[i - 1] + 1) {
        return false;
      }
    }
    return uniqueValues[0];
  };

  const flush = () => {
    const suits = new Set(hand.map((card) => card.suit));
    const handSorted = hand.sort((a, b) => {
      b.value - a.value;
    });
    const handStrength = calculateHandStrength(handSorted);
    return suits.size === 1 ? handStrength : false;
  };

  const straightFlush = (hand) => {
    if (flush(hand) && straight(hand)) {
      const handSorted = hand.sort((a, b) => {
        return b.value - a.value;
      });
      return handSorted[0];
    }
    return false;
  };

  const royalFlush = () => {
    const requiredValues = ["10", "J", "K", "Q", "A"];

    let meetsRequiredValues = true;

    hand.forEach((card) => {
      if (!requiredValues.includes(card.value)) {
        meetsRequiredValues = false;
      }
    });

    return flush(hand) && meetsRequiredValues;
  };

  const evaluateHand = () => {
    for (const handType of handTypes) {
      const tieBreaker = handType.evaluator(hand);
      if (tieBreaker) {
        setHandRank({
          type: handType.type,
          level: handType.level,
          tieBreaker: tieBreaker,
        });
        return;
      }
    }
    const currentHand = hand.sort((a, b) => {
      return a.value - b.value;
    });
    const handStrength = calculateHandStrength(currentHand);
    setHandRank({ type: "High Card", level: 1, tieBreaker: handStrength });
  };

  const convertToFaceValue = (value) => {
    if (value === 14) {
      return "Ace";
    } else if (value === 13) {
      return "King";
    } else if (value === 12) {
      return "Queen";
    } else if (value === 11) {
      return "Jack";
    } else {
      return value;
    }
  };

  const stand = async () => {
    await updateHandRank(location.state.gameId, authContext.uid, handRank);
    handleSetNextPlayerTurn();
  };

  const handleSetNextPlayerTurn = () => {
    const currentPlayerIdx = players.findIndex(
      (player) => player.id === authContext.uid
    );

    const nextPlayerIdx = currentPlayerIdx + 1;
    // If the current player is the last player
    if (nextPlayerIdx === players.length) {
      return;
    }
    const nextPlayer = players[nextPlayerIdx];

    setNextPlayerTurn(location.state.gameId, authContext.uid, nextPlayer.id);
  };

  const evaluateWinner = () => {
    // Sort players from highest hand rank to lowest
    const sortedPlayers = players.sort((a, b) => {
      return b.rank.level - a.rank.level;
    });
    const highestRank = sortedPlayers[0].rank.level;
    // Filter for players that also have the highest hand rank
    const highestHands = players.filter(
      (player) => player.rank.level === highestRank
    );

    if (highestHands.length === 1) {
      return highestHands[0];
    }

    const rankType = highestHands[0].rank.type;
    const isSame = highestHands.every(
      (hand) => hand.rank.tieBreaker === highestHands[0].rank.tieBreaker
    );

    if (rankType === "Royal Flush" || isSame) {
      return highestHands;
    } else {
      highestHands.sort((a, b) => {
        b.rank.tieBreaker - a.rank.tieBreaker;
      });

      return highestHands[0];
    }
  };

  const handleCardSwap = () => {};

  const updateDeck = () => {
    // Flattens all players into one array
    const playerCards = players.flatMap((player) => player.hand);
    // Filter all players cards from that deck
    const updatedDeck = deck.filter((card) =>
      !playerCards.some(
        (playerCard) =>
          playerCard.suit === card.suit && playerCard.value === card.value
      )
    );

    setDeck(updatedDeck)
  };

  useEffect(() => {
    if (authContext.uid === location.state.owner) {
      const startingDeck = [...deck];
      dealPlayersInitialCards(startingDeck, location.state.gameId);
    }
    getPlayers(location.state.gameId, setPlayers, setHand, authContext.uid);
  }, []);

  useEffect(() => {
    const playerCount = location.state.playerAmount;
    const allPlayersHaveCards = players.every(
      (player) => player?.hand?.length === 5
    );
    if (players.length == playerCount && allPlayersHaveCards) {
      updateDeck();
    }
  }, [players]);

  useEffect(() => {
    const playerCount = location.state.playerAmount;
    if (players.length > playerCount) {
      const allPlayersHavePlayed = players.every(
        (player) => player?.rank !== undefined
      );
      if (allPlayersHavePlayed) {
        setWinner(evaluateWinner());
      }
    }
  }, [players]);

  const isPlayerTurn = () => {
    const currentPlayer = players.find(
      (player) => player.playerId === authContext.uid
    );
    return currentPlayer?.isTurn;
  };

  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {!winner.playerId ? (
        <div>
          <Players players={players} />
          <p>Hand Rank: {handRank.type}</p>
          {hand?.map((card, idx) => (
            <span style={{ margin: "10px" }} key={`card-${idx}`}>
              {`${convertToFaceValue(card.value)} of ${card.suit}`}
              <button onClick={() => handleCardSwap(card)}>SWAP</button>
            </span>
          ))}
          <button onClick={evaluateHand}>Evaluate</button>
          {isPlayerTurn() && <button onClick={stand}>Stand</button>}
        </div>
      ) : (
        <GameOver winner={winner} />
      )}
    </>
  );
};

export default Game;
