import { useContext, useState } from "react";
import AuthContext from "../AuthContext";
import { Navigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { createSession } from "../firestore.functions";

const Session = () => {
  const { authContext } = useContext(AuthContext);
  const auth = getAuth();
  const [gameName, setGameName] = useState("");

  const handleCreateSession = (e) => {
    e.preventDefault();
    createSession(gameName, authContext.uid);
    setGameName("")
  };

  // Protect route
  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h2>Create Session</h2>
      <form action="submit" onSubmit={handleCreateSession}>
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
        <li>Game 1</li>
        <li>Game 2</li>
        <li>Game 3</li>
      </ul>
      {/* just leaving this here for the moment */}
      <button onClick={() => signOut(auth)}>Sign out</button>
    </>
  );
};

export default Session;
