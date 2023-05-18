import { useEffect, useState } from "react";
import { getPlayers, startGame } from "../firestore.functions";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { useContext } from "react";
import GameContext from "../GameContext";

const WaitingRoom = () => {
  const [players, setPlayers] = useState([]);
  const { authContext } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate()
  const { currentGameContext } = useContext(GameContext);

  const handleStartGame = () => {
    startGame(currentGameContext.gameId);
    console.log(currentGameContext);
  };

  useEffect(() => {
    getPlayers(currentGameContext.gameId, setPlayers);
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
