import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import CreateGame from "../components/Session/CreateGame";
import { createGame } from "../firestoreFunctions";

describe("Create game component test", () => {
  beforeEach(() => {
    render(<CreateGame setCurrentGameId={vi.fn()} />);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Create game component renders properly", () => {
    // Assert that mock props are displayed
    expect(screen.getAllByText("Create Game")).to.exist;
    expect(screen.getByText("Game Name")).to.exist;
    expect(screen.getByText("Max Players")).to.exist;
  });

  test("createGame is called with correct params", () => {
    vi.mock("../firestoreFunctions", () => {
      return { createGame: vi.fn(), joinGame: vi.fn() };
    });

    const gameNameInput = screen.getByPlaceholderText("Game name");
    const createGameButton = screen.getByRole("button", {
      name: "Create Game",
    });

    fireEvent.change(gameNameInput, {
      target: { value: "John Doe's poker game night" },
    });
    fireEvent.click(createGameButton);

    expect(createGame).toHaveBeenCalledOnce();
  });
});
