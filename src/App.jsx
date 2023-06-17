import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginRegisterRoute from "./routes/LoginRegisterRoute";
import SessionRoute from "./routes/SessionRoute";
import GameRoute from "./routes/GameRoute";
import AuthContext from "./AuthContext";
import UserDetailsLayout from "./routes/UserDetailsLayout";
import { InfinitySpin } from "react-loader-spinner";

const App = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [authContext, setAuthContext] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthContext({ uid: user.uid, email: user.email, currentGame: {} });
        navigate("/");
      } else {
        setAuthContext({});
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    const style = {
      height: "100%",
      width: "100%",
      display: "grid",
      placeItems: "center",
    };
    return (
      <div style={style}>
        <InfinitySpin
          height="200"
          width="200"
          radius="9"
          color="black"
          ariaLabel="spinner-loading"
          wrapperStyle
          wrapperClass
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext }}>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginRegisterRoute setIsLoading={setIsLoading} text={"Login"} />
          }
        />
        <Route
          path="/register"
          element={<LoginRegisterRoute setIsLoading={setIsLoading} text={"Register"} />}
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
