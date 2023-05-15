import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Link } from "react-router-dom";
import firestore from "../../firestore";
import { useState } from "react";

const LoginRegister = ({ text }) => {
  const auth = getAuth();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLoginRegister = (e) => {
    e.preventDefault();
    if (text == "Login") {
      signInWithEmailAndPassword(
        auth,
        userCredentials.email,
        userCredentials.password
      );
    } else {
      createUserWithEmailAndPassword(
        auth,
        userCredentials.email,
        userCredentials.password
      );
    }
  };

  const updateCredentials = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1>{text}</h1>
      <form onSubmit={handleLoginRegister} action="submit">
        <input
          onChange={updateCredentials}
          type="text"
          placeholder="email"
          name="email"
          value={userCredentials.email}
        />
        <input
          onChange={updateCredentials}
          type="text"
          placeholder="password"
          name="password"
          value={userCredentials.password}
        />
        <button type="submit">{text}</button>
      </form>
      {text == "Login" && (
        <>
          <p>Dont have an account?</p>
          <Link to="/register">Click here to register</Link>
        </>
      )}
    </>
  );
};

export default LoginRegister;
