import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";

import "../styles/LandingPage.scss";

const LandingPage = () => {
  // const dispatch = useAppDispatch();

  // <a href="https://www.freepik.com/free-vector/magic-collage-line-art-flowers-clipart-with-butterfly-shapes_24575245.htm#query=shape%20svg&position=3&from_view=keyword">Image by LesenFox</a> on Freepik

  return (
    <div className="container-landingPage">
      <div className="landing-background-img">
        <section className="button-container">
          <h1 className="landing-title">Job Hunter</h1>
          <Link className="landing-button" to="/home">
            Let's get stated
          </Link>
          <input type="voice" />
        </section>
      </div>
    </div>
  );
};

export default LandingPage;