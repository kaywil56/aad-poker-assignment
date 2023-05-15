import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginRegister from "./routes/LoginRegister";
import Session from "./routes/Session";
import Game from "./routes/Game";
import AuthContext from "./AuthContext";

const App = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [authContext, setAuthContext] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthContext({ uid: user.uid, email: user.email });
        navigate("/session");
      } else {
        setAuthContext({});
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext }}>
      <Routes>
        <Route path="/" element={<LoginRegister text={"Login"} />} />
        <Route path="/register" element={<LoginRegister text={"Register"} />} />
        <Route path="/session" element={<Session />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
