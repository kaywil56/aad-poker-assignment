/**
 * Games.jsx
 *
 * This component renders a single game from the list of games.
 */

import { useContext, useState } from "react";
import AuthContext from "../../AuthContext";
import { joinGame, leaveGame, startGame } from "../../firestoreFunctions";
import "./Game.css";

const Game = ({ currentGameId, setCurrentGameId, game }) => {
  const { authContext } = useContext(AuthContext);
  const [error, setError] = useState("");

  // Attempt to join the game if there is free space in the lobby
  const handleJoinGame = async (gameId) => {
    if (game.joinedPlayers.length < game.maxPlayers) {
      try {
        await joinGame(authContext.uid, gameId, false, authContext.email);
        setCurrentGameId(gameId);
      } catch {
        setError("Unable to join game.");
      }
    } else {
      setError("Lobby Full.");
    }
  };

  // Attempt to leave the game
  const handleLeaveGame = async (gameId) => {
    try {
      await leaveGame(authContext.uid, gameId);
      setCurrentGameId(0);
    } catch {
      setError("Unable to leave game");
    }
  };

  // If their is more then 1 player attempt to start the game else display an error
  const handleStartGame = async (gameId) => {
    if (game.joinedPlayers.length > 1) {
      try{
        await startGame(gameId);
      }catch{
        setError("Unable to start game.")
      }
    } else {
      setError("You need at least 2 players");
    }
  };

  return (
    <li className="game-list-item">
      <p>
        <b>Name: </b> {game.name}
      </p>
      <p>
        <b>Players in lobby: </b> {game?.joinedPlayers?.length}/
        {game.maxPlayers}
      </p>
      {/* toggle join and leave */}
      {game.id !== currentGameId ? (
        <button className="join-button" onClick={() => handleJoinGame(game.id)}>
          Join
        </button>
      ) : (
        <button
          className="leave-button"
          onClick={() => handleLeaveGame(game.id)}s
        >
          Leave
        </button>
      )}
      {/* Only render the start button for the game owner */}
      {game.owner === authContext.uid && game.id == currentGameId && (
        <button
          className="start-button"
          onClick={() => handleStartGame(game.id)}
        >
          Start Game
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </li>
  );
};

export default Game;
