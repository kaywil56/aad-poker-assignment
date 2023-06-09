import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Navigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {
  createGame,
  getGames,
  joinGame,
  startGame,
} from "../firestoreFunctions";

const Session = () => {
  const { authContext } = useContext(AuthContext);
  const [currentGameId, setCurrentGameId] = useState(0);

  const auth = getAuth();
  const [gameName, setGameName] = useState("");
  const [games, setGames] = useState([]);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    const gameId = await createGame(gameName, authContext.uid);
    joinGame(authContext.uid, gameId, true);
    setCurrentGameId(gameId);
    setGameName("");
  };

  const handleJoinGame = (gameId) => {
    joinGame(authContext.uid, gameId, false);
    setCurrentGameId(gameId);
  };

  const handleStartGame = (gameId) => {
    startGame(gameId);
  };

  useEffect(() => {
    getGames(setGames);
  }, []);

  // Protect route
  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  // If the game that the player currently belongs to is started
  if (games.find((game) => game.id === currentGameId)?.started) {
    return (
      <Navigate
        to="/game"
        state={{
          gameId: currentGameId,
          owner: games.find((game) => game.id === currentGameId)?.owner,
          playerAmount: 2, // COME BACK AND CHANGE THIS
        }}
      />
    );
  }

  return (
    <>
      <h2>Create Session</h2>
      <form action="submit" onSubmit={handleCreateGame}>
        <input
          onChange={(e) => setGameName(e.target.value)}
          type="text"
          placeholder="Game name"
          value={gameName}
        />
        <button type="submit">Create Game</button>
      </form>
      <h2>Join Session</h2>
      <ul>
        {games.map((game, idx) => {
          if (!game.started) {
            return (
              <li key={idx}>
                {`${game.name}`}
                {game.id !== currentGameId && (
                  <button onClick={() => handleJoinGame(game.id)}>Join</button>
                )}
                {game.owner === authContext.uid && (
                  <button onClick={() => handleStartGame(game.id)}>
                    Start Game
                  </button>
                )}
              </li>
            );
          }
        })}
      </ul>
      {/* just leaving this here for the moment */}
      <button onClick={() => signOut(auth)}>Sign out</button>
    </>
  );
};

export default Session;
