import { render, screen } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import Hand from "../components/Game/Hand";

describe("Hand component test", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    const mockDeck = [
      {
        value: 11,
        suit: "Diamonds",
      },
      {
        value: 12,
        suit: "Spades",
      },
      {
        value: 13,
        suit: "Clubs",
      },
      {
        value: 14,
        suit: "Hearts",
      },
    ];

    const updateSelectedCards = vi.fn();

    render(
      <Hand
        cards={mockDeck}
        updateSelectedCards={updateSelectedCards}
        checkIfSelected={vi.fn()}
      />
    );
  });

  test("Face cards and suits render properly", () => {
    // The convertToFaceValue functions works properly
    expect(screen.getByText("J")).to.exist;
    expect(screen.getByText("K")).to.exist;
    expect(screen.getByText("Q")).to.exist;
    expect(screen.getByText("A")).to.exist;

    // The convertToSuit functions works properly
    expect(screen.getByText("♦")).to.exist;
    expect(screen.getByText("♠")).to.exist;
    expect(screen.getByText("♣")).to.exist;
    expect(screen.getByText("♥")).to.exist;
  });
});
