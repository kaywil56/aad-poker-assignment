import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginRegisterRoute from "./routes/LoginRegisterRoute";
import SessionRoute from "./routes/SessionRoute";
import GameRoute from "./routes/GameRoute";
import AuthContext from "./AuthContext";

const App = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [authContext, setAuthContext] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthContext({ uid: user.uid, email: user.email, currentGame: {} });
        navigate("/session");
      } else {
        setAuthContext({});
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext }}>
      <Routes>
        <Route path="/" element={<LoginRegisterRoute text={"Login"} />} />
        <Route path="/register" element={<LoginRegisterRoute text={"Register"} />} />
        <Route path="/session" element={<SessionRoute />} />
        <Route path="/game" element={<GameRoute />} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
