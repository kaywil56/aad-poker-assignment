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
                name={game.name}
                id={game.id}
                owner={game.owner}
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
