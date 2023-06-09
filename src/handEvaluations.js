export const fullHouse = (hand) => {
  const tieBreaker = multiples(hand, 3);
  if (multiples(hand, 2) && tieBreaker) {
    return tieBreaker;
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
    console.log("RF")
    console.log(hand)
  const requiredValues = ["10", "J", "K", "Q", "A"];

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
