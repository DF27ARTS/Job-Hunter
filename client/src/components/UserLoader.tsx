import "../styles/UserLoader.scss";
import JobHunter_Icon from "../assets/JobHunter-Icon.png";

const UserLoader = () => {
  return (
    <div className="loader-container">
      <div className="registration-loader">
        <img src={JobHunter_Icon} className="job-hunter-icon" />
      </div>
    </div>
  );
};

export default UserLoader;
