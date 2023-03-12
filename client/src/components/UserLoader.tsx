import "../styles/UserLoader.scss";
import JobHunter_Icon from "../assets/JobHunter-Icon.png";

const UserLoader = () => {
  return (
    <div className="loader-container">
      <div className="registration-loader">
        <div className="second-loader"></div>
        <div className="third-loader"></div>
        <img src={JobHunter_Icon} className="job-hunter-icon" />
      </div>
    </div>
  );
};

export default UserLoader;
