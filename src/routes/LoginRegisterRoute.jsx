import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./LoginRegisterRoute.css";

const LoginRegisterRoute = ({ text, setIsLoading }) => {
  const auth = getAuth();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLoginRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (text == "Login") {
      try {
        await signInWithEmailAndPassword(
          auth,
          userCredentials.email,
          userCredentials.password
        );
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      try {
        await createUserWithEmailAndPassword(
          auth,
          userCredentials.email,
          userCredentials.password
        );
      } catch (error) {
        setIsLoading(false);
      }
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
          {text == "Login" && (
            <>
              <p className="login-register-helper-text">
                Dont have an account?
              </p>
              <Link to="/register">Click here to register</Link>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginRegisterRoute;
