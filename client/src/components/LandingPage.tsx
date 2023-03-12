import { Link } from "react-router-dom";
import { useAppSelector } from "../store/store";
import jubHunterTitle from "../assets/jubHunter-title.png";
import stageThreeBackground from "../assets/stage-three-background.jpg";
import landingImagleTwo from "../assets/landing-imagle-two.jpg";
import closeForm from "../assets/close-create-form.svg";

import "../styles/LandingPage.scss";
import { useCallback, useRef, useState } from "react";

// Media Icons
import Github_icon from "../svgs/Github-icon.svg";
import Twitter_icon from "../svgs/Twitter-icon.svg";
import LinkedIn_icon from "../svgs/LinkedIn-icon.svg";
import Whatsapp_icon from "../svgs/Whatsapp-icon.svg";

// App Gallery
import jobHunterImgOne from "../Job_hunter_assets/job-hunter-img-one.png";
import jobHunterImgTwo from "../Job_hunter_assets/job-hunter-img-two.png";
import jobHunterImgThree from "../Job_hunter_assets/job-hunter-img-three.png";
import jobHunterImgFour from "../Job_hunter_assets/job-hunter-img-four.png";
import jobHunterImgFive from "../Job_hunter_assets/job-hunter-img-five.png";
import Job_Hunter_Video from "../Job_hunter_assets/Job-hunter-video.mp4";

