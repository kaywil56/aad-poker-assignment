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

export const createGame = (gameName, ownerId) => {
  const gameCollectionRef = collection(firestore, "games");
  const newGameDocRef = addDoc(gameCollectionRef, {
    owner: ownerId,
    name: gameName,
    started: false,
  });

  // Auto join self to game
  newGameDocRef.then((doc) => {
    return doc.id;
  });
};



export const getGames = (
  setGames,
  currentGameContext,
  setCurrentGameContext
) => {
  const gameCollectionRef = collection(firestore, "games");

  const gamesQuery = query(gameCollectionRef);

  const unsubscribe = onSnapshot(gamesQuery, (querySnapshot) => {
    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        name: doc.data().name,
        started: doc.data().started,
      });
    });
    setGames(games);
    console.log(games)

    // if the player has joined a game and the game is started update values
    const currentGame = games.find(
      (game) => game.gameId === currentGameContext.gameId
    );

    if (currentGame?.started) {
      console.log("started");
      currentGameContext.started = true;
      setCurrentGameContext(currentGameContext);
    }
  });
  return () => unsubscribe();
};

export const joinGame = (userId, gameId) => {
  const playersDocRef = doc(firestore, "games", gameId, "players", userId);

  setDoc(playersDocRef, {
    playerId: userId,
  });
};

export const startGame = (gameId) => {
  const gameDocRef = doc(firestore, "games", gameId);

  updateDoc(gameDocRef, {
    started: true,
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

export const updateHand = (gameId, playerId, hand) => {
  const playerDocRef = doc(firestore, "games", gameId, "players", playerId);

  console.log("update hand")
  console.log(hand)

  updateDoc(playerDocRef, {
    hand: hand,
  });
};
