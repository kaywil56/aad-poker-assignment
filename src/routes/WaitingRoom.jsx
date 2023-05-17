import { useEffect, useState } from "react";
import { getPlayers, startGame } from "../firestore.functions";
import { Navigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { useContext } from "react";
import GameContext from "../GameContext";

const WaitingRoom = () => {
  const [players, setPlayers] = useState([]);
  const { authContext } = useContext(AuthContext)
  const { currentGameContext } = useContext(GameContext)

  const handleStartGame = () => {
    startGame(currentGameContext.gameId)
  }

  useEffect(() => {
    getPlayers(currentGameContext.gameId, setPlayers);
  }, [location]);

  if(currentGameContext.started){
    return <Navigate to="/game" />
  }

  return (
    <>
      <h1>Waiting Room</h1>
      <button onClick={handleStartGame}>Start Game</button>
      <h2>{players.length} Players are currently in the waiting room</h2>
    </>
  );
};

export default WaitingRoom;
