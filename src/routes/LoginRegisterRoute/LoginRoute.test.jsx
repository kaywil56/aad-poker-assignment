import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import LoginRegisterRoute from "./LoginRegisterRoute";
import { MemoryRouter } from "react-router-dom";

// // Mock firestore create function
// vi.mock("../firestore.service", () => {
//   return { createTodo: vi.fn() };
// });

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

  //   test("create todo", () => {
  //     // Select edit input elements
  //     const titleInput = screen.getByRole("textbox", { name: "title" });
  //     const descriptionInput = screen.getByRole("textbox", {
  //       name: "description",
  //     });
  //     // Add test input
  //     fireEvent.change(titleInput, {
  //       target: { value: "Finish Project" },
  //     });
  //     fireEvent.change(descriptionInput, {
  //       target: { value: "Complete final steps" },
  //     });
  //     // Fire the create todo event
  //     const createTodoBtn = screen.getByText(/Submit/i);
  //     fireEvent.click(createTodoBtn);

  //     // Expect the update to to be called once
  //     expect(createTodo).toHaveBeenCalledWith({
  //       title: "Finish Project",
  //       description: "Complete final steps",
  //     });
  //   });
});
