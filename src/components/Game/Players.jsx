/**
 * Players.jsx
 *
 * This component renders the players in the game and displays whos turn it is.
 */

const Players = ({ players, currentPlayerId }) => {
  return (
    <ul>
      {players.map((player, idx) => {
        return (
          // apply font color to player whos turn it is
          <li
            style={{ color: player.isTurn ? "green" : "black" }}
            key={`player-item-${idx}`}
          >
            {currentPlayerId === player.playerId ? "you" : player.email}
          </li>
        );
      })}
    </ul>
  );
};

export default Players;
