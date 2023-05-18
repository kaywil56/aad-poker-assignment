import { useContext, useEffect, useState } from "react";
import { updateHand } from "../firestore.functions";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../AuthContext";
import GameContext from "../GameContext";

const Game = () => {
  const { authContext } = useContext(AuthContext);
  const location = useLocation();

  const [deck, setDeck] = useState(createDeck());
  const [hand, setHand] = useState([]);

  function createDeck() {
    const suits = ["H", "D", "C", "S"];
    const ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    // Join ranks and suits into new array
    const deck = suits.flatMap((suit) => ranks.map((rank) => rank + suit));
    return deck;
  }

  // Deal player a new hand and remove those cards from the deck
  const dealHand = () => {
    const newHand = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const randomCard = deck.splice(randomIndex, 1)[0];
      newHand.push(randomCard);
    }
    setHand(newHand);
    setDeck(deck);
  };

  useEffect(() => {
    dealHand();
  }, []);

  useEffect(() => {
    if (hand.length === 5) {
      updateHand(location.state.gameId, authContext.uid, hand);
    }
  }, [hand]);

  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {hand.map((card, idx) => (
        <span style={{ margin: "10px" }} key={`card-${idx}`}>
          {card}
        </span>
      ))}
    </div>
  );
};

export default Game;
