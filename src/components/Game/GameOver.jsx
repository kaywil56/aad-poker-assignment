import { useNavigate } from "react-router-dom";

const GameOver = ({ winner }) => {
  const navigate = useNavigate();
  return (
    <>
      <h1>
        {winner.email}: {winner.rank.type}
      </h1>
      <button onClick={() => navigate("/session")}>Home</button>
    </>
  );
};

export default GameOver;
