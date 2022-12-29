import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  activateForm,
  clearStorage,
  getCardsBySearchInput,
} from "../store/cardSlice";
import { useAppDispatch } from "../store/store";
import { logOutUser } from "../store/userSlice";

import searchOptions from "../assets/search-options.svg";
import dayIcon from "../assets/day-icon.svg";
import nightIcon from "../assets/night-icon.svg";
import searchIcon from "../assets/search-icon.svg";
import "../styles/Navbar.scss";

export interface InputSearchEngine {
  input: string;
  search?: string;
}

const Navbar = () => {
  const dispatch = useAppDispatch();

  const [theme, setTheme] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<string>("job title");
  const [inputSearch, setInputSearch] = useState<InputSearchEngine>({
    input: "role",
    search: "",
  });

  const HandleSubmit = (): void => {
    const value = {
      input: inputSearch.input,
      search: inputSearch.search?.toLocaleLowerCase(),
    };
    dispatch(getCardsBySearchInput(value));
    setInputSearch({
      input: inputSearch.input,
      search: "",
    });
  };

  const HandleClickLogout = () => {
    dispatch(logOutUser());
    dispatch(clearStorage());
  };

  const HandleOpenForm = (): void => {
    dispatch(activateForm());
    setTimeout(() => {
      const createCardForm = document.querySelector(".create-card-form");
      createCardForm?.classList.add("create-form-activated");
    }, 10);
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputSearch({
      ...inputSearch,
      search: value,
    });
  };

  const SelectSearchOption = (value: string): void => {
    const currentActiveOption = document.querySelector(".option-selected");
    if (currentActiveOption)
      currentActiveOption?.classList.remove("option-selected");
    const currentValue = document.querySelector(`[area-text=${value}]`);
    currentValue?.classList.add("option-selected");

    if (value === "job-title") {
      setSearchOption("job title");
      setInputSearch({
        input: "role",
        search: "",
      });
    } else {
      setSearchOption("company");
      setInputSearch({
        input: "company",
        search: "",
      });
    }
  };

  const setThemeDay = (): void => {
    document.documentElement.style.setProperty(
      "--card-column-background",
      "rgb(238, 235, 235)"
    );
    document.documentElement.style.setProperty(
      "--card-background-color",
      "rgb(214, 213, 213)"
    );
    document.documentElement.style.setProperty("--body-background", "#fff");
    document.documentElement.style.setProperty(
      "--body-text-color",
      "rgb(20, 20, 20)"
    );
    setTheme(true);
  };

  const setThemeNight = (): void => {
    document.documentElement.style.setProperty(
      "--card-column-background",
      "rgb(31, 30, 30)"
    );
    document.documentElement.style.setProperty(
      "--card-background-color",
      "rgb(56, 56, 56)"
    );
    document.documentElement.style.setProperty("--body-background", "#000");
    document.documentElement.style.setProperty("--body-text-color", "#ccc");
    setTheme(false);
  };

  const setSearbarStatus = (value: string): void => {
    document.documentElement.style.setProperty("--searchbar-translate", value);
  };

  return (
    <div className="container-navbar">
      <div className="page-icon">
        <Link className="home-link-navbar" to="/">
          <p>JH</p>
        </Link>
      </div>
      <div className="search-icon-open-searchvar">
        <img onClick={() => setSearbarStatus("0")} src={searchIcon} />
      </div>
      <div className="container-search">
        <input
          onChange={(e) => HandleChange(e)}
          value={inputSearch.search}
          type="text"
          className="search-input"
        />
        <button onClick={() => HandleSubmit()} className="search-button">
          <span>Search</span>
          <span>By</span>
          <span>{searchOption}</span>
        </button>
        <div className="container-search-input">
          <img
            tabIndex={0}
            className="search-option-icon"
            src={searchOptions}
          />
          <div tabIndex={0} className="current-options">
            <div
              area-text="job-title"
              className="option-selected"
              onClick={() => SelectSearchOption("job-title")}
            >
              Job Title
            </div>
            <div
              area-text="company"
              onClick={() => SelectSearchOption("company")}
            >
              Company
            </div>
            <div
              area-text="close-searchbar"
              onClick={() => setSearbarStatus("-500%")}
            >
              Close
            </div>
          </div>
        </div>
      </div>
      {theme ? (
        <img
          onClick={() => setThemeNight()}
          area-text="day"
          className="theme-icon"
          src={dayIcon}
        />
      ) : (
        <img
          onClick={() => setThemeDay()}
          area-text="night"
          className="theme-icon"
          src={nightIcon}
        />
      )}
      <div className="create-new-card">
        <button onClick={() => HandleOpenForm()}>New Card</button>
      </div>
      <button onClick={() => HandleClickLogout()} className="logout-button">
        Log out
      </button>
    </div>
  );
};

export default Navbar;
