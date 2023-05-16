import { useEffect, useState } from "react";
import { getPlayers } from "../firestore.functions";
import { useLocation } from "react-router-dom";
import AuthContext from "../AuthContext";
import { useContext } from "react";

const WaitingRoom = () => {
  const [players, setPlayers] = useState([]);
  const authContext = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    getPlayers(location.state.gameId, setPlayers);
  }, [location]);

  return (
    <>
      <h1>Waiting Room</h1>
      <h2>{players.length} Players are currently in the waiting room</h2>
      {location.state.ownerId == authContext.uid && <button>Start Game</button>}
      <ul>
        {players.map((player, idx) => {
          return <li key={`player-${idx}`}>{player.playerId}</li>;
        })}
      </ul>
    </>
  );
};

export default WaitingRoom;
