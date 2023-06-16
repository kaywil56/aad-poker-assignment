import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginRegisterRoute from "./routes/LoginRegisterRoute";
import SessionRoute from "./routes/SessionRoute";
import GameRoute from "./routes/GameRoute";
import AuthContext from "./AuthContext";
import UserDetailsLayout from "./routes/UserDetailsLayout";

const App = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [authContext, setAuthContext] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthContext({ uid: user.uid, email: user.email, currentGame: {} });
        navigate("/");
      } else {
        setAuthContext({});
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext }}>
      <Routes>
        <Route path="/login" element={<LoginRegisterRoute text={"Login"} />} />
        <Route
          path="/register"
          element={<LoginRegisterRoute text={"Register"} />}
        />
        <Route path="/" element={<UserDetailsLayout />}>
          <Route index element={<SessionRoute />} />
          <Route path="/game" element={<GameRoute />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
