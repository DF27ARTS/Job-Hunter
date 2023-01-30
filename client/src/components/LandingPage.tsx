import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import jubHunterTitle from "../assets/jubHunter-title.png";
import stageThreeBackground from "../assets/stage-three-background.jpg";

import "../styles/LandingPage.scss";

const LandingPage = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  return (
    <div
      className={
        !isLoggedIn
          ? "container-landingPage"
          : "container-landingPage display-flex-start"
      }
    >
      <img src={stageThreeBackground} className="landing-background-image" />
      <section className="button-container">
        <img src={jubHunterTitle} className="jubhunter-landing-title" />
      </section>

      <section className="container-landing-links">
        {!isLoggedIn ? (
          <>
            <Link className="landing-login" to="/login">
              Sign up
            </Link>
            <Link className="landing-signup" to="/registration">
              Log in
            </Link>
          </>
        ) : (
          <Link className="landing-homepage" to="/login">
            Home page
          </Link>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
