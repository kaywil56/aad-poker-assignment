import { useContext } from "react";
import AuthContext from "../../AuthContext";

const Game = ({
  key,
  name,
  id,
  owner,
  currentGameId,
  handleJoinGame,
  handleStartGame,
}) => {
  const { authContext } = useContext(AuthContext);

  return (
    <li key={key}>
      {name}
      {id !== currentGameId && (
        <button onClick={() => handleJoinGame(id)}>Join</button>
      )}
      {owner === authContext.uid && (
        <button onClick={() => handleStartGame(id)}>Start Game</button>
      )}
    </li>
  );
};

export default Game;
