import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logInUser } from "../store/userSlice";

import "../styles/Login.scss";
import ErrorMessage from "./ErrorMessage";
import UserLoader from "./UserLoader";
import openEye from "../assets/open-eye.svg";
import closeEye from "../assets/close-eye.svg";

interface Input {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);

  const [input, setInput] = useState<Input>({
    email: "",
    password: "",
  });

  const [password, setPassword] = useState<Boolean>(true);

  const FormFill = !input.email || !input.password ? false : true;

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const HandleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (FormFill) {
      dispatch(logInUser(input));
    }
  };

  return (
    <div className="registration-container">
      <div className="login-background-color">
        <form
          area-text={FormFill ? "form-login-fill" : "form-void"}
          onSubmit={(e) => HandleSubmit(e)}
          className="form-logIn"
        >
          <h2 className="form-title">Sing up Form</h2>
          <div className="container-logIn-link">
            <p>Don't have an acount</p>
            <Link className="link-login" to="/registration">
              <span>creat acount</span>
            </Link>
          </div>
          <div className="silgle-input">
            <input
              required={true}
              onChange={(e) => HandleChange(e)}
              name="email"
              value={input.email}
              id="email"
              type="email"
              autoComplete="off"
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="silgle-input">
            <input
              required={true}
              onChange={(e) => HandleChange(e)}
              name="password"
              value={input.password}
              id="password"
              type={password ? "password" : "text"}
              autoComplete="off"
              placeholder=" "
            />
            <label htmlFor="password">Passwors</label>
            {password ? (
              <img
                onClick={() => setPassword(!password)}
                src={openEye}
                className="eye-icon"
              />
            ) : (
              <img
                onClick={() => setPassword(!password)}
                src={closeEye}
                className="eye-icon"
              />
            )}
          </div>
          <div className="button-container-registration">
            <div>
              <button className="registration-button">log In</button>
            </div>
          </div>
        </form>
        {loading ? <UserLoader /> : null}
        {error ? <ErrorMessage message="Email or password incorrect" /> : null}
      </div>
    </div>
  );
};

export default Login;
