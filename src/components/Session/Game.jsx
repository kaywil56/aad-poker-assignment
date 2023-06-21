import { useContext, useState } from "react";
import AuthContext from "../../AuthContext";
import { joinGame, leaveGame, startGame } from "../../firestoreFunctions";
import "./Game.css";

const Game = ({ currentGameId, setCurrentGameId, game }) => {
  const { authContext } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleJoinGame = async (gameId) => {
    if (game.joinedPlayers.length < game.maxPlayers) {
      joinGame(authContext.uid, gameId, false, authContext.email);
      setCurrentGameId(gameId);
    } else {
      setError("Lobby Full.");
    }
  };

  const handleLeaveGame = async (gameId) => {
    leaveGame(authContext.uid, gameId);
    setCurrentGameId(0);
  };

  const handleStartGame = (gameId) => {
    if (game.joinedPlayers.length > 1) {
      startGame(gameId);
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
      {game.id !== currentGameId ? (
        <button className="join-button" onClick={() => handleJoinGame(game.id)}>
          Join
        </button>
      ) : (
        <button
          className="leave-button"
          onClick={() => handleLeaveGame(game.id)}
        >
          Leave
        </button>
      )}
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
