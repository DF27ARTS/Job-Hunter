import { useState, useCallback, useRef } from "react";
import { User } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { registerUser } from "../store/userSlice";

import "../styles/RegistrationPage.scss";
import { Link } from "react-router-dom";
import UserLoader from "./UserLoader";
import ErrorMessage from "./ErrorMessage";
import openEye from "../assets/open-eye.svg";
import closeEye from "../assets/close-eye.svg";
import checkIcon from "../assets/check-icon.svg";

// Form image
import stage_one_img from "../assets/stage-two-background.jpg";
import stage_two_img from "../assets/stage-four-background.jpg";
import stage_three_img from "../assets/stage-three-background.jpg";
import stage_four_img from "../assets/stage-one-background.jpg";

interface registration extends User {
  confirm_password?: string;
}

const Registration = () => {
  const { loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [registration, setRegistration] = useState<registration>({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [inputPasswordType, setInputPasswordType] = useState<Boolean>(true);
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [verifyPassword, setVerifyPassword] = useState<boolean>(false);
  const [passwordStageIsIntersecting, setPasswordStageIsIntersecting] =
    useState<boolean>(false);

  const FormFill =
    !registration.name ||
    !registration.lastName ||
    !registration.email ||
    !registration.confirm_password ||
    !registration.password
      ? false
      : true;

  const ValidatePasswordText = (value: RegExp): boolean => {
    if (registration.password) {
      return value.test(registration.password);
    } else {
      return false;
    }
  };

  const MoreThanEight = ValidatePasswordText(/^.{8,}$/);
  const LessThanFifteen = ValidatePasswordText(/^.{1,20}$/);
  const ContainsAnSpecialCaracter = ValidatePasswordText(/.*[\W_]+.*/);
  const ContainsAtLeastOneNumber = ValidatePasswordText(/.*[0-9].*/);
  const ContainsAtLeastOneUppercaseLetter = ValidatePasswordText(/.*[A-Z].*/);

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setVerifyEmail(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(value));
    }

    if (name === "password") {
      setVerifyPassword(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s])(?!.*\s).{8,20}$/.test(value)
      );
    }

    setRegistration({
      ...registration,
      [name]: value,
    });
  };

  const HandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    delete registration["confirm_password"];

    if (FormFill) {
      dispatch(registerUser(registration));
    }

    translateFormStages("0");
  };

  const translateFormStages = (translate: string): void => {
    document.documentElement.style.setProperty(
      "--form-stage-translate",
      translate
    );
  };

  // Password validation parameters hook
  const FormRef = useRef<HTMLFormElement | null>(null);
  const passwordStageRef = useCallback((node: any) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPasswordStageIsIntersecting(true);
          } else {
            setPasswordStageIsIntersecting(false);
          }
        });
      },
      {
        root: FormRef.current,
        threshold: 1,
      }
    );

    if (node) observer.observe(node);
  }, []);

  return (
    <div className="registration-container">
      <div className="registration-background-color">
        <form
          ref={FormRef}
          onSubmit={(e) => HandleSubmit(e)}
          className="registration-form"
        >
          {passwordStageIsIntersecting ? (
            <ul className="form-password-verification-parameters">
              <p>Password Verifications</p>
              <li
                className={
                  ContainsAtLeastOneUppercaseLetter
                    ? "single-verification-messages password-checked"
                    : "single-verification-messages"
                }
              >
                It must contain at least one uppercase letter
              </li>
              <li
                className={
                  ContainsAtLeastOneNumber
                    ? "single-verification-messages password-checked"
                    : "single-verification-messages"
                }
              >
                It must contain at least one number
              </li>
              <li
                className={
                  ContainsAnSpecialCaracter
                    ? "single-verification-messages password-checked"
                    : "single-verification-messages"
                }
              >
                It must contain at least one symbol
              </li>
              <li
                className={
                  MoreThanEight
                    ? "single-verification-messages password-checked"
                    : "single-verification-messages"
                }
              >
                It must have a minimum length of 8 characters
              </li>
              <li
                className={
                  LessThanFifteen
                    ? "single-verification-messages password-checked"
                    : "single-verification-messages"
                }
              >
                It must have a maximum length of 20 characters
              </li>
            </ul>
          ) : null}

          <h2 className="form-title">Sing up Form</h2>
          <div className="inputs-slider-container">
            <div className="stage-form-container stage-form-one">
              <h3 className="stage-message">Enter your firts name!</h3>
              <input
                type="text"
                className="stage-form-input"
                required={true}
                name="name"
                value={registration.name}
                onChange={(e) => HandleChange(e)}
                id="name"
                placeholder="User first name"
                autoComplete={"off"}
                spellCheck="false"
              />

              {/* Background form image */}
              <img
                src={stage_one_img}
                className={
                  registration.name
                    ? "stage-form-background-image full-grayscale-active"
                    : "stage-form-background-image"
                }
              />
              <div className="form-acount-message">
                <p className="form-message">Have an acount already</p>
                <Link to="/login" className="form-acount-link">
                  Log in
                </Link>
              </div>

              {registration.name ? (
                <div
                  onClick={() => translateFormStages("-100%")}
                  className="stage-form-arrows arrow-right"
                ></div>
              ) : null}
            </div>

            <div className="stage-form-container stage-form-two">
              <h3 className="stage-message">Enter your last name!</h3>
              <input
                className="stage-form-input"
                required={true}
                name="lastName"
                value={registration.lastName}
                onChange={(e) => HandleChange(e)}
                id="lastname"
                type="text"
                placeholder="User last name"
                autoComplete="off"
                spellCheck="false"
              />
              <img
                src={stage_two_img}
                className={
                  registration.lastName
                    ? "stage-form-background-image full-grayscale-active"
                    : "stage-form-background-image"
                }
              />
              <div
                onClick={() => translateFormStages("0")}
                className="stage-form-arrows arrow-left"
              ></div>

              {registration.lastName ? (
                <div
                  onClick={() => translateFormStages("-200%")}
                  className="stage-form-arrows arrow-right"
                ></div>
              ) : null}
            </div>

            <div className="stage-form-container stage-form-three">
              <h3 className="stage-message">Enter your email!</h3>
              <input
                className="stage-form-input"
                required={true}
                name="email"
                value={registration.email}
                onChange={(e) => HandleChange(e)}
                id="email"
                type="email"
                placeholder="User email"
                autoComplete="off"
                spellCheck="false"
              />
              <img
                src={stage_three_img}
                className={
                  registration.email && verifyEmail
                    ? "stage-form-background-image full-grayscale-active"
                    : "stage-form-background-image"
                }
              />
              <div
                onClick={() => translateFormStages("-100%")}
                className="stage-form-arrows arrow-left"
              ></div>
              {registration.email && verifyEmail ? (
                <div
                  onClick={() => translateFormStages("-300%")}
                  className="stage-form-arrows arrow-right"
                ></div>
              ) : null}
            </div>

            <div
              ref={passwordStageRef}
              className="stage-form-container stage-form-four"
            >
              <h3 className="stage-message">Enter your password!</h3>

              <div tabIndex={0} className="single-input-form-password">
                <input
                  className="stage-form-input"
                  required={true}
                  name="password"
                  value={registration.password}
                  onChange={(e) => HandleChange(e)}
                  id="password"
                  type={inputPasswordType ? "password" : "text"}
                  placeholder="User password"
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
                src={stage_four_img}
                className={
                  registration.password === registration.confirm_password &&
                  verifyPassword
                    ? "stage-form-background-image full-grayscale-active"
                    : "stage-form-background-image"
                }
              />

              <div className="single-input-form-password">
                <input
                  className="stage-form-input"
                  required={true}
                  name="confirm_password"
                  value={registration.confirm_password}
                  onChange={(e) => HandleChange(e)}
                  id="password"
                  type={inputPasswordType ? "password" : "text"}
                  placeholder="Confirm user password"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              {FormFill &&
              registration.confirm_password === registration.password &&
              verifyPassword ? (
                <button type="submit" className="form-submit-button">
                  Sign up
                </button>
              ) : (
                <button
                  type="button"
                  className="form-submit-button unclickble-button"
                >
                  Sign up
                </button>
              )}
              <div
                onClick={() => translateFormStages("-200%")}
                className="stage-form-arrows arrow-left"
              ></div>
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
