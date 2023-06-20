import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { joinGame, startGame } from "../firestoreFunctions";
import Game from "../components/Session/Game";
import AuthContext from "../AuthContext";

describe("Game component test", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Currently joined game component renders properly", () => {
    // Pass the same id and currentGameId to get the joined version of the component
    render(
      <Game
        name={"John Doe's poker game night"}
        id={"gid1"}
        owner={"johndoe1234"}
        currentGameId={"gid1"}
        setCurrentGameId={vi.fn()}
      />
    );
    expect(screen.getByText("Name:")).to.exist;
    expect(screen.getByText("John Doe's poker game night")).to.exist;
    // Join should not exist because the player has already joined
    expect(screen.queryByText("Join")).to.not.exist;
  });

  test("Player has not joined Game component renders properly", () => {
    // Pass different id and currentGameId to get the unjoined version of the component
    render(
      <Game
        name={"John Doe's poker game night"}
        id={"gid1"}
        owner={"johndoe1234"}
        currentGameId={"gid2"}
        setCurrentGameId={vi.fn()}
      />
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

    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          name={"John Doe's poker game night"}
          id={"gid1"}
          owner={"johndoe1234"}
          currentGameId={"gid2"}
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
      uid: "uid1",
    };

    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          name={"John Doe's poker game night"}
          id={"gid1"}
          owner={"uid1"}
          currentGameId={"gid2"}
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

    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          name={"John Doe's poker game night"}
          id={"gid1"}
          owner={"normalplayerid1"}
          currentGameId={"gid2"}
          setCurrentGameId={vi.fn()}
        />
      </AuthContext.Provider>
    );

    expect(screen.queryByText("Start Game")).to.not.exist;
  });

  test("startGame get called with correct params", () => {
    const authContext = {
      email: "testmail@mail.com",
      uid: "gameownerid1",
    };

    vi.mock("../firestoreFunctions", () => {
      return { joinGame: vi.fn(), startGame: vi.fn() };
    });

    render(
      <AuthContext.Provider value={{ authContext }}>
        <Game
          name={"John Doe's poker game night"}
          id={"gid1"}
          owner={"gameownerid1"}
          currentGameId={"gid2"}
          setCurrentGameId={vi.fn()}
        />
      </AuthContext.Provider>
    );

    const startGameButton = screen.getByRole("button", {
      name: "Start Game",
    });

    fireEvent.click(startGameButton);

    expect(startGame).toHaveBeenCalledWith("gid1");
  });
});
