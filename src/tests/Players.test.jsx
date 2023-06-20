import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Players from '../components/Game/Players'

describe("Players component test", () => {
  test("Players component renders properly", () => {
    const mockPlayers = [
      {
        email: "player1@mail.com",
        isTurn: true,
        playerId: "playerId1",
      },
      {
        email: "player2@mail.com",
        isTurn: false,
        playerId: "playerId2",
      },
      {
        email: "player3@mail.com",
        isTurn: false,
        playerId: "playerId3",
      },
    ];
    render(<Players players={mockPlayers} currentPlayerId={"playerId1"} />);
    // This email should not be on screen and intead replaced with "you"
    // indicating that this is from player 1s view
    expect(screen.queryByText("player1@mail.com")).to.not.exist;
    expect(screen.getByText(/you/)).to.exist;

    expect(screen.getByText(/player2@mail.com/)).to.exist;
    expect(screen.getByText(/player3@mail.com/)).to.exist;
  });
});
