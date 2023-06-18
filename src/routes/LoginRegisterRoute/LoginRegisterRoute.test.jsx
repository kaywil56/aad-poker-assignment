import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import LoginRegisterRoute from "./LoginRegisterRoute";
import { MemoryRouter } from "react-router-dom";
import { login, register } from "../../firestoreFunctions";

// Mock firestore create function
vi.mock("../../firestoreFunctions", () => {
  return { login: vi.fn(), register: vi.fn() };
});

describe("Login component test", () => {
  // Render the Login for each case
  beforeEach(() => {
    render(
      <MemoryRouter>
        <LoginRegisterRoute
          setIsLoading={vi.fn()}
          isLoading={false}
          setErrorMessage={vi.fn()}
          errorMessage={""}
          text={"Login"}
        />
      </MemoryRouter>
    );
  });

  test("Login component renders properly", () => {
    // Assert that mock props are displayed
    expect(screen.getAllByText("Login")).to.exist;
    expect(screen.getByText("Dont have an account?")).to.exist;
    expect(screen.getByText("Click here to register")).to.exist;
  });

  test("Successful login", () => {
    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    fireEvent.change(emailInput, {
      target: { value: "jdoe@test.mail.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "superstrongpassword" },
    });

    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginButton);

    expect(login).toHaveBeenCalledWith(
      expect.anything(),
      "jdoe@test.mail.com",
      "superstrongpassword"
    );
  });
});

describe("Login component test", () => {
  // Render the Login for each case
  beforeEach(() => {
    render(
      <MemoryRouter>
        <LoginRegisterRoute
          setIsLoading={vi.fn()}
          isLoading={false}
          setErrorMessage={vi.fn()}
          errorMessage={""}
          text={"Register"}
        />
      </MemoryRouter>
    );
  });

  test("Register component renders properly", () => {
    // Assert that mock props are displayed
    expect(screen.getAllByText("Register")).to.exist;
    expect(screen.getByText("Go back")).to.exist;
  });

  test("Successful register", () => {
    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");

    fireEvent.change(emailInput, {
      target: { value: "jdoe@test.mail.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "superstrongpassword" },
    });

    const registerButton = screen.getByRole("button", { name: "Register" });
    fireEvent.click(registerButton);

    expect(register).toHaveBeenCalledWith(
      expect.anything(),
      "jdoe@test.mail.com",
      "superstrongpassword"
    );
  });
});
