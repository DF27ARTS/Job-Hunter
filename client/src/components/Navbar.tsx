import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCardsBySearchInput,
  setColumnSliceAvailable,
} from "../store/cardSlice";
import { useAppDispatch } from "../store/store";
import JobHunter_Icon from "../assets/JobHunter-Icon.png";

import searchOptions from "../assets/search-options.svg";
import searchEngineIcon from "../assets/search-engine-icon.svg";
import "../styles/Navbar.scss";
import SidebarMenu from "./SidebarMenu";
import { deleteSearchInput, saveSearchInput } from "../store/__Functions";

export interface InputSearchEngine {
  property: string;
  input?: string;
}

// Scroll into view function
export const ScrollIntoViewNavbar = (): void => {
  const containerNavbar = document.querySelector(".container-navbar");
  containerNavbar?.scrollIntoView(true);
};

const Navbar = () => {
  const dispatch = useAppDispatch();

  const [searchOption, setSearchOption] = useState<string>("job title");
  const [inputSearch, setInputSearch] = useState<InputSearchEngine>({
    property: "role",
    input: "",
  });

  const HandleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(setColumnSliceAvailable());
    const value = {
      property: inputSearch.property,
      input: inputSearch.input?.toLocaleLowerCase(),
    };
    deleteSearchInput();
    saveSearchInput(value.input);
    dispatch(getCardsBySearchInput(value));
    setInputSearch({
      property: inputSearch.property,
      input: "",
    });
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputSearch({
      ...inputSearch,
      input: value,
    });
  };

  // Hsndler navbar select options
  const selectOptionsContainerRef = useRef<HTMLDivElement | null>(null);
  const selectOptionsIconRef = useRef<HTMLImageElement | null>(null);
  const [selectOptionOpen, setSelectOption] = useState<boolean>(true);
  const HandleSelectOptions = (value: boolean): void => {
    const optionsContainer = selectOptionsContainerRef.current;
    optionsContainer?.classList.toggle("current-options-open", value);
    value
      ? setTimeout(() => {
          optionsContainer?.classList.toggle(
            "current-options-hide-color",
            !value
          );
        }, 350)
      : optionsContainer?.classList.toggle(
          "current-options-hide-color",
          !value
        );
    setSelectOption(!value);
  };

  const HandleSelectOptionsIconClick = (value: boolean): void => {
    const selectOptionIcon = selectOptionsIconRef.current;
    selectOptionIcon?.classList.add("search-option-icon-animation");
    HandleSelectOptions(value);
  };

  const HandleSelectOptionsAnimationEnd = () => {
    const selectOptionIcon = selectOptionsIconRef.current;
    selectOptionIcon?.classList.remove("search-option-icon-animation");
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
        property: "role",
        input: "",
      });
    } else {
      setSearchOption("company");
      setInputSearch({
        property: "company",
        input: "",
      });
    }
    HandleSelectOptions(false);
  };

  return (
    <div className="container-navbar">
      <div className="page-icon">
        <Link className="home-link-navbar" to="/">
          <img src={JobHunter_Icon} />
        </Link>
      </div>
      <form onSubmit={(e) => HandleSubmit(e)} className="container-search">
        <input
          onChange={(e) => HandleChange(e)}
          value={inputSearch.input}
          type="text"
          className="search-input"
          spellCheck="false"
          placeholder={
            searchOption === "company"
              ? "Search by company name"
              : "Search by job title"
          }
        />
        <button className="search-button">
          <img className="search-engine-icon" src={searchEngineIcon} />
        </button>
        <div className="container-search-input">
          <img
            ref={selectOptionsIconRef}
            onAnimationEnd={() => HandleSelectOptionsAnimationEnd()}
            onClick={() => HandleSelectOptionsIconClick(selectOptionOpen)}
            tabIndex={0}
            className="search-option-icon"
            src={searchOptions}
          />

          <div
            ref={selectOptionsContainerRef}
            className="current-options-hide-color current-options"
          >
            <div
              area-text="job-title"
              className="option-selected"
              onClick={() => SelectSearchOption("job-title")}
            >
              Search by Job Title
            </div>
            <div
              area-text="company"
              onClick={() => SelectSearchOption("company")}
            >
              Search by Company
            </div>
          </div>
        </div>
      </form>
      <SidebarMenu />
    </div>
  );
};

export default Navbar;
