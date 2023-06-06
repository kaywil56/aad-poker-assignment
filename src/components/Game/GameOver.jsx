const GameOver = ({ winner }) => {
    return <h1>{winner.playerId}: {winner.rank.type}</h1>
}

export default GameOver