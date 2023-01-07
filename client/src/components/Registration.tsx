import { useState } from "react";
import { User } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { registerUser } from "../store/userSlice";

import "../styles/RegistrationPage.scss";
import { Link } from "react-router-dom";
import UserLoader from "./UserLoader";
import ErrorMessage from "./ErrorMessage";
import openEye from "../assets/open-eye.svg";
import closeEye from "../assets/close-eye.svg";

const Registration = () => {
  const { loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [registration, setRegistration] = useState<User>({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [password, setPassword] = useState<Boolean>(true);

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistration({
      ...registration,
      [name]: value,
    });
  };

  const FormFill =
    !registration.name ||
    !registration.lastName ||
    !registration.email ||
    !registration.password
      ? false
      : true;

  const HandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (FormFill) {
      dispatch(registerUser(registration));
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-background-color">
        <form
          area-text={FormFill ? "form-fill" : "form-void"}
          onSubmit={(e) => HandleSubmit(e)}
          className="registration-form"
        >
          <h2 className="form-title">Sing up Form</h2>
          <div className="container-logIn-link">
            <p>Have an acout already</p>
            <Link className="link-login" to="/login">
              <span>Log in</span>
            </Link>
          </div>
          <div className="silgle-input">
            <input
              required={true}
              name="name"
              value={registration.name}
              onChange={(e) => HandleChange(e)}
              id="name"
              type="text"
              placeholder=" "
              autoComplete={"off"}
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="silgle-input">
            <input
              required={true}
              name="lastName"
              value={registration.lastName}
              onChange={(e) => HandleChange(e)}
              id="lastname"
              type="text"
              placeholder=" "
              autoComplete="off"
            />
            <label htmlFor="lastname">Lastname</label>
          </div>
          <div className="silgle-input">
            <input
              required={true}
              name="email"
              value={registration.email}
              onChange={(e) => HandleChange(e)}
              id="email"
              type="email"
              placeholder=" "
              autoComplete="off"
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="silgle-input">
            <input
              required={true}
              name="password"
              value={registration.password}
              onChange={(e) => HandleChange(e)}
              id="password"
              type={password ? "password" : "text"}
              placeholder=" "
              autoComplete="off"
            />
            <label htmlFor="password">Password</label>
            {!password ? (
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
              <button className="registration-button">Sign up</button>
            </div>
          </div>
        </form>
        {loading ? <UserLoader /> : null}
        {error ? <ErrorMessage message="User email already exists" /> : null}
      </div>
    </div>
  );
};

export default Registration;
