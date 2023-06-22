import { describe, expect, test } from "vitest";
import {
  fullHouse,
  multiples,
  twoPair,
  straight,
  flush,
  straightFlush,
  royalFlush,
  calculateHandStrength,
  evaluateWinner,
  createDeck,
} from "../handEvaluations";

describe("Hand evaluations tests", () => {
  test("Create deck generates correct number of cards", () => {
    const deck = createDeck();
    expect(deck.length).toBe(52);
  });

  test("Valid Royal flush", () => {
    const validRoyalFlush = [
      {
        suit: "Diamonds",
        value: 10,
      },
      {
        suit: "Diamonds",
        value: 11,
      },
      {
        suit: "Diamonds",
        value: 12,
      },
      {
        suit: "Diamonds",
        value: 13,
      },
      {
        suit: "Diamonds",
        value: 14,
      },
    ];
    expect(royalFlush(validRoyalFlush)).toBeTruthy();
  });

  test("Invalid Royal flush", () => {
    const invalidRoyalFlush = [
      {
        suit: "Diamonds",
        value: 3,
      },
      {
        suit: "Spades",
        value: 2,
      },
      {
        suit: "Clubs",
        value: 6,
      },
      {
        suit: "Clubs",
        value: 13,
      },
      {
        suit: "Diamonds",
        value: 5,
      },
    ];
    expect(royalFlush(invalidRoyalFlush)).toBeFalsy();
  });

  test("Straight flush works correctly", () => {
    const validStraightFlush = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Diamonds",
        value: 5,
      },
      {
        suit: "Diamonds",
        value: 6,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Diamonds",
        value: 8,
      },
    ];
    expect(straightFlush(validStraightFlush)).toBeTruthy();
  });

  test("Invalid Straight flush", () => {
    const invalidStraightFlush = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Diamonds",
        value: 5,
      },
      {
        suit: "Diamonds",
        value: 6,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Diamonds",
        value: 9,
      },
    ];
    expect(straightFlush(invalidStraightFlush)).toBeFalsy();
  });

  test("Four of a kind works", () => {
    const validFourOfAKind = [
      {
        suit: "Diamonds",
        value: 2,
      },
      {
        suit: "Spades",
        value: 2,
      },
      {
        suit: "Clubs",
        value: 2,
      },
      {
        suit: "Hearts",
        value: 2,
      },
      {
        suit: "Diamonds",
        value: 8,
      },
    ];
    expect(multiples(validFourOfAKind, 4)).toBeTruthy();
  });

  test("Invalid Four of a kind", () => {
    const invalidFourOfAKind = [
      {
        suit: "Diamonds",
        value: 2,
      },
      {
        suit: "Spades",
        value: 2,
      },
      {
        suit: "Clubs",
        value: 2,
      },
      {
        suit: "Hearts",
        value: 3,
      },
      {
        suit: "Diamonds",
        value: 8,
      },
    ];
    expect(multiples(invalidFourOfAKind, 4)).toBeFalsy();
  });

  test("Full house works correctly", () => {
    const validFullHouse = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Hearts",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 4,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 7,
      },
    ];
    expect(fullHouse(validFullHouse)).toBeTruthy();
  });

  test("Invalid Full house", () => {
    const invalidFullHouse = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Hearts",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 4,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 8,
      },
    ];
    expect(fullHouse(invalidFullHouse)).toBeFalsy();
  });

  test("Flush works correctly", () => {
    const validFlush = [
      {
        suit: "Diamonds",
        value: 2,
      },
      {
        suit: "Diamonds",
        value: 5,
      },
      {
        suit: "Diamonds",
        value: 3,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Diamonds",
        value: 8,
      },
    ];
    expect(flush(validFlush)).toBeTruthy();
  });

  test("Invalid Flush", () => {
    const invalidFlush = [
      {
        suit: "Diamonds",
        value: 2,
      },
      {
        suit: "Diamonds",
        value: 5,
      },
      {
        suit: "Clubs",
        value: 3,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Diamonds",
        value: 8,
      },
    ];
    expect(flush(invalidFlush)).toBeFalsy();
  });

  test("Straight works correctly", () => {
    const validStraight = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Hearts",
        value: 5,
      },
      {
        suit: "Clubs",
        value: 6,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 8,
      },
    ];
    expect(straight(validStraight)).toBeTruthy();
  });

  test("Low ace straight works correctly", () => {
    const validLowAceStraight = [
      {
        suit: "Diamonds",
        value: 2,
      },
      {
        suit: "Hearts",
        value: 3,
      },
      {
        suit: "Clubs",
        value: 4,
      },
      {
        suit: "Diamonds",
        value: 5,
      },
      {
        suit: "Spades",
        value: 14,
      },
    ];
    expect(straight(validLowAceStraight)).toBeTruthy();
  });

  test("Invalid Straight", () => {
    const invalidStraight = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Hearts",
        value: 5,
      },
      {
        suit: "Clubs",
        value: 9,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 10,
      },
    ];
    expect(straight(invalidStraight)).toBeFalsy();
  });

  test("Three of a kind works correctly", () => {
    const validThreeOfKind = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Hearts",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 4,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 8,
      },
    ];
    expect(multiples(validThreeOfKind, 3)).toBeTruthy();
  });

  test("Invalid Three of a kind", () => {
    const invalidThreeOfKind = [
      {
        suit: "Diamonds",
        value: 6,
      },
      {
        suit: "Hearts",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 3,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 4,
      },
    ];
    expect(multiples(invalidThreeOfKind, 3)).toBeFalsy();
  });

  test("Two pair works correctly", () => {
    const validTwoPair = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Hearts",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 7,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 8,
      },
    ];
    expect(twoPair(validTwoPair)).toBeTruthy();
  });

  test("Invalid Two pair", () => {
    const invalidTwoPair = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Hearts",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 6,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 8,
      },
    ];
    expect(twoPair(invalidTwoPair)).toBeFalsy();
  });

  test("1 pair works correctly", () => {
    const validOnePair = [
      {
        suit: "Diamonds",
        value: 4,
      },
      {
        suit: "Hearts",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 2,
      },
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Spades",
        value: 8,
      },
    ];
    expect(multiples(validOnePair, 2)).toBeTruthy();
  });

  test("Invalid 1 pair", () => {
    const invalidOnePair = [
      {
        suit: "Diamonds",
        value: 6,
      },
      {
        suit: "Hearts",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 2,
      },
      {
        suit: "Diamonds",
        value: 3,
      },
      {
        suit: "Spades",
        value: 8,
      },
    ];
    expect(multiples(invalidOnePair, 2)).toBeFalsy();
  });
});

