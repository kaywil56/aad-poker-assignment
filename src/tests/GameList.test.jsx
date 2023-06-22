import { render, screen } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import AuthContext from "../AuthContext";
import GameList from "../components/Session/GameList";

describe("GameList component test", () => {
  beforeEach(() => {
    const mockGames = [
      {
        name: "John's poker game",
        id: "gid1",
        owner: "john1234",
        joinedPlayers: ["john1234"]
      },
      {
        name: "Janes's poker game",
        id: "gid2",
        owner: "jane1234",
        joinedPlayers: ["jane1234"]
      },
      {
        name: "Poker game",
        id: "gid3",
        owner: "fred1234",
        joinedPlayers: ["fred1234"]
      },
    ];
    const authContext = {
      email: "johndoe@mail.com",
      uid: "john1234",
    };

    render(
        // Pass gid1 as the currentGameId to simulate that the user has joined "John's poker game"
      <AuthContext.Provider value={{ authContext }}>
        <GameList
          games={mockGames}
          currentGameId={"gid1"}
          setCurrentGameId={vi.fn()}
        />
      </AuthContext.Provider>
    );
  });

  test("Game list component renders properly", () => {
    expect(screen.getByText("Games"))
    const allNameText = screen.getAllByText("Name:")
    // Expect name text to render 3 times as we have 3 games 
    expect(allNameText).toHaveLength(3)

    const allJoinButtons = screen.getAllByText("Join")
    // Expect join buttons to appear twice and not three times since the user has already joined a game
    expect(allJoinButtons).toHaveLength(2)

    expect(screen.getByText("John's poker game")).to.exist
    expect(screen.getByText("Janes's poker game")).to.exist
    expect(screen.getByText("Poker game")).to.exist

    const startGameButton = screen.getAllByText("Start Game")
    // Start game button should appear once since john1234 is the game owner of John's poker game in this current context
    expect(startGameButton).toHaveLength(1)
  });
});
