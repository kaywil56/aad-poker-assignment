import { addDoc, collection, query, onSnapshot, doc, setDoc } from "firebase/firestore";
import firestore from "../firestore";

export const createGame = (gameName, ownerId) => {
  const gameCollectionRef = collection(firestore, "games");
  const newGameDocRef = addDoc(gameCollectionRef, {
    owner: ownerId,
    name: gameName,
    started: false,
  });

  // Auto join self to game
  newGameDocRef.then((doc) => {
    joinGame(ownerId, doc.id);
  });
};

export const getGames = (setGames) => {
  const gameCollectionRef = collection(firestore, "games");

  const gamesQuery = query(gameCollectionRef);

  const unsubscribe = onSnapshot(gamesQuery, (querySnapshot) => {
    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        name: doc.data().name,
        owner: doc.data().owner,
      });
    });
    setGames(games);
  });
  return () => unsubscribe();
};

export const joinGame = (userId, gameId) => {
  const playersDocRef = doc(firestore, "games", gameId, "players", userId);

  setDoc(playersDocRef, {
    playerId: userId,
  });
};

export const getPlayers = (gameId, setPlayers) => {
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
      players.push({
        id: doc.id,
        playerId: doc.data().playerId,
      });
    });
    setPlayers(players);
  });
  return () => unsubscribe();
};
