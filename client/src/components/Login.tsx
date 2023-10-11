import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logInUser } from "../store/userSlice";

import "../styles/Login.scss";
import ErrorMessage from "./ErrorMessage";
import UserLoader from "./UserLoader";
import openEye from "../assets/open-eye.svg";
import closeEye from "../assets/close-eye.svg";

// Form image
import stage_one_img from "../assets/stage-two-background.jpg";
import stage_two_img from "../assets/stage-four-background.jpg";

interface Input {
  email: string;
  password: string;
  confirm_password?: string;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);

  const [input, setInput] = useState<Input>({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [inputPasswordType, setInputPasswordType] = useState<Boolean>(true);
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);

  const FormFill =
    input.email && input.password && input.confirm_password ? true : false;

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "email") {
      setVerifyEmail(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(value));
    }

    setInput({
      ...input,
      [name]: value,
    });
  };

  const HandleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    delete input["confirm_password"];

    if (FormFill) {
      dispatch(logInUser(input));
    }
    translateFormStages("0");
  };

  const translateFormStages = (translate: string): void => {
    document.documentElement.style.setProperty(
      "--form-stage-translate",
      translate
    );
  };

  return (
    <div className="registration-container">
      <div className="login-background-color">
        <form
          area-text={FormFill ? "form-login-fill" : "form-void"}
          onSubmit={(e) => HandleSubmit(e)}
          className="form-logIn"
        >
          <h2 className="form-title">Log in Form</h2>
          <div className="inputs-slider-container">
            <div className="stage-form-container stage-form-one">
              <h3 className="stage-message">Enter your email!!</h3>
              <input
                className="stage-form-input"
                placeholder="User email"
                required={true}
                onChange={(e) => HandleChange(e)}
                name="email"
                value={input.email}
                id="email"
                type="email"
                autoComplete="off"
                spellCheck="false"
              />
              <img
                src={stage_one_img}
                className={
                  input.email && verifyEmail
                    ? "stage-form-background-image full-grayscale-active"
                    : "stage-form-background-image"
                }
              />

              <div className="form-acount-message">
                <p className="form-message">Don't have an acount yet</p>
                <Link to="/registration" className="form-acount-link">
                  Sign Up
                </Link>
              </div>

              {input.email && verifyEmail ? (
                <div
                  onClick={() => translateFormStages("-100%")}
                  className="stage-form-arrows arrow-right"
                ></div>
              ) : null}
            </div>

            <div className="stage-form-container stage-form-four">
              <h3 className="stage-message">Enter your password!!</h3>

              <div tabIndex={0} className="single-input-form-password">
                <input
                  className="stage-form-input"
                  required={true}
                  placeholder="User password"
                  onChange={(e) => HandleChange(e)}
                  name="password"
                  value={input.password}
                  id="password"
                  type={inputPasswordType ? "password" : "text"}
                  autoComplete="off"
                  spellCheck="false"
                />
                {!inputPasswordType ? (
                  <img
                    onClick={() => setInputPasswordType(!inputPasswordType)}
                    src={openEye}
                    className="form-is-visible-icon"
                  />
                ) : (
                  <img
                    onClick={() => setInputPasswordType(!inputPasswordType)}
                    src={closeEye}
                    className="form-is-visible-icon"
                  />
                )}
              </div>
              <img
                src={stage_two_img}
                className={
                  input.password && input.password === input.confirm_password
                    ? "stage-form-background-image full-grayscale-active"
                    : "stage-form-background-image"
                }
              />

              <div className="single-input-form-password">
                <input
                  className="stage-form-input"
                  required={true}
                  placeholder="User password"
                  onChange={(e) => HandleChange(e)}
                  name="confirm_password"
                  value={input.confirm_password}
                  id="password"
                  type={inputPasswordType ? "password" : "text"}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              {FormFill && input.confirm_password === input.password ? (
                <button type="submit" className="form-submit-button">
                  Log in
                </button>
              ) : (
                <button
                  type="button"
                  className="form-submit-button unclickble-button"
                >
                  Log in
                </button>
              )}

              <div
                onClick={() => translateFormStages("0")}
                className="stage-form-arrows arrow-left"
              ></div>
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
