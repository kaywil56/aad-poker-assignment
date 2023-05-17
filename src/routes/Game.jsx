import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../AuthContext";

const Game = () => {
  const { authContext } = useContext(AuthContext);
  const [deck, setDeck] = useState(createDeck);
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

    const deck = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(rank + suit);
      }
    }

    return deck;
  }

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
  }, [deck]);

  // Protect route
  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {hand.map((card, idx) => {
        return <span style={{ margin: "10px" }} key={`card-${idx}`}>{card}</span>;
      })}
    </div>
  );
};

export default Game;
