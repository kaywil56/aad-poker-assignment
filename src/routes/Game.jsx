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

  // This function can be used for 1 pair, three of a kind and four of a kind
  // by passing a value for the count paramater.
  const multiples = (hand, count) => {
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

  const twoPair = (hand) => {
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

  const straight = (hand) => {
    // Use a set to extract unique values only
    let uniqueValues = new Set(hand.map((card) => card.value));

    // Impossible to have a straight with less than 5 unique values
    if (uniqueValues.length < 5) {
      return false;
    }

    // Convert to array
    uniqueValues = [...uniqueValues];

    uniqueValues.sort();

    // Iterate over unique values, checking if the current value
    // is is equal to the previous value when you add 1
    for (let i = 1; i < uniqueValues.length; i++) {
      if (uniqueValues[i] != uniqueValues[i - 1] + 1) {
        return false;
      }
    }
    return true;
  };

  const flush = (hand) => {
    const suits = new Set(hand.map((card) => card.suit));
    return suits.size === 1;
  };

  const straightFlush = (hand) => {
    return flush(hand) && straight(hand);
  };

  const royalFlush = (hand) => {
    const requiredValues = ["10", "J", "K", "Q", "A"];

    let meetsRequiredValues = true;

    hand.forEach((card) => {
      if (!requiredValues.includes(card.value)) {
        meetsRequiredValues = false;
      }
    });

    return flush(hand) && meetsRequiredValues;
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

  useEffect(() => {
    dealHand();
    const handWithTwoPair = [
      { value: "9", suit: "Spades" },
      { value: "7", suit: "Clubs" },
      { value: "4", suit: "Hearts" },
      { value: "6", suit: "Diamonds" },
      { value: "9", suit: "Hearts" },
    ];
    console.log(twoPair(handWithTwoPair));
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
          {`${convertToFaceValue(card.value)} of ${card.suit}`}
        </span>
      ))}
    </div>
  );
};

export default Game;
