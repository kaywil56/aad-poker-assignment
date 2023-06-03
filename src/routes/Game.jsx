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
      for (let i = 1; i < 14; i++) {
        const card = {
          suit: suit,
          value: i,
        };
        deck.push(card);
      }
    }

    return deck;
  }

  const fullHouse = (hand) => {
    return multiples(hand, 2) && multiples(hand, 3);
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
        return true;
      }
    }

    return false;
  };

  const twoPair = () => {
    const values = hand.map((card) => card.value);
    const valueCounts = {};

    let pairCount = 0;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (valueCounts[value]) {
        valueCounts[value] += 1;
      } else {
        valueCounts[value] = 1;
      }

      if (valueCounts[value] === 2) {
        pairCount++;
      }
    }

    return pairCount === 2;
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

    uniqueValues.sort();

    // Iterate over unique values, checking if the current value
    // is is equal to the previous value when you add 1
    for (let i = 1; i < uniqueValues.length; i++) {
      if (uniqueValues[i] !== uniqueValues[i - 1] + 1) {
        return false;
      }
    }
    return true;
  };

  const flush = () => {
    const suits = new Set(hand.map((card) => card.suit));
    return suits.size === 1;
  };

  const straightFlush = (hand) => {
    return flush(hand) && straight(hand);
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
      if (handType.evaluator(hand)) {
        setHandRank({ type: handType.type, level: handType.level });
        return;
      }
    }
    setHandRank({ type: "High Card", level: 1 });
  };

  const convertToFaceValue = (value) => {
    if (value === 1) {
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
    let highestRank = 0;
    let currentWinner = {}
    for (const player of players) {
      if (player.rank.level > highestRank) {
        highestRank = player.rank.level;
        currentWinner = player
      }
    }
    setWinner(currentWinner);
  };

  useEffect(() => {
    if (authContext.uid === location.state.owner) {
      dealPlayersInitialCards(deck, location.state.gameId);
    }
    getPlayers(location.state.gameId, setPlayers, setHand, authContext.uid);
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      const allPlayersHavePlayed = players.every(
        (player) => player?.rank !== undefined
      );
      if (allPlayersHavePlayed) {
        evaluateWinner();
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