describe("Winner evaluation", () => {
  test("High Card vs 1 Pair", () => {
    const player1 = {
      rank: {
        level: 1,
        type: "High Card",
      },
    };
    const player2 = {
      rank: {
        level: 2,
        type: "One Pair",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("One Pair");
  });

  test("1 Pair vs 2 Pair", () => {
    const player1 = {
      rank: {
        level: 2,
        type: "One Pair",
      },
    };
    const player2 = {
      rank: {
        level: 3,
        type: "Two Pair",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("Two Pair");
  });

  test("2 Pair vs 3 of a Kind", () => {
    const player1 = {
      rank: {
        level: 3,
        type: "Two Pair",
      },
    };
    const player2 = {
      rank: {
        level: 4,
        type: "Three of a Kind",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("Three of a Kind");
  });

  test("3 of a Kind vs Straight", () => {
    const player1 = {
      rank: {
        level: 4,
        type: "Three of a Kind",
      },
    };
    const player2 = {
      rank: {
        level: 5,
        type: "Straight",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("Straight");
  });

  test("Straight vs Flush", () => {
    const player1 = {
      rank: {
        level: 5,
        type: "Straight",
      },
    };
    const player2 = {
      rank: {
        level: 6,
        type: "Flush",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("Flush");
  });

  test("Flush vs Full House", () => {
    const player1 = {
      rank: {
        level: 6,
        type: "Flush",
      },
    };
    const player2 = {
      rank: {
        level: 7,
        type: "Full House",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("Full House");
  });

  test("Full House vs 4 of a Kind", () => {
    const player1 = {
      rank: {
        level: 7,
        type: "Full House",
      },
    };
    const player2 = {
      rank: {
        level: 8,
        type: "Four of a Kind",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("Four of a Kind");
  });

  test("4 of a Kind vs Straight Flush", () => {
    const player1 = {
      rank: {
        level: 8,
        type: "Four of a Kind",
      },
    };
    const player2 = {
      rank: {
        level: 9,
        type: "Straight Flush",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("Straight Flush");
  });

  test("Straight Flush vs Royal Flush", () => {
    const player1 = {
      rank: {
        level: 9,
        type: "Straight Flush",
      },
    };
    const player2 = {
      rank: {
        level: 10,
        type: "Royal Flush",
      },
    };
    const winner = evaluateWinner([player1, player2]);
    const winningRank = winner[0].rank.type;
    expect(winningRank).toBe("Royal Flush");
  });
});
