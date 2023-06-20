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

afterAll(async () => {
  testEnv.clearFirestore();
});

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
});

describe("Invalid authenticated actions", () => {});

describe("unauthenticated actions", async () => {
  test("An unauthenticated user can not read all games", async () => {
    const authenticatedUserId = "authUser1234";
    const gameId = "gameId1234";
    const authenticatedUser = testEnv.authenticatedContext(authenticatedUserId);

    const mockGame = {
      name: "My test poker game",
      playerAmount: 2,
      owner: authenticatedUserId,
      started: false,
    };
    const createGameDocRef = doc(
      authenticatedUser.firestore(),
      `games/${gameId}`
    );

    // Create a game with a authenticated user
    await setDoc(createGameDocRef, mockGame);

    const userId = "userid3";
    const unauthenticatedUser = testEnv.unauthenticatedContext(userId);
    // Try to read the document as the unauthenticated user
    const q = query(collection(unauthenticatedUser.firestore(), "games"));
    await assertFails(getDocs(q));
  });

  test("An unauthenticated user can not create a game", async () => {
    const userId = "userid3";
    const gameId = "gameId2468";
    const mockGame = {
      name: "Unauthenticated Poker Game",
      playerAmount: 2,
      owner: userId,
      started: false,
    };
    const unauthenticatedUser = testEnv.unauthenticatedContext(userId);
    const gameDocRef = doc(unauthenticatedUser.firestore(), `games/${gameId}`);
    await assertFails(setDoc(gameDocRef, mockGame));
  });

  test("An unauthenticated user can not start a game", async () => {
    const userId = "userid1";
    const gameId = "gameId1234";
    const unauthenticatedUser = testEnv.unauthenticatedContext(userId);
    const gameDocRef = doc(unauthenticatedUser.firestore(), `games/${gameId}`);

    await assertFails(
      updateDoc(gameDocRef, {
        started: true,
      })
    );
  });

  test("An unauthenticated user can not join a game", async () => {
    const unauthenticatedUserId = "unauthUser1234";
    const gameId = "gameId1234";
    const unauthenticatedUser = testEnv.unauthenticatedContext(
      unauthenticatedUserId
    );

    const gameDocRef = doc(
      unauthenticatedUser.firestore(),
      `games/${gameId}/players/${unauthenticatedUserId}`
    );

    // Attempt to join a game as a unauthenticated user
    await assertFails(
      setDoc(gameDocRef, {
        playerId: unauthenticatedUserId,
        isTurn: false,
        discardPile: [],
      })
    );
  });

  test("An unauthenticated user can not update someone elses deck", async () => {
    const authenticatedUserId = "userid2";
    const unauthenticatedUserId = "userid3";
    const gameId = "gameId1234";
    const authenticatedUser = testEnv.authenticatedContext(authenticatedUserId);
    const gameDocRef = doc(
      authenticatedUser.firestore(),
      `games/${gameId}/players/${authenticatedUserId}`
    );
    // Join a game with autheneticated user
    await setDoc(gameDocRef, {
      playerId: authenticatedUserId,
      isTurn: false,
      discardPile: [],
    });

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
    const unauthenticatedUser = testEnv.unauthenticatedContext(
      unauthenticatedUserId
    );
    const playerDocRef = doc(
      unauthenticatedUser.firestore(),
      `games/${gameId}/players/${authenticatedUserId}`
    );
    // Try to update another players hand
    await assertFails(
      updateDoc(playerDocRef, {
        hand: newCardsForSwap,
      })
    );
  });

  test("An unauthenticated user can not delete a game", async () => {
    const gameId = "gameId1234";
    const userId = "userid1";
    const unauthenticatedUser = testEnv.unauthenticatedContext(userId);
    const gameDocRef = doc(unauthenticatedUser.firestore(), `games/${gameId}`);

    await assertFails(deleteDoc(gameDocRef));
  });
});

