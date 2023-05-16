import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { createGame, getGames, joinGame } from "../firestore.functions";

const Session = () => {
  const { authContext } = useContext(AuthContext);
  const auth = getAuth();
  const navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [games, setGames] = useState([]);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    await createGame(gameName, authContext.uid);
    navigate("/waiting", {
      state: { gameId: gameId },
    });
    setGameName("");
  };

  const handleJoinGame = (gameId) => {
    joinGame(authContext.uid, gameId);
    navigate("/waiting", { state: { gameId: gameId } });
  };

  useEffect(() => {
    getGames(setGames);
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
              {game.name}{" "}
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
