import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../AuthContext";

const Game = () => {
  const { authContext } = useContext(AuthContext);

  // Protect route
  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  return (<div>Game Screen</div>);
};

export default Game;
