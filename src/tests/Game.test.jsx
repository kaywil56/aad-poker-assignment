import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { startGame, joinGame } from "../firestoreFunctions";
import Game from "../components/Session/Game";
import AuthContext from "../AuthContext";

describe("Game component test", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Currently joined game component renders properly", () => {
    // Pass the same id and currentGameId to get the joined version of the component
    const mockGame = {
      name: "John Doe's poker game night",
      owner: "johndoe1",
      id: "gid1",
      joinedPlayers: ["user1"],
    };
    
    const authContext = {
      email: "testmail@mail.com",
      uid: "user1",
    };
    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          game={mockGame}
          currentGameId={"gid1"}
          setCurrentGameId={vi.fn()}
        />
      </AuthContext.Provider>
    );
    expect(screen.getByText("Name:")).to.exist;
    expect(screen.getByText("John Doe's poker game night")).to.exist;
    // Join should not exist because the player has already joined
    expect(screen.queryByText("Join")).to.not.exist;
  });

  test("Player has not joined Game component renders properly", () => {
    // Pass different id and currentGameId to get the unjoined version of the component
    const mockGame = {
      name: "John Doe's poker game night",
      owner: "johndoe1",
      id: "gid1",
      joinedPlayers: [],
    };
    render(
      <Game game={mockGame} currentGameId={"gid1"} setCurrentGameId={vi.fn()} />
    );
    expect(screen.getByText("Name:")).to.exist;
    expect(screen.getByText("John Doe's poker game night")).to.exist;
    expect(screen.getByText("Join")).to.exist;
  });

  test("joinGame is called with correct params", () => {
    vi.mock("../firestoreFunctions", () => {
      return { joinGame: vi.fn(), startGame: vi.fn() };
    });

    const authContext = {
      email: "testmail@mail.com",
      uid: "uid1",
    };

    const mockGame = {
      name: "John Doe's poker game night",
      owner: "johndoe1",
      id: "gid1",
      joinedPlayers: [],
      maxPlayers: 3
    };

    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          game={mockGame}
          currentGameId={0}
          setCurrentGameId={vi.fn()}
        />
      </AuthContext.Provider>
    );

    const joinGameButton = screen.getByRole("button", {
      name: "Join",
    });

    fireEvent.click(joinGameButton);

    expect(joinGame).toHaveBeenCalledWith(
      "uid1",
      "gid1",
      false,
      "testmail@mail.com"
    );
  });

  test("Start Game button visible for game owner", () => {
    const authContext = {
      email: "testmail@mail.com",
      uid: "johndoe1",
    };

    const mockGame = {
      name: "John Doe's poker game night",
      owner: "johndoe1",
      id: "gid1",
      joinedPlayers: ["johndoe1"],
    };

    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          game={mockGame}
          currentGameId={"gid1"}
          setCurrentGameId={vi.fn()}
        />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Start Game")).to.exist;
  });

  test("Start Game button not visible for normal player", () => {
    const authContext = {
      email: "testmail@mail.com",
      uid: "uid1",
    };

    const mockGame = {
      name: "John Doe's poker game night",
      owner: "johndoe1",
      id: "gid1",
      joinedPlayers: ["uid1"],
    };

    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          game={mockGame}
          currentGameId={"gid1"}
          setCurrentGameId={vi.fn()}
        />
      </AuthContext.Provider>
    );

    expect(screen.queryByText("Start Game")).to.not.exist;
  });

  test("startGame get called with correct params", () => {
    vi.mock("../firestoreFunctions", () => {
      return { joinGame: vi.fn(), startGame: vi.fn() };
    });

    const mockGame = {
      name: "John Doe's poker game night",
      owner: "johndoe1",
      id: "gid1",
      joinedPlayers: ["johndoe1", "userid1"],
    };
    
    const authContext = {
      email: "testmail@mail.com",
      uid: "johndoe1",
    };

    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          game={mockGame}
          currentGameId={"gid1"}
          setCurrentGameId={vi.fn()}
        />
      </AuthContext.Provider>
    );

    screen.debug()

    const startGameButton = screen.getByRole("button", {
      name: "Start Game",
    });

    fireEvent.click(startGameButton);

    expect(startGame).toHaveBeenCalledWith("gid1");
  });
});
