import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Navigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { createGame, getGames } from "../firestore.functions";

const Session = () => {
  const { authContext } = useContext(AuthContext);
  const auth = getAuth();
  const [gameName, setGameName] = useState("");
  const [games, setGames] = useState([]);

  const handleCreateGame = (e) => {
    e.preventDefault();
    createGame(gameName, authContext.uid);
    setGameName("")
  };

  useEffect(() => {
    getGames(setGames)
  }, [])

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
            return <li key={idx}>{game.name}</li>
        })}
      </ul>
      {/* just leaving this here for the moment */}
      <button onClick={() => signOut(auth)}>Sign out</button>
    </>
  );
};

export default Session;
