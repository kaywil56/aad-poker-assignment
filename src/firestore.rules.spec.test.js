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
  query,
  getDocs,
  updateDoc,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { createDeck } from "./handEvaluations";

const PROJECT_ID = "poker-pwa-assignment";

const testEnv = await initializeTestEnvironment({
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
    const gameId = "gameId1234";
    const mockGame = {
      name: "My test poker game",
      playerAmount: 2,
      owner: userId,
      started: false,
    };
    const authenticatedUser = testEnv.authenticatedContext(userId);
    const gameDocRef = doc(authenticatedUser.firestore(), `games/${gameId}`);
    await assertSucceeds(setDoc(gameDocRef, mockGame));
  });

  test("An authenticated user can read all games", async () => {
    const userId = "userid2";
    const authenticatedUser = testEnv.authenticatedContext(userId);
    // Try to read the document as the authenticated user
    const q = query(collection(authenticatedUser.firestore(), "games"));
    await assertSucceeds(getDocs(q));
  });

  test("An authenticated user can start a game they created", async () => {
    const userId = "userid1";
    const gameId = "gameId1234";
    const authenticatedUser = testEnv.authenticatedContext(userId);
    const gameDocRef = doc(authenticatedUser.firestore(), `games/${gameId}`);
    // Try to read the document as the authenticated user
    await assertSucceeds(
      updateDoc(gameDocRef, {
        started: true,
      })
    );
  });

  test("An authenticated user can join a game", async () => {
    const userId = "userid2";
    const gameId = "gameId1234";
    const authenticatedUser = testEnv.authenticatedContext(userId);
    const gameDocRef = doc(
      authenticatedUser.firestore(),
      `games/${gameId}/players/${userId}`
    );
    await assertSucceeds(
      setDoc(gameDocRef, {
        playerId: userId,
        isTurn: false,
        discardPile: [],
      })
    );
  });

  test("An authenticated game owner can deal all players a hand", async () => {
    const userId = "userid1";
    const gameId = "gameId1234";
    const deck = createDeck();
    console.log("works");
    const authenticatedUser = testEnv.authenticatedContext(userId);
    const firestore = authenticatedUser.firestore();

    const batch = writeBatch(firestore);

    const shuffledDeck = deck.sort(() => Math.random() - 0.5);

    const playersQuery = collection(firestore, "games", gameId, "players");
    const playersSnapshot = await getDocs(playersQuery);

    playersSnapshot.forEach((doc) => {
      let hand = shuffledDeck.splice(0, 5);
      batch.update(doc.ref, { hand: hand });
    });

    await assertSucceeds(batch.commit());
  });

  test("An authenticated user can update their own deck", async () => {
    const userId = "userid2";
    const gameId = "gameId1234";
    const newCardsForSwap = [
      {
        suit: "Diamonds",
        value: 7,
      },
      {
        suit: "Diamonds",
        value: 2,
      },
      {
        suit: "Spades",
        value: 4,
      },
      {
        suit: "Clubs",
        value: 3,
      },
    ];
    const authenticatedUser = testEnv.authenticatedContext(userId);
    const playerDocRef = doc(
      authenticatedUser.firestore(),
      `games/${gameId}/players/${userId}`
    );
    // Try to read the document as the authenticated user
    await assertSucceeds(
      updateDoc(playerDocRef, {
        hand: newCardsForSwap,
      })
    );
  });

  test("A game owner can delete a their game", async () => {
    const gameId = "gameId1234";
    const userId = "userid1";
    const authenticatedUser = testEnv.authenticatedContext(userId);
    const gameDocRef = doc(authenticatedUser.firestore(), `games/${gameId}`);

    await assertSucceeds(deleteDoc(gameDocRef));
  });

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
