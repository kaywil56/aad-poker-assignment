/**
 * GameList.jsx
 *
 * This component renders every game from the list of games.
 */

import Game from "./Game";
import './GameList.css'

const GameList = ({ games, setCurrentGameId, currentGameId }) => {
  return (
    <div>
      <h2 className="game-list-title">Games</h2>
      <ul className="game-list">
        {games.map((game, idx) => {
          // Only display the games that havent started
          if (!game.started) {
            return (
              <Game
                key={`game-${idx}`}
                game={game}
                currentGameId={currentGameId}
                setCurrentGameId={setCurrentGameId}
              />
            );
          }
        })}
      </ul>
    </div>
  );
};

export default GameList;
