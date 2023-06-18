import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./LoginRegisterRoute.css";
import firestore from "../../../firestore";

const LoginRegisterRoute = ({
  text,
  setIsLoading,
  setErrorMessage,
  errorMessage,
}) => {
  const auth = getAuth();

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLoginRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (text === "Login") {
        await signInWithEmailAndPassword(
          auth,
          userCredentials.email,
          userCredentials.password
        );
      } else {
        await createUserWithEmailAndPassword(
          auth,
          userCredentials.email,
          userCredentials.password
        );
      }
    } catch (error) {
      if (error.message === "Firebase: Error (auth/user-not-found).") {
        setErrorMessage("User not found.");
        console.log("User not found.", error);
      } else {
        setErrorMessage("Something went wrong.");
        console.log("Something went wrong.", error);
      }
    } finally {
      setIsLoading(false);
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
            type="email"
            placeholder="email"
            name="email"
            required
            value={userCredentials.email}
          />
          <input
            className="login-register-inputs"
            onChange={updateCredentials}
            type="password"
            placeholder="password"
            name="password"
            minLength={6}
            value={userCredentials.password}
            required
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button className="login-register-submit-button" type="submit">
            {text}
          </button>
          {text == "Login" ? (
            <>
              <p className="login-register-helper-text">
                Dont have an account?
              </p>
              <Link onClick={() => setErrorMessage("")} to="/register">
                Click here to register
              </Link>
            </>
          ) : (
            <Link onClick={() => setErrorMessage("")} to="/">
              Go Back
            </Link>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginRegisterRoute;
