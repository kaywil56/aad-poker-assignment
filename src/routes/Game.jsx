import { useContext, useEffect, useState } from "react";
import { updateHand } from "../firestore.functions";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../AuthContext";

const Game = () => {
  // const { authContext } = useContext(AuthContext);
  // const location = useLocation();

  const [deck, setDeck] = useState(createDeck());
  const [hand, setHand] = useState([]);
  const [handRank, setHandRank] = useState("High Card");

  function createDeck() {
    const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
    const values = [
      "A",
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
    ];

    const deck = [];

    for (const suit of suits) {
      for (const value of values) {
        const card = {
          suit: suit,
          value: value,
        };
        deck.push(card);
      }
    }

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

  const straight = (hand) => {
    const uniqueValues = new Set(hand.map((card) => card.value));

    // Impossible to have a straight with less than 5 unique values
    if (uniqueValues.length < 5) {
      return false;
    }
  };

  const getNumberValue = (value) => {
    if (value === "A") {
      return 14;
    } else if (value === "K") {
      return 13;
    } else if (value === "Q") {
      return 12;
    } else if (value === "J") {
      return 11;
    } else {
      return parseInt(value);
    }
  };

  const royalFlush = (hand) => {
    const requiredValues = ["10", "J", "K", "Q", "A"];
    const suits = new Set(hand.map((card) => card.suit));

    let meetsRequiredValues = true;

    hand.forEach((card) => {
      if (!requiredValues.includes(card.value)) {
        meetsRequiredValues = false;
      }
    });

    return suits.length === 1 && meetsRequiredValues;
  };

  useEffect(() => {
    dealHand();

    // const royalFlushHand = [
    //   { suit: 'Spades', value: 'J' },
    //   { suit: 'Spades', value: 'K' },
    //   { suit: 'Spades', value: 'Q' },
    //   { suit: 'Spades', value: 'A' },
    //   { suit: 'Spades', value: '10' }
    // ];

    // const sameSuitsHand = [
    //   { suit: 'Diamonds', value: '2' },
    //   { suit: 'Diamonds', value: '6' },
    //   { suit: 'Diamonds', value: '10' },
    //   { suit: 'Diamonds', value: 'K' },
    //   { suit: 'Diamonds', value: 'A' }
    // ];

    // const sameValuesHand = [
    //   { suit: 'Clubs', value: '8' },
    //   { suit: 'Hearts', value: '8' },
    //   { suit: 'Spades', value: '8' },
    //   { suit: 'Diamonds', value: '8' },
    //   { suit: 'Clubs', value: '8' }
    // ];

    // console.log("true" , royalFlush(royalFlushHand))
    // console.log("false" , royalFlush(sameSuitsHand))
    // console.log("false" , royalFlush(sameValuesHand))
  }, []);

  // useEffect(() => {
  //   if (hand.length === 5) {
  //     updateHand(location.state.gameId, authContext.uid, hand);
  //   }
  // }, [hand]);

  // if (!authContext.uid) {
  //   return <Navigate to="/" />;
  // }

  return (
    <div>
      <p>Hand Rank: {handRank}</p>
      {hand.map((card, idx) => (
        <span style={{ margin: "10px" }} key={`card-${idx}`}>
          {`${card.value} of ${card.suit}`}
        </span>
      ))}
    </div>
  );
};

export default Game;
