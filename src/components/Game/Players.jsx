const Players = ({ players, currentPlayerId }) => {
  return (
    <ul>
      {players.map((player, idx) => {
        return (
          <li
            style={{ color: player.isTurn ? "green" : "black" }}
            key={`player-item-${idx}`}
          >
            {currentPlayerId === player.playerId ? "you" : player.playerId}
          </li>
        );
      })}
    </ul>
  );
};

export default Players;
