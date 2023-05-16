import { addDoc, collection, query, onSnapshot } from "firebase/firestore";
import firestore from "../firestore";

export const createGame = (gameName, ownerId) => {
  const gameCollectionRef = collection(firestore, "games");
  const newGameDocRef = addDoc(gameCollectionRef, {
    owner: ownerId,
    name: gameName,
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
  const playersCollectionRef = collection(
    firestore,
    "games",
    gameId,
    "players"
  );

  addDoc(playersCollectionRef, {
    playerId: userId,
  });
};
