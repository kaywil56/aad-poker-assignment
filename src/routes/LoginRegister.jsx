import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Link } from "react-router-dom";
import firestore from "../../firestore";
import { useState } from "react";
import "./LoginRegister.css";

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
    <div className="login-register-container">
      <div>
        <form
          className="login-register-form"
          onSubmit={handleLoginRegister}
          action="submit"
        >
          <h1 className="login-register-title">{text}</h1>
          <input
            className="login-register-inputs"
            onChange={updateCredentials}
            type="text"
            placeholder="email"
            name="email"
            value={userCredentials.email}
          />
          <input
            className="login-register-inputs"
            onChange={updateCredentials}
            type="text"
            placeholder="password"
            name="password"
            value={userCredentials.password}
          />
          <button className="login-register-submit-button" type="submit">
            {text}
          </button>
        </form>
        {text == "Login" && (
          <>
            <p className="login-register-helper-text">Dont have an account?</p>
            <Link to="/register">Click here to register</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