const LandingPage = () => {
  const { isLoggedIn, loading } = useAppSelector((state) => state.user);

  const appGallery = [
    jobHunterImgOne,
    jobHunterImgTwo,
    jobHunterImgThree,
    jobHunterImgFour,
    jobHunterImgFive,
  ];

  const columnsAnimation = useRef<IntersectionObserver | null>();
  const columnAnimationRef = useCallback((node: any) => {
    if (columnsAnimation.current) columnsAnimation.current.disconnect();
    columnsAnimation.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "landing-cards-animation-active",
            entry.isIntersecting
          );
        });
      },
      {
        threshold: 0.7,
      }
    );
    if (node) columnsAnimation.current.observe(node);
  }, []);

  const expandGallerySection = () => {
    const landingGallery = document.querySelector(".landing-gallery");
    landingGallery?.classList.add("landing-gallery-selected");
  };

  const collapseGallerySection = () => {
    const landingGallerySelected = document.querySelector(
      ".landing-gallery-selected"
    );
    landingGallerySelected?.classList.remove("landing-gallery-selected");
  };

  // Video Handlers
  const [videoExpand, setVideoExpand] = useState(false);
  const [videoPlay, setVideoPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const VideoContainerRef = useRef<HTMLDivElement>(null);

  if (videoExpand && videoRef.current)
    videoRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

  const playVideo = () => {
    const video = videoRef.current;
    if (video && !videoExpand) {
      video.play();
      video.muted = true;
    }
    if (!videoPlay) {
      setVideoPlay(true);
    }
  };

  const pausedVideo = () => {
    const video = videoRef.current;
    if (video && !videoExpand) {
      video.pause();
    }

    if (videoPlay) {
      setVideoPlay(false);
    }
  };

  const expandVideoSection = () => {
    const VideoContainer = VideoContainerRef.current;
    const video = videoRef.current;

    VideoContainer?.classList.add("landing-video-container-selected");
    if (video) {
      video.setAttribute("controls", "");
      video.muted = false;
      setTimeout(() => {
        video.play();
      }, 10);
    }
    setVideoExpand(true);
  };

  const collapseVideoSection = () => {
    const VideoContainer = VideoContainerRef.current;
    const video = videoRef.current;

    VideoContainer?.classList.remove("landing-video-container-selected");
    if (video) {
      video.removeAttribute("controls");
      video.muted = true;
    }
    setVideoExpand(false);
  };

  return (
    <>
      <div className="container-landingPage">
        <section className="title-application-container">
          <section className="container-landing-links">
            {!isLoggedIn ? (
              <>
                <Link tabIndex={0} className="landing-signup" to="/login">
                  Sign up
                </Link>
                <Link tabIndex={0} className="landing-login" to="/registration">
                  Log in
                </Link>
              </>
            ) : null}
          </section>
          <img
            src={stageThreeBackground}
            className="landing-background-image-one"
          />
          <img
            src={landingImagleTwo}
            className="landing-background-image-two"
          />
          <img src={jubHunterTitle} className="jubhunter-landing-title" />
          {isLoggedIn ? (
            <Link className="landing-homepage" to="/login">
              <div className="link-shadow">Home page</div>
            </Link>
          ) : null}
          <div className="landing-arrows">
            <div className="single-arrow"></div>
            <div className="single-arrow"></div>
            <div className="single-arrow"></div>
          </div>
        </section>

        <div className="landing-message-relative-position">
          <section className="landing-message">
            <div className="landing-message-container">
              <h2 className="landing-message-title">Wellcome!</h2>
              <p className="landing-message-message">
                This application helps you manage and keep track of all the job
                applications you submit during your job search process. It
                allows you to easily monitor and organize your job search so you
                can stay on top of all your applications
              </p>
              <p className="landing-message-message">
                Positioned on the right-hand side, you will find a collection of
                application photos and an introductory video
              </p>
            </div>
            <div
              ref={VideoContainerRef}
              onPointerMove={() => playVideo()}
              onPointerLeave={() => pausedVideo()}
              className="landing-video-container"
            >
              <img
                onClick={() => collapseVideoSection()}
                src={closeForm}
                className="close-landing-video"
              />
              {!videoExpand ? (
                !videoPlay ? (
                  <svg
                    className="video-play-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path fill="#ccc" d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <div className="video-pause-icon"></div>
                )
              ) : null}
              <video
                ref={videoRef}
                onClick={() => (!videoExpand ? expandVideoSection() : null)}
                className="landing-video"
                poster={jobHunterImgOne}
              >
                <source src={Job_Hunter_Video} type="video/mp4" />
              </video>
            </div>
            <div className="landing-gallery">
              {appGallery.map((image, index) => (
                <img
                  key={index}
                  onDoubleClick={() => collapseGallerySection()}
                  onClick={() => expandGallerySection()}
                  src={image}
                  className="single-lading-gallery-image"
                />
              ))}
            </div>
          </section>
        </div>

        <div className="landing-cards-message-container">
          <p className="landing-cards-message">
            After creating your cards, our system provides a variety of tools to
            help you manage them. You can sort and view your cards by status or
            creation date,
          </p>
          <p className="landing-cards-message">
            and utilize our search bar function to easily locate cards based on
            company name or job title.
          </p>
          <p className="landing-cards-message">
            Additionally, you have the flexibility to update or delete
            individual cards, or delete all cards from a specific day or those
            with a rejected status.
          </p>
          <p className="landing-cards-message">
            Cards are visually presented in a format similar to the example
            below for an intuitive user experience.
          </p>
        </div>

        <div className="cards-perspective">
          <section
            ref={columnAnimationRef}
            className="cards-exmple-landing-page-container "
          >
            <div className="landing-column-example">
              <div className="title-example">
                <div className="card-title-example">Date</div>
                <div className="card-title-value-example">10/02/2023</div>
              </div>
              <div className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Applied</div>
              </div>
              <div area-value="rejected" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Rejected</div>
              </div>
              <div className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Applied</div>
              </div>
            </div>
            <div className="landing-column-example">
              <div className="title-example">
                <div className="card-title-example">Date</div>
                <div className="card-title-value-example">10/02/2023</div>
              </div>
              <div area-value="interview" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Interview</div>
              </div>
              <div className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Applied</div>
              </div>
              <div area-value="rejected" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Rejected</div>
              </div>
            </div>
            <div className="landing-column-example">
              <div className="title-example">
                <div className="card-title-example">Date</div>
                <div className="card-title-value-example">10/02/2023</div>
              </div>
              <div className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Applied</div>
              </div>
              <div area-value="interview" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Interview</div>
              </div>
              <div className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Applied</div>
              </div>
            </div>
            <div className="landing-column-example">
              <div className="title-example">
                <div className="card-title-example">Date</div>
                <div className="card-title-value-example">10/02/2023</div>
              </div>
              <div area-value="interview" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Interview</div>
              </div>
              <div area-value="rejected" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Rejected</div>
              </div>
              <div className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Applied</div>
              </div>
            </div>
            <div className="landing-column-example">
              <div className="title-example">
                <div className="card-title-example">Date</div>
                <div className="card-title-value-example">10/02/2023</div>
              </div>
              <div area-value="interview" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Interview</div>
              </div>
              <div area-value="interview" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Interview</div>
              </div>
              <div area-value="interview" className="card-example">
                <div className="job-card-example">Job title example</div>
                <div className="company-card-example">
                  Company title example
                </div>
                <div className="status-card-example">Interview</div>
              </div>
            </div>
          </section>
        </div>

        <footer className="landing-footer">
          <div className="application-name">2023 © Job Hunter</div>
          <div className="landing-contact-container">
            <a href="https://github.com/DF27ARTS">
              <img src={Github_icon} className="single-icon" />
            </a>
            <a href="https://twitter.com/_DF_Fernando">
              <img src={Twitter_icon} className="single-icon" />
            </a>
            <a href="https://www.linkedin.com/in/diego-fernando-rojas-carrillo-full-stack-developer">
              <img src={LinkedIn_icon} className="single-icon" />
            </a>
            <a href="https://wa.me/573202074828">
              <img src={Whatsapp_icon} className="single-icon" />
            </a>
          </div>
        </footer>
      </div>
      {loading ? (
        <div className="container-check-user-acount">
          <div className="check-user-loading">
            <span className="loading-landing-page-message">Loading</span>
            <span className="loading-landing-page-message">user</span>
            <span className="loading-landing-page-message">profile</span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LandingPage;
