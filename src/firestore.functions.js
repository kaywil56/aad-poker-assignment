import {
  addDoc,
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firestore from "../firestore";

export const createGame = async (gameName, ownerId) => {
  const gameCollectionRef = collection(firestore, "games");
  const newGameDocRef = await addDoc(gameCollectionRef, {
    owner: ownerId,
    name: gameName,
    started: false,
  });
  
  return newGameDocRef.id;
};

export const getGames = (setGames) => {
  const gameCollectionRef = collection(firestore, "games");

  const gamesQuery = query(gameCollectionRef);

  const unsubscribe = onSnapshot(gamesQuery, async (querySnapshot) => {
    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        name: doc.data().name,
        started: doc.data().started,
      });
    });
    setGames(games);
  });
  return () => unsubscribe();
};

export const joinGame = async (userId, gameId, isTurn) => {
  const playersDocRef = doc(firestore, "games", gameId, "players", userId);

  await setDoc(playersDocRef, {
    playerId: userId,
    isTurn: isTurn,
  });
};

export const startGame = async (gameId) => {
  const gameDocRef = doc(firestore, "games", gameId);

  await updateDoc(gameDocRef, {
    started: true,
  });
};

export const getPlayers = (gameId, setPlayers) => {
  const playersCollectionRef = collection(firestore, "games", gameId, "players");

  const playersQuery = query(playersCollectionRef);

  const unsubscribe = onSnapshot(playersQuery, (querySnapshot) => {
    const players = [];
    querySnapshot.forEach((doc) => {
      players.push({
        id: doc.id,
        playerId: doc.data().playerId,
        hand: doc.data().hand,
        isTurn: doc.data().isTurn,
      });
    });
    setPlayers(players);
  });
  return () => unsubscribe();
};

export const updateHand = async (gameId, playerId, hand) => {
  const playerDocRef = doc(firestore, "games", gameId, "players", playerId);

  await updateDoc(playerDocRef, {
    hand: hand,
  });
};

export const updateHandRank = async (gameId, playerId, handRank) => {
  const playerDocRef = doc(firestore, "games", gameId, "players", playerId);

  await updateDoc(playerDocRef, {
    rank: handRank,
  });
};
