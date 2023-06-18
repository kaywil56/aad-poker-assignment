import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginRegisterRoute from "./routes/LoginRegisterRoute/LoginRegisterRoute";
import SessionRoute from "./routes/SessionRoute";
import GameRoute from "./routes/GameRoute/GameRoute";
import AuthContext from "./AuthContext";
import UserDetailsLayout from "./routes/UserDetailsLayout";
import { InfinitySpin } from "react-loader-spinner";

const App = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [authContext, setAuthContext] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthContext({ uid: user.uid, email: user.email, currentGame: {} });
        navigate("/session");
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
          path="/"
          element={
            <LoginRegisterRoute
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              setErrorMessage={setErrorMessage}
              errorMessage={errorMessage}
              text={"Login"}
            />
          }
        />
        <Route
          path="/register"
          element={
            <LoginRegisterRoute
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              setErrorMessage={setErrorMessage}
              errorMessage={errorMessage}
              text={"Register"}
            />
          }
        />
        <Route path="/session" element={<UserDetailsLayout />}>
          <Route index element={<SessionRoute />} />
          <Route path="/session/game" element={<GameRoute />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
