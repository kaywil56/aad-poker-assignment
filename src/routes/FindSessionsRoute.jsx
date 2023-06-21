import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Navigate } from "react-router-dom";
import { getGames } from "../firestoreFunctions";
import CreateGame from "../components/Session/CreateGame";
import GameList from "../components/Session/GameList";

const FindSessionsRoute = () => {
  const { authContext } = useContext(AuthContext);
  const [currentGameId, setCurrentGameId] = useState(0);

  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames(setGames);
  }, []);

  // Protect route
  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  const currentGame = games.find((game) => game.id === currentGameId);

  // If the game that the player currently belongs to is started
  if (currentGame?.started) {
    return (
      <Navigate
        to="/session/game"
        state={{
          gameId: currentGameId,
          owner: currentGame?.owner,
          playerAmount: currentGame?.playerAmount,
        }}
      />
    );
  }

  return (
    <>
      <div className="session-container">
        <CreateGame setCurrentGameId={setCurrentGameId} />
        <GameList
          games={games}
          setCurrentGameId={setCurrentGameId}
          currentGameId={currentGameId}
        />
      </div>
    </>
  );
};

export default FindSessionsRoute;
