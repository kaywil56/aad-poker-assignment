const Players = ({ players }) => {
  return (
    <ul>
      {players.map((player, idx) => {
        return (
          <li
            style={{ color: player.isTurn ? "green" : "black" }}
            key={`player-item-${idx}`}
          >{`player${idx + 1}`}</li>
        );
      })}
    </ul>
  );
};

export default Players;
