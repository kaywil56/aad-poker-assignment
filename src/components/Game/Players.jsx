/**
 * Players.jsx
 *
 * This component renders the players in the game and displays whos turn it is.
 */

import "./Players.css";

const Players = ({ players, currentPlayerId }) => {
  return (
    <>
    <h2 className="players-list-title">Players: </h2>
      <ul className="players-list">
        {players.map((player, idx) => {
          return (
            // apply font color to player whos turn it is
            <li
              className="players-item"
              style={{ color: player.isTurn ? "#333" : "white" }}
              key={`player-item-${idx}`}
            >
              {currentPlayerId === player.playerId ? "you" : player.email}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Players;
