import Game from "./Game";
import './GameList.css'

const GameList = ({ games, setCurrentGameId, currentGameId }) => {
  return (
    <div>
      <h2 className="game-list-title">Games</h2>
      <ul className="game-list">
        {games.map((game, idx) => {
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
