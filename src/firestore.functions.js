import { addDoc, collection, query, onSnapshot } from "firebase/firestore";
import firestore from "../firestore";

export const createGame = (gameName, ownerId) => {
  const gameCollectionRef = collection(firestore, "games");
  addDoc(gameCollectionRef, {
    owner: ownerId,
    name: gameName,
  });
};

export const getGames = (setGames) => {
    const gameCollectionRef = collection(firestore, "games");

    const gamesQuery = query(gameCollectionRef)

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
      return () => unsubscribe()
}