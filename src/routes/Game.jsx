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

  const straight = (hand) => {
    // Use a set to extract unique values only
    let uniqueValues = new Set(hand.map((card) => card.value));

    // Impossible to have a straight with less than 5 unique values
    if (uniqueValues.length < 5) {
      return false;
    }

    // Convert back to array
    uniqueValues = [...uniqueValues];

    uniqueValues.sort(function (a, b) {
      return a.value - b.value;
    });

    // Iterate over unique values, checking if the current value 
    // is is equal to the previous value when you add 1
    for (let i = 1; i < hand.length; i++) {
      if (uniqueValues[i].value != uniqueValues[i - 1].value + 1) {
        return false;
      }
    }
    return true;
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

  const flush = (hand) => {
    const suits = new Set(hand.map((card) => card.suit));
    return suits.length === 1;
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

    const testStraightHand = [
      { suit: "Diamonds", value: 2 },
      { suit: "Diamonds", value: 13 },
      { suit: "Diamonds", value: 4 },
      { suit: "Diamonds", value: 5 },
      { suit: "Diamonds", value: 3 },
    ];

    console.log(straight(testStraightHand));
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
