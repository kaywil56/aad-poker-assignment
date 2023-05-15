import { useContext } from "react";
import AuthContext from "../AuthContext";
import { Navigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Session = () => {
  const { authContext } = useContext(AuthContext);
  const auth =  getAuth()

  // Protect route
  if (!authContext.uid) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h1>This is the session page</h1>
      <button onClick={() => signOut(auth)}>Sign out</button>
    </>
  );
};

export default Session;
