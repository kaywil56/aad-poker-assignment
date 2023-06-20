import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import GameOver from "../components/Game/GameOver";
import { MemoryRouter } from "react-router-dom";

describe("Game over component test", () => {
  test("GameOver component renders properly", () => {
    const mockWinner = {
      email: "test@mail.co.nz",
      rank: { type: "Three of a kind" },
    };
    render(
      <MemoryRouter>
        <GameOver winner={mockWinner} />
      </MemoryRouter>
    );
    // Assert that mock props are displayed
    expect(screen.getByText(/Three of a kind/)).to.exist;
    expect(screen.getByText(/test@mail.co.nz/)).to.exist;
  });
});
