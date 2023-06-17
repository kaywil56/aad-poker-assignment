import { createGame, joinGame } from "../../firestoreFunctions";
import { useState, useContext } from "react";
import AuthContext from "../../AuthContext";
import './CreateGame.css'

const CreateGame = ({ setCurrentGameId }) => {
  const [gameName, setGameName] = useState("");
  const [playerAmount, setPlayerAmount] = useState(2);
  const { authContext } = useContext(AuthContext);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    const gameId = await createGame(gameName, playerAmount, authContext.uid);
    joinGame(authContext.uid, gameId, true);
    setCurrentGameId(gameId);
    // Reset states
    setPlayerAmount(2);
    setGameName("");
  };

  return (
    <form
      action="submit"
      onSubmit={handleCreateGame}
      className="create-game-form-container"
    >
      <h2 className="create-game-form-title">Create Game</h2>
      <div className="create-game-form-group">
        <label className="create-game-form-label">Game Name</label>
        <input
          onChange={(e) => setGameName(e.target.value)}
          type="text"
          placeholder="Game name"
          value={gameName}
          className="create-game-form-input"
          required
        />
      </div>
      <div className="create-game-form-group">
        <label className="create-game-form-label">Max Players</label>
        <input
          onChange={(e) => setPlayerAmount(e.target.value)}
          type="number"
          min={2}
          max={5}
          value={playerAmount}
          className="create-game-form-input"
          required
        />
      </div>
      <button type="submit" className="create-game-form-button">
        Create Game
      </button>
    </form>
  );
};

export default CreateGame;
