import { createGame, joinGame } from "../../firestoreFunctions";
import { useState, useContext } from "react";
import AuthContext from "../../AuthContext";

const CreateGame = ({ setCurrentGameId }) => {
  const [gameName, setGameName] = useState("");
  const [playerAmount, setPlayerAmount] = useState(2);
  const { authContext } = useContext(AuthContext);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    const gameId = await createGame(gameName, authContext.uid);
    joinGame(authContext.uid, gameId, true);
    setCurrentGameId(gameId);
    setGameName("");
  };

  return (
    <form action="submit" onSubmit={handleCreateGame}>
      <input
        onChange={(e) => setGameName(e.target.value)}
        type="text"
        placeholder="Game name"
        value={gameName}
      />
      <label>Player Amount</label>
      <input
        onChange={(e) => setPlayerAmount(e.target.value)}
        type="number"
        min={2}
        max={5}
        value={playerAmount}
      />
      <button type="submit">Create Game</button>
    </form>
  );
};

export default CreateGame;
