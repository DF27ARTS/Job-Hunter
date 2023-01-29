import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { clearStorage, getCardsBySearchInput } from "../store/cardSlice";
import { useAppDispatch } from "../store/store";
import JobHunter_Icon from "../assets/JobHunter-Icon.png";

import searchOptions from "../assets/search-options.svg";
import searchIcon from "../assets/search-icon.svg";
import searchEngineIcon from "../assets/search-engine-icon.svg";
import "../styles/Navbar.scss";
import SidebarMenu from "./SidebarMenu";

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
    dispatch(clearStorage());
    dispatch(getCardsBySearchInput(value));
    setInputSearch({
      input: inputSearch.input,
      search: "",
    });
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

  const setSearbarStatus = (value: string): void => {
    document.documentElement.style.setProperty("--searchbar-translate", value);
  };

  return (
    <div className="container-navbar">
      <div className="page-icon">
        <Link className="home-link-navbar" to="/">
          <img src={JobHunter_Icon} />
        </Link>
      </div>
      <div className="search-icon-open-searchvar">
        {/* <img onClick={() => setSearbarStatus("0")} src={searchIcon} /> */}
      </div>
      <div className="container-search">
        <input
          onChange={(e) => HandleChange(e)}
          value={inputSearch.search}
          type="text"
          className="search-input"
          placeholder={
            searchOption === "company"
              ? "Search by company name"
              : "Search by job title"
          }
        />
        <button onClick={() => HandleSubmit()} className="search-button">
          <img className="search-engine-icon" src={searchEngineIcon} />
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
      {/* <button onClick={() => HandleClickLogout()} className="logout-button">
        Log out
      </button> */}
      <SidebarMenu />
    </div>
  );
};

export default Navbar;
