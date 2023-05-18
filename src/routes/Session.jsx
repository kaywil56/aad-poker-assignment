import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import GameContext from "../GameContext";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { createGame, getGames, joinGame } from "../firestore.functions";

const Session = () => {
  const { authContext } = useContext(AuthContext);
  const { currentGameContext, setCurrentGameContext } = useContext(GameContext);

  const auth = getAuth();
  const navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [games, setGames] = useState([]);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    createGame(gameName, authContext.uid);
    // joinGame(authContext.uid, gameId);
    // setCurrentGameContext({
    //   gameId: gameId,
    //   started: false,
    // });
    // navigate("/waiting");
    setGameName("");
  };

  const handleJoinGame = (gameId) => {
    joinGame(authContext.uid, gameId);
    setCurrentGameContext({
      gameId: gameId,
      started: false,
    });
    navigate("/waiting", {state: { gameId: gameId}});
  };

  useEffect(() => {
    getGames(setGames, currentGameContext, setCurrentGameContext);
  }, []);

  // Protect route
  if (!authContext.uid) {
    return <Navigate to="/" />;
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
          return (
            <li key={idx}>
              {`${game.name} ${game.started}`}
              <button onClick={() => handleJoinGame(game.id)}>Join</button>
            </li>
          );
        })}
      </ul>
      {/* just leaving this here for the moment */}
      <button onClick={() => signOut(auth)}>Sign out</button>
    </>
  );
};

export default Session;
