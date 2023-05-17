import { createContext } from "react";

const GameContext = createContext({
  gameContext: {},
  setAuthContext: (game) => {},
});

export default GameContext;