import { useContext, useEffect, useState } from "react";
import {
  updateHandRank,
  getPlayers,
  setNextPlayerTurn,
  dealPlayersInitialCards,
  updateHand,
  discardCards,
} from "../firestoreFunctions";
import {
  fullHouse,
  multiples,
  twoPair,
  straight,
  flush,
  straightFlush,
  royalFlush,
  calculateHandStrength,
} from "../handEvaluations";
import Players from "../components/Game/Players";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../AuthContext";
import GameOver from "../components/Game/GameOver";
import "./GameRoute.css";

const GameRoute = () => {
  const { authContext } = useContext(AuthContext);
  const location = useLocation();
  const [hand, setHand] = useState([]);
  const [handRank, setHandRank] = useState("");
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState({});
  const [selectedCards, setSelectedCards] = useState([]);
  const [alreadySwapped, setAlreadySwapped] = useState(false);

  const handTypes = [
    { type: "Royal Flush", level: 10, evaluator: (hand) => royalFlush(hand) },
    {
      type: "Straight Flush",
      level: 9,
      evaluator: (hand) => straightFlush(hand),
    },
    {
      type: "Four of a Kind",
      level: 8,
      evaluator: (hand) => multiples(hand, 4),
    },
    { type: "Full House", level: 7, evaluator: (hand) => fullHouse(hand) },
    { type: "Flush", level: 6, evaluator: (hand) => flush(hand) },
    { type: "Straight", level: 5, evaluator: (hand) => straight(hand) },
    {
      type: "Three of a Kind",
      level: 4,
      evaluator: (hand) => multiples(hand, 3),
    },
    { type: "Two Pair", level: 3, evaluator: (hand) => twoPair(hand) },
    { type: "One Pair", level: 2, evaluator: (hand) => multiples(hand, 2) },
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

  const deck = createDeck();

  const evaluateHand = () => {
    for (const handType of handTypes) {
      const tieBreaker = handType.evaluator([...hand]);
      if (tieBreaker) {
        setHandRank({
          type: handType.type,
          level: handType.level,
          tieBreaker: tieBreaker,
        });
        return;
      }
    }
    const currentHand = [...hand].sort((a, b) => {
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

  const check = async () => {
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
    const sortedPlayers = [...players].sort((a, b) => {
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

  useEffect(() => {
    const get = async () => {
      if (authContext.uid === location.state.owner) {
        await dealPlayersInitialCards([...deck], location.state.gameId);
      }
      await getPlayers(
        location.state.gameId,
        setPlayers,
        setHand,
        authContext.uid
      );
    };
    get();
  }, []);

  useEffect(() => {
    const currentPlayer = players.find(
      (player) => player?.playerId === authContext.uid
    );

    if (hand?.length === 5 && currentPlayer?.rank === undefined) {
      evaluateHand();
    }
  }, [players]);

  useEffect(() => {
    const playerCount = location.state.playerAmount;
    if (players.length === playerCount) {
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

  const updateSelectedCards = (card) => {
    if (!alreadySwapped) {
      let isSelected = checkIfSelected(card);
      if (isSelected) {
        const currentSelectedCards = selectedCards.filter(
          (selectedCard) => selectedCard.id !== card.id
        );
        setSelectedCards(currentSelectedCards);
      } else {
        setSelectedCards([...selectedCards, card]);
      }
    }
  };

  const handleCardSwap = async () => {
    if (!alreadySwapped) {
      // Remove cards from hand that are in the selected cards array
      const handWithCardsRemoved = hand.filter((card) => {
        return !selectedCards.some(
          (selectedCard) =>
            selectedCard.value === card.value && selectedCard.suit === card.suit
        );
      });

      console.log(handWithCardsRemoved)

      const newCards = getNewCards(selectedCards.length);
      const updatedHand = [...handWithCardsRemoved, ...newCards];

      await Promise.all([
        updateHand(location.state.gameId, authContext.uid, updatedHand),
        discardCards(location.state.gameId, authContext.uid, selectedCards),
      ]);

      setAlreadySwapped(true);
    }
  };

  const getNewCards = (amount) => {
    const newCards = [];
    // Combine all players discard piles and hands to find all dealt cards
    const dealtCards = players
      .flatMap((player) => [player.hand, player.discardPile])
      .flat();

    // Filter out all dealt cards from the deck
    const cardsAvailable = deck.filter(
      (card) =>
        !dealtCards.some(
          (playerCard) =>
            playerCard.suit === card.suit && playerCard.value === card.value
        )
    );

    // Get new random cards based on the amount swapped
    for (let i = 0; i < amount; i++) {
      newCards.push(
        cardsAvailable[Math.floor(Math.random() * cardsAvailable.length)]
      );
    }
    return newCards;
  };

  const checkIfSelected = (card) => {
    const isSelected = selectedCards.some(
      (selectedCard) =>
        selectedCard.value === card.value && selectedCard.suit === card.suit
    );
    return isSelected;
  };

  return (
    <>
      {!winner.playerId ? (
        <div>
          <Players players={players} currentPlayerId={authContext.uid} />
          <p>Hand Rank: {handRank.type}</p>
          <div className="hand">
            {hand?.map((card, idx) => (
              <div
                onClick={() => updateSelectedCards(card)}
                className="card"
                style={{
                  backgroundColor: checkIfSelected(card) ? "grey" : "gainsboro",
                }}
                key={`card-${idx}`}
              >
                {`${convertToFaceValue(card.value)} of ${card.suit}`}
              </div>
            ))}
          </div>
          {selectedCards.length > 0 && !alreadySwapped && (
            <button onClick={handleCardSwap}>SWAP</button>
          )}
          {isPlayerTurn() && <button onClick={check}>Check</button>}
        </div>
      ) : (
        <GameOver winner={winner} />
      )}
    </>
  );
};

export default GameRoute;
