/**
 * CreateGame.jsx
 *
 * This component renders the form for submitting a game.
 */

import { createGame, joinGame } from "../../firestoreFunctions";
import { useState, useContext } from "react";
import AuthContext from "../../AuthContext";
import "./CreateGame.css";

const CreateGame = ({ setCurrentGameId }) => {
  const [gameName, setGameName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [error, setError] = useState("");
  const { authContext } = useContext(AuthContext);

  // Attempt to create a game and auto join as game owner  
  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      const gameId = await createGame(gameName, maxPlayers, authContext.uid);
      await joinGame(authContext.uid, gameId, true, authContext.email);
      setCurrentGameId(gameId);
    } catch (e) {
      setError("Something went wrong");
    } finally {
      // Reset states
      setMaxPlayers(2);
      setGameName("");
    }
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
          onChange={(e) => setMaxPlayers(e.target.value)}
          type="number"
          min={2}
          max={5}
          value={maxPlayers}
          className="create-game-form-input"
          required
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" className="create-game-form-button">
        Create Game
      </button>
    </form>
  );
};

export default CreateGame;
