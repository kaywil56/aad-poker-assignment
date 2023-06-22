import {
  addDoc,
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
  getDocs,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firestore from "../firestore";

// Create a game doc within the games collection
export const createGame = async (gameName, playerAmount, ownerId) => {
  const gameCollectionRef = collection(firestore, "games");
  const newGameDocRef = await addDoc(gameCollectionRef, {
    owner: ownerId,
    name: gameName,
    maxPlayers: playerAmount,
    started: false,
    joinedPlayers: [],
  });

  return newGameDocRef.id;
};

// Snapshot listener that gets games when a change is made in the game collection
export const getGames = async (setGames) => {
  const gameCollectionRef = collection(firestore, "games");

  const gamesQuery = query(gameCollectionRef);

  const unsubscribe = onSnapshot(gamesQuery, async (querySnapshot) => {
    const games = [];
    querySnapshot.forEach(async (doc) => {
      games.push({
        id: doc.id,
        name: doc.data().name,
        started: doc.data().started,
        maxPlayers: doc.data().maxPlayers,
        owner: doc.data().owner,
        joinedPlayers: doc.data().joinedPlayers,
      });
    });
    setGames(games);
  });

  return () => unsubscribe();
};

// Create a player doc for the current user
export const joinGame = async (userId, gameId, isTurn, email) => {
  const playersDocRef = doc(firestore, "games", gameId, "players", userId);
  const gameDocRef = doc(firestore, "games", gameId);

  // Add user id to games collection to make it easier to see how man players have joined a game
  await updateDoc(gameDocRef, {
    joinedPlayers: arrayUnion(userId),
  });

  await setDoc(playersDocRef, {
    playerId: userId,
    isTurn: isTurn,
    discardPile: [],
    email: email,
  });
};

// Remove player doc and player id from the game docs joinedPlayer list
export const leaveGame = async (userId, gameId) => {
  const playersDocRef = doc(firestore, "games", gameId, "players", userId);
  const gameDocRef = doc(firestore, "games", gameId);

  await updateDoc(gameDocRef, {
    joinedPlayers: arrayRemove(userId),
  });

  await deleteDoc(playersDocRef);
};

// Update the games started field
export const startGame = async (gameId) => {
  const gameDocRef = doc(firestore, "games", gameId);

  await updateDoc(gameDocRef, {
    started: true,
  });
};

// Snapshot listener that gets players when a change is made in the players collection
export const getPlayers = async (gameId, setPlayers, setHand, uid) => {
  const playersCollectionRef = collection(
    firestore,
    "games",
    gameId,
    "players"
  );

  const playersQuery = query(playersCollectionRef);

  const unsubscribe = onSnapshot(playersQuery, (querySnapshot) => {
    const players = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().playerId === uid) {
        setHand(doc.data().hand);
      }
      players.push({
        id: doc.id,
        email: doc.data().email,
        playerId: doc.data().playerId,
        hand: doc.data().hand,
        isTurn: doc.data().isTurn,
        rank: doc.data().rank,
        discardPile: doc.data().discardPile,
      });
    });

    setPlayers(players);
  });

  return () => unsubscribe();
};

// Post a hand of cards to the current players document
export const updateHand = async (gameId, playerId, hand) => {
  const playerDocRef = doc(firestore, "games", gameId, "players", playerId);

  await updateDoc(playerDocRef, {
    hand: hand,
  });
};

// Post hand rank to players collection e.g. "High card"
export const updateHandRank = async (gameId, playerId, handRank) => {
  const playerDocRef = doc(firestore, "games", gameId, "players", playerId);

  await updateDoc(playerDocRef, {
    rank: handRank,
  });
};

// Post discarded cards to the players discard pile
export const discardCards = async (gameId, playerId, discardedCards) => {
  const playerDocRef = doc(firestore, "games", gameId, "players", playerId);

  await updateDoc(playerDocRef, {
    discardPile: discardedCards,
  });
};

// Update the next players isTurn field within their doc
export const setNextPlayerTurn = async (gameId, playerId, nextPlayerId) => {
  const currentPlayerDocRef = doc(
    firestore,
    "games",
    gameId,
    "players",
    playerId
  );
  const nextPlayerDocRef = doc(
    firestore,
    "games",
    gameId,
    "players",
    nextPlayerId
  );

  await updateDoc(currentPlayerDocRef, {
    isTurn: false,
  });

  await updateDoc(nextPlayerDocRef, {
    isTurn: true,
  });
};

// Allows the game owner to deal all players in a game a random hand
// This prevents players from getting the same cards and trying to post them
// At the same time as other players
export const dealPlayersInitialCards = async (deck, gameId) => {
  const batch = writeBatch(firestore);

  const shuffledDeck = shuffleDeck(deck);

  const playersQuery = collection(firestore, "games", gameId, "players");
  const playersSnapshot = await getDocs(playersQuery);

  playersSnapshot.forEach((doc) => {
    let hand = shuffledDeck.splice(0, 5);
    batch.update(doc.ref, { hand: hand });
  });

  await batch.commit();
};

// Takes in a deck and returns a shuffled version of the deck
const shuffleDeck = (deck) => {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

// Posts login creds to firebase
export const login = async (auth, email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

// Posts register creds to firebase
export const register = async (auth, email, password) => {
  await createUserWithEmailAndPassword(auth, email, password);
};
