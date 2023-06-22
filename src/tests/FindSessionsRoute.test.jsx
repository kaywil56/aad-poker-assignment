import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FindSessionsRoute from "../routes/FindSessionsRoute";
import AuthContext from "../AuthContext";
import { getGames } from "../firestoreFunctions";

describe("FindSessions route component test", () => {
  // Render the Login for each case
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Find sessions route component renders with games", async () => {
    const authContext = {
      uid: "jdoe1234",
    };
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ authContext }}>
          <FindSessionsRoute />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Mock the getGames function and set Games state with mock games
    vi.mock("../firestoreFunctions", () => {
      return {
        getGames: vi.fn((setGames) => {
          const mockGames = [
            {
              name: "My test game",
              id: "gid1",
              owner: "jdoe1234",
              joinedPlayers: ["jdoe1234"]
            },
            {
              name: "Poker",
              id: "gid2",
              owner: "jane1234",
              joinedPlayers: ["jane1234"]
            },
            {
              name: "Game night",
              id: "gid3",
              owner: "fred1234",
              joinedPlayers: ["fred1234"]
            },
          ];
          setGames(mockGames);
        }),
      };
    });

    // Assert that mock props are displayed
    expect(screen.getByText("Game Name")).to.exist;
    expect(screen.getByText("Max Players")).to.exist;

    // CreateGame.jsx rendered
    const createGameElements = screen.getAllByText("Create Game");
    // Create game title and button to be rendered
    expect(createGameElements).toHaveLength(2);

    // Mock games rendered
    expect(screen.getByText("My test game")).to.exist;
    expect(screen.getByText("Poker")).to.exist;
    expect(screen.getByText("Game night")).to.exist;
  });

  test("No render if no authContext", () => {
    const authContext = {
      uid: undefined,
    };
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ authContext }}>
          <FindSessionsRoute />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Assert that mock props are not displayed
    expect(screen.queryByText("Game Name")).to.not.exist;
    expect(screen.queryByText("Max Players")).to.not.exist;
  });
});
