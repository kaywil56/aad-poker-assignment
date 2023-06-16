import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Navigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getGames, joinGame, startGame } from "../firestoreFunctions";
import Game from "../components/Session/Game";
import CreateGame from "../components/Session/CreateGame";

const SessionRoute = () => {
  const { authContext } = useContext(AuthContext);
  const [currentGameId, setCurrentGameId] = useState(0);

  const auth = getAuth();
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames(setGames);
  }, []);

  const handleJoinGame = (gameId) => {
    joinGame(authContext.uid, gameId, false);
    setCurrentGameId(gameId);
  };

  const handleStartGame = (gameId) => {
    startGame(gameId);
  };

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
      <CreateGame setCurrentGameId={setCurrentGameId} />
      <h2>Join Session</h2>
      <ul>
        {games.map((game, idx) => {
          if (!game.started) {
            return (
              <Game
                key={idx}
                name={game.name}
                id={game.id}
                owner={game.owner}
                currentGameId={currentGameId}
                handleJoinGame={handleJoinGame}
                handleStartGame={handleStartGame}
              />
            );
          }
        })}
      </ul>
      {/* just leaving this here for the moment */}
      <button onClick={() => signOut(auth)}>Sign out</button>
    </>
  );
};

export default SessionRoute;
