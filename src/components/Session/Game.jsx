import { useContext } from "react";
import AuthContext from "../../AuthContext";
import { joinGame, startGame } from "../../firestoreFunctions";
import "./Game.css";

const Game = ({ name, id, owner, currentGameId, setCurrentGameId }) => {
  const { authContext } = useContext(AuthContext);

  const handleJoinGame = (gameId) => {
    joinGame(authContext.uid, gameId, false);
    setCurrentGameId(gameId);
  };

  const handleStartGame = (gameId) => {
    startGame(gameId);
  };

  return (
    <li className="game-list-item">
      <p>
        <b>Name: </b> {name}
      </p>
      {id !== currentGameId && (
        <button className="join-button" onClick={() => handleJoinGame(id)}>
          Join
        </button>
      )}
      {owner === authContext.uid && (
        <button className="start-button" onClick={() => handleStartGame(id)}>
          Start Game
        </button>
      )}
    </li>
  );
};

export default Game;
