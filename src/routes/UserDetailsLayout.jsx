import { Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthContext";
import { getAuth, signOut } from "firebase/auth";
import "./UserDetailsLayout.css";

const UserDetailsLayout = () => {
  const auth = getAuth();

  const { authContext } = useContext(AuthContext);
  return (
    <>
      <nav>
        <p id="nav-title">Poker Room</p>
        <div id="user-details">
          <p>
            <b>Email: </b>
            {authContext.email}
          </p>
          <button id="sign-out" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default UserDetailsLayout;
