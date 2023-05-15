import { createContext } from "react";

const AuthContext = createContext({
  authContext: {},
  setAuthContext: (auth) => {},
});

export default AuthContext;