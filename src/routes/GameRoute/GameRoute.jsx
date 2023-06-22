/**
 * GameRoute.jsx
 * This component renders the route for the current game instance
 */

import { useContext, useEffect, useState } from "react";
import {
  updateHandRank,
  getPlayers,
  setNextPlayerTurn,
  dealPlayersInitialCards,
  updateHand,
  discardCards,
} from "../../firestoreFunctions";
import {
  fullHouse,
  multiples,
  twoPair,
  straight,
  flush,
  straightFlush,
  royalFlush,
  calculateHandStrength,
  createDeck,
  evaluateWinner,
} from "../../handEvaluations";
import Players from "../../components/Game/Players";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../../AuthContext";
import GameOver from "../../components/Game/GameOver";
import "./GameRoute.css";
import Hand from "../../components/Game/Hand";
import { useOutletContext } from "react-router-dom";

const GameRoute = () => {
  const { authContext } = useContext(AuthContext);
  const location = useLocation();
  const [hand, setHand] = useState([]);
  const [handRank, setHandRank] = useState("");
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState([]);
  const [alreadySwapped, setAlreadySwapped] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

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

  const deck = createDeck();

  // Iterate through hand ranks and stop when the hand matches. finally set hand to high card
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

  // End round
  const check = async () => {
    await updateHandRank(location.state.gameId, authContext.uid, handRank);
    handleSetNextPlayerTurn();
  };

  // Set the next player to be the next index in the players array
  const handleSetNextPlayerTurn = () => {
    const currentPlayerIdx = players.findIndex(
      (player) => player.id === authContext.uid
    );

    const nextPlayerIdx = (currentPlayerIdx + 1) % players.length;
    const nextPlayer = players[nextPlayerIdx];

    setNextPlayerTurn(location.state.gameId, authContext.uid, nextPlayer.id);
  };

  // Deal initial hands and mount snapshot listener
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

  // Evaluate the players hand when it gets updated
  useEffect(() => {
    const currentPlayer = players.find(
      (player) => player?.playerId === authContext.uid
    );

    if (hand?.length === 5 && currentPlayer?.rank === undefined) {
      evaluateHand();
    }
  }, [players]);

  // Check if all players have played
  useEffect(() => {
    const playerCount = location.state.playerAmount;
    if (players.length == playerCount) {
      const allPlayersHavePlayed = players.every(
        (player) => player?.rank !== undefined
      );
      if (allPlayersHavePlayed) {
        setWinner(evaluateWinner(players));
      }
    }
  }, [players]);

  // Check if its the current players turn
  const isPlayerTurn = () => {
    const currentPlayer = players.find(
      (player) => player.playerId === authContext.uid
    );
    return currentPlayer?.isTurn;
  };

  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  // Remove selected cards from hand and update with new ones
  const handleCardSwap = async () => {
    if (!alreadySwapped) {
      // Remove cards from hand that are in the selected cards array
      const handWithCardsRemoved = hand.filter((card) => {
        return !selectedCards.some(
          (selectedCard) =>
            selectedCard.value === card.value && selectedCard.suit === card.suit
        );
      });

      const newCards = getNewCards(selectedCards.length);
      const updatedHand = [...handWithCardsRemoved, ...newCards];

      await discardCards(location.state.gameId, authContext.uid, selectedCards);
      await updateHand(location.state.gameId, authContext.uid, updatedHand);

      setAlreadySwapped(true);
    }
  };

  // get a specified amount of cards that havent been dealt yet
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

  // updates the selected card state with a new card
  const updateSelectedCards = (card) => {
    if (!alreadySwapped && isPlayerTurn()) {
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

  // Takes in a card and returns if it has been selected
  const checkIfSelected = (card) => {
    if (isPlayerTurn()) {
      const isSelected = selectedCards.some(
        (selectedCard) =>
          selectedCard.value === card.value && selectedCard.suit === card.suit
      );
      return isSelected;
    }
  };

  return (
    <>
      {winner.length == 0 ? (
        <div className="poker-table">
          <Players players={players} currentPlayerId={authContext.uid} />
          <div className="hand-container">
            <div className="hand-header">
              <p className="hand-rank">Hand Rank: {handRank.type}</p>
              <div className="hand-actions">
                {selectedCards.length > 0 && !alreadySwapped && (
                  <button className="game-btns" onClick={handleCardSwap}>
                    SWAP
                  </button>
                )}
                {/* render check button if it is the players turn */}
                {isPlayerTurn() && (
                  <button className="game-btns" onClick={check}>
                    Check
                  </button>
                )}
              </div>
            </div>
            <Hand
              cards={hand}
              updateSelectedCards={updateSelectedCards}
              checkIfSelected={checkIfSelected}
            />
          </div>
        </div>
      ) : (
        <GameOver winners={winner} />
      )}
    </>
  );
};

export default GameRoute;
