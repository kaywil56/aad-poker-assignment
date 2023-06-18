import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import fs from "fs";
import { test, describe } from "vitest";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const PROJECT_ID = "poker-pwa-assignment";

let testEnv = await initializeTestEnvironment({
  projectId: PROJECT_ID,
  hub: {
    host: "localhost",
    port: 4400,
  },
  firestore: {
    rules: fs.readFileSync("firestore.rules", "utf8"),
  },
});

// afterAll(async () => {
//   testEnv.clearFirestore();
// });

describe("Valid actions", () => {
  test("An authenticated user can create a game", async () => {
    const userId = "userid1";
    const mockGame = {
      name: "My test poker game",
      playerAmount: 2,
      owner: userId,
      started: false,
    };
    const authenticatedUser = testEnv.authenticatedContext(userId);
    const gameCollectionRef = collection(authenticatedUser.firestore(), "games");
    await assertSucceeds(addDoc(gameCollectionRef, mockGame));
  });

//   test("An authenticated user can read their todos with the same ID", async () => {
//     const userId = "userid1";
//     const todoId = "todoid1";
//     const authenticatedUser = testEnv.authenticatedContext(userId);
//     const userRef = doc(
//       authenticatedUser.firestore(),
//       `users/${userId}/todos/${todoId}`
//     );
//     // Try to read the document as the authenticated user
//     await assertSucceeds(getDoc(userRef));
//   });

//   test("An authenticated user can update a todo to their own collection", async () => {
//     const mockUpdateTodo = {
//       title: "Shopping",
//       description: "Buy milk, eggs, and bacon",
//     };
//     const todoId = "todoid1";
//     const userId = "userid1";
//     const authenticatedUser = testEnv.authenticatedContext(userId);
//     const todoDocRef = doc(
//       authenticatedUser.firestore(),
//       `users/${userId}/todos/${todoId}`
//     );

//     await assertSucceeds(setDoc(todoDocRef, mockUpdateTodo, { merge: true }));
//   });

//   test("An authenticated user can delete a todo to their own collection", async () => {
//     const todoId = "todoid1";
//     const userId = "userid1";
//     const authenticatedUser = testEnv.authenticatedContext(userId);
//     const todoDocRef = doc(
//       authenticatedUser.firestore(),
//       `users/${userId}/todos/${todoId}`
//     );

//     await assertSucceeds(deleteDoc(todoDocRef));
//   });
});

// describe("Invalid unauthenticated actions", () => {
//   test("unauthenticated user cant read a users todo", async () => {
//     const userId = "userid1";
//     const todoId = "todoid1";
//     const unauthenticatedUser = testEnv.unauthenticatedContext();
//     const userRef = doc(
//       unauthenticatedUser.firestore(),
//       `users/${userId}/todos/${todoId}`
//     );
//     // Try to read the document as the authenticated user
//     await assertFails(getDoc(userRef));
//   });

//   test("unauthenticated user cant create a todo in another users collection", async () => {
//     const mockTodo = {
//       title: "Shopping",
//       description: "Buy milk",
//     };
//     const userId = "userid1";
//     const unauthenticatedUser = testEnv.unauthenticatedContext();
//     const userDocRef = doc(unauthenticatedUser.firestore(), `users/${userId}`);
//     const todoColRef = collection(userDocRef, "todos");

//     await assertFails(addDoc(todoColRef, mockTodo));
//   });

//   test("unnauthenticated user can not update a todo to another users collection", async () => {
//     const mockUpdateTodo = {
//       title: "Shopping",
//       description: "Buy milk, eggs, and bacon",
//     };
//     const todoId = "todoid1";
//     const userId = "userid1";
//     const unauthenticatedUser = testEnv.unauthenticatedContext();
//     const todoDocRef = doc(
//       unauthenticatedUser.firestore(),
//       `users/${userId}/todos/${todoId}`
//     );

//     await assertFails(setDoc(todoDocRef, mockUpdateTodo, { merge: true }));
//   });

//   test("An unauthenticated user can not delete a todo to their own collection", async () => {
//     const todoId = "todoid1";
//     const userId = "userid1";
//     const unauthenticatedUser = testEnv.unauthenticatedContext();
//     const todoDocRef = doc(
//       unauthenticatedUser.firestore(),
//       `users/${userId}/todos/${todoId}`
//     );

//     await assertFails(deleteDoc(todoDocRef));
//   });
// });

// describe("Invalid authenticated actions", () => {
//   test("authenticated user cant read another users todo", async () => {
//     const unauthenticatedUser = testEnv.authenticatedContext("userid2");
//     const userRef = doc(
//       unauthenticatedUser.firestore(),
//       "users/userid1/todos/todoid1"
//     );
//     // Try to read the document as the authenticated user
//     await assertFails(getDoc(userRef));
//   });

//   test("authenticated user cant create a todo in another users collection", async () => {
//     const mockTodo = {
//       title: "Shopping",
//       description: "Buy milk",
//     };
//     const unauthenticatedUser = testEnv.authenticatedContext("userid2");
//     const userDocRef = doc(unauthenticatedUser.firestore(), "users/todo1");
//     const todoColRef = collection(userDocRef, "todos");

//     await assertFails(addDoc(todoColRef, mockTodo));
//   });

//   test("authenticated user can not update a todo to another users collection", async () => {
//     const mockUpdateTodo = {
//       title: "Shopping",
//       description: "Buy milk, eggs, and bacon",
//     };
//     const unauthenticatedUser = testEnv.authenticatedContext("userid2");
//     const todoDocRef = doc(
//       unauthenticatedUser.firestore(),
//       "users/userid1/todos/todoid1"
//     );

//     await assertFails(setDoc(todoDocRef, mockUpdateTodo, { merge: true }));
//   });

//   test("authenticated user can not delete a todo to their own collection", async () => {
//     const unauthenticatedUser = testEnv.authenticatedContext("userid2");
//     const todoDocRef = doc(
//       unauthenticatedUser.firestore(),
//       "users/userid1/todos/todoid1"
//     );

//     await assertFails(deleteDoc(todoDocRef));
//   });
// });
