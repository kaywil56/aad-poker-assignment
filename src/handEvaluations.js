export const fullHouse = (hand) => {
  const valueCounts = {};
  
  for (let i = 0; i < hand.length; i++) {
    const value = hand[i].value;
    if (valueCounts[value]) {
      valueCounts[value] += 1;
    } else {
      valueCounts[value] = 1;
    }
  }

  let threeOfAKindValue = null;
  let pairValue = null;

  for (const value in valueCounts) {
    if (valueCounts[value] === 3) {
      threeOfAKindValue = parseInt(value, 10);
    } else if (valueCounts[value] === 2) {
      pairValue = parseInt(value, 10);
    }
  }

  if (threeOfAKindValue !== null && pairValue !== null) {
    return threeOfAKindValue;
  }
  
  return false;
};

// This function can be used for 1 pair, three of a kind and four of a kind
// by passing a value for the count paramater.
export const multiples = (hand, count) => {
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
        const currentHand = [...hand].sort((a, b) => {
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

export const twoPair = (hand) => {
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

export const straight = (hand) => {
  // Use a set to extract unique values only
  let uniqueValues = new Set(hand.map((card) => card.value));

  // Impossible to have a straight with less than 5 unique values
  if (uniqueValues.size < 5) {
    return false;
  }

  // Convert to array
  uniqueValues = [...uniqueValues];

  const lowAceStraightValues = [14, 2, 3, 4, 5];

  // Check if the hand has the lowest straight with Ace as the lowest card
  const hasLowAceStraight = lowAceStraightValues.every((value) => {
    return uniqueValues.includes(value);
  });

  if (hasLowAceStraight) {
    return 5;
  }

  // Sort the unique values in ascending order
  uniqueValues.sort((a, b) => a - b);

  // Iterate over unique values, checking if the current value
  // is equal to the previous value plus 1
  for (let i = 1; i < uniqueValues.length; i++) {
    if (uniqueValues[i] !== uniqueValues[i - 1] + 1) {
      return false;
    }
  }

  return uniqueValues[uniqueValues.length - 1];
};

export const flush = (hand) => {
  const suits = new Set(hand.map((card) => card.suit));
  const handSorted = [...hand].sort((a, b) => {
    b.value - a.value;
  });
  const handStrength = calculateHandStrength(handSorted);
  return suits.size === 1 ? handStrength : false;
};

export const straightFlush = (hand) => {
  if (flush(hand) && straight(hand)) {
    const handSorted = [...hand].sort((a, b) => {
      return b.value - a.value;
    });
    return handSorted[0];
  }
  return false;
};

export const royalFlush = (hand) => {
  const requiredValues = [10, 11, 12, 13, 14];

  let meetsRequiredValues = true;

  hand.forEach((card) => {
    if (!requiredValues.includes(card.value)) {
      meetsRequiredValues = false;
    }
  });

  return flush(hand) && meetsRequiredValues;
};

export const calculateHandStrength = (cards) => {
  const multipliers = [10000, 1000, 100, 10, 1];
  let totalSum = 0;

  for (let i = 0; i < cards.length; i++) {
    totalSum += cards[i].value * multipliers[i];
  }

  return totalSum;
};

export function createDeck() {
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

export const evaluateWinner = (players) => {
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
    return [highestHands[0]];
  }

  const rankType = highestHands[0].rank.type;
  const isSame = highestHands.every(
    (hand) => hand.rank.tieBreaker === highestHands[0].rank.tieBreaker
  );

  if (rankType === "Royal Flush" || isSame) {
    return highestHands;
  } else if (rankType === "High Card") {
    highestHands.sort((a, b) => {
      return b.rank.tieBreaker - a.rank.tieBreaker;
    });

    return [highestHands[0]];
  } else {
    highestHands.sort((a, b) => {
      return b.rank.tieBreaker - a.rank.tieBreaker;
    });

    return [highestHands[0]];
  }
};
