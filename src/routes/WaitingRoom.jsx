import { useEffect, useState } from "react";
import { getPlayers, startGame } from "../firestore.functions";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import GameContext from "../GameContext";

const WaitingRoom = () => {
  const [players, setPlayers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate()
  const { currentGameContext } = useContext(GameContext);

  const handleStartGame = () => {
    startGame(location.state.gameId);
  };

  useEffect(() => {
    getPlayers(location.state.gameId, setPlayers);
  }, [location]);

  if (currentGameContext.started) {
    navigate("/game", { state: { gameId: location.state.gameId } });
  }

  return (
    <>
      <h1>Waiting Room {location.state.gameId}</h1>
      <button onClick={handleStartGame}>Start Game</button>
      <h2>{players.length} Players are currently in the waiting room</h2>
    </>
  );
};

export default WaitingRoom;
