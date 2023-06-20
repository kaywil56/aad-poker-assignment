import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import UserDetailsLayout from "../routes/UserDetailsLayout";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../AuthContext";
import { signOut } from "firebase/auth";

describe("User details layout component test", () => {
  beforeEach(() => {
    const authContext = {
      email: "testmail@mail.com",
    };
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ authContext }}>
          <UserDetailsLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("User details layout component renders properly", () => {
    vi.mock("firebase/auth", () => {
      return { getAuth: vi.fn(), signOut: vi.fn() };
    });

    expect(screen.getByText("Poker Room")).to.exist;
    expect(screen.getByText("Email:")).to.exist;
    expect(screen.getByText("testmail@mail.com")).to.exist;
    expect(screen.getByText("Sign out")).to.exist;
  });

  test("Sign out gets called", () => {
    vi.mock("firebase/auth", () => {
      return { getAuth: vi.fn(), signOut: vi.fn() };
    });

    const signOutButton = screen.getByText("Sign out");
    fireEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalledOnce();
  });
});
