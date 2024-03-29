import { useEffect, useState } from "react";
import "../styles/SidebarMenu.scss";

import sidebarMenu from "../assets/sidebar-menu.svg";
import closeForm from "../assets/close-create-form.svg";
import jubHunterTitle from "../assets/jubHunter-title.png";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logOutUser } from "../store/userSlice";
import {
  activateForm,
  cleanCurrentPropertyValue,
  clearStorage,
  closeLoading,
  deleteAllRejectedCards,
  deleteCardByDate,
  getCards,
  getCardsByStatus,
  getDates,
  setShowByStatus,
} from "../store/cardSlice";
import { openFormCreateCard } from "./FormCreateCard";
import { deleteSearchInput, FormatNumber } from "../store/__Functions";
import { useNavigate } from "react-router-dom";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const { cards, create_form_active, arrayDates, showCardsByStatus } =
    useAppSelector((state) => state.card);

  const dispatch = useAppDispatch();

  const [sidebarState, setSidebarState] = useState<boolean>(false);
  const [deleteCardAlert, setDeleteCardAlert] = useState<boolean>(false);
  const [currentDateToDelete, setCurrentDateToDelete] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useEffect(() => {
    dispatch(getDates());
  }, [dispatch, getDates]);

  const OpenAndcloseSidebar = (value: boolean): void => {
    const sidebarMenuIcon = document.querySelector(".sidebar-menu-icon");
    sidebarMenuIcon?.classList.add("icon-selected");

    setTimeout(() => {
      sidebarMenuIcon?.classList.remove("icon-selected");
    }, 200);

    if (value) {
      document.documentElement.style.setProperty("--scroll-y", "hidden");
      document.documentElement.style.setProperty("--display-status", "block");
      setTimeout(() => {
        document.documentElement.style.setProperty(
          "--sidebar-clip-path",
          "2500px"
        );
      }, 10);
    } else {
      document.documentElement.style.setProperty("--scroll-y", "auto");
      document.documentElement.style.setProperty("--sidebar-clip-path", "0px");
      setTimeout(() => {
        document.documentElement.style.setProperty("--display-status", "none");
      }, 700);
    }
    setSidebarState(!sidebarState);
  };

  const HandleClickLogout = () => {
    dispatch(clearStorage());
    dispatch(logOutUser());
    dispatch(closeLoading());
    OpenAndcloseSidebar(false);
    navigate("/");
  };

  const createNewCardSidebar = (): void => {
    OpenAndcloseSidebar(!sidebarState);
    dispatch(activateForm());
    openFormCreateCard();
  };

  const HandleShowCards = (value: boolean): void => {
    deleteSearchInput();
    dispatch(cleanCurrentPropertyValue());
    dispatch(clearStorage());
    dispatch(setShowByStatus(value));
    if (value) {
      dispatch(getCardsByStatus());
    } else {
      dispatch(getCards());
    }
    OpenAndcloseSidebar(false);
  };

  const OpenMessageAlert = (
    date: string | undefined,
    message: string
  ): void => {
    if (date) {
      setCurrentDateToDelete(date);
      setCurrentMessage(message);
      setDeleteCardAlert(true);
    } else {
      setCurrentMessage(message);
      setDeleteCardAlert(true);
    }
  };

  const CloseMessageAlert = (): void => {
    setCurrentDateToDelete("");
    setCurrentMessage("");
    setDeleteCardAlert(false);
  };

  const HandleDelete = (): void => {
    if (currentDateToDelete) {
      dispatch(deleteCardByDate(currentDateToDelete));
    } else {
      dispatch(deleteAllRejectedCards());
    }
    setDeleteCardAlert(false);
  };

  return (
    <>
      <div className="container-sidebar-menu-icon">
        <img
          tabIndex={0}
          onClick={() => OpenAndcloseSidebar(!sidebarState)}
          className="sidebar-menu-icon"
          src={sidebarMenu}
        />
        {!cards[0].length && !sidebarState && !create_form_active ? (
          <div className="create-first-card-message-icon"> ¡Click here!</div>
        ) : null}
      </div>

      <div className="sidebar-menu-container">
        <div className="sidebar-menu">
          <div className="container-sidebar-first-row">
            <img src={jubHunterTitle} className="jobhunter-sidebar-icon" />
            <button
              onClick={() => createNewCardSidebar()}
              className="create-new-card-sidebar"
            >
              New Card
              {!cards[0].length && sidebarState && !create_form_active ? (
                <div className="create-first-card-message-icon">
                  ¡Crate a new card!
                </div>
              ) : null}
            </button>
          </div>

          <div tabIndex={0} className="container-sidebar-options">
            <span className="select-data-to-delete-title">
              Delete cards by day
            </span>

            <div className="single-dates-slider">
              {arrayDates.length ? (
                arrayDates.map((date: string | undefined, index: number) => (
                  <div
                    key={index}
                    onClick={() =>
                      OpenMessageAlert(
                        date,
                        "This will delete all the cards of this day"
                      )
                    }
                    className="single-option-date"
                  >
                    {FormatNumber(date)}{" "}
                  </div>
                ))
              ) : (
                <span className="no-cards-created-sidebar">
                  You have no cards created
                </span>
              )}
            </div>
          </div>

          <div className="container-show-cards-by">
            <button
              onClick={() =>
                showCardsByStatus ? HandleShowCards(false) : null
              }
              className={
                !showCardsByStatus
                  ? "show-cards-by show-card-selected"
                  : "show-cards-by"
              }
            >
              Show by date
            </button>
            <button
              onClick={() =>
                !showCardsByStatus ? HandleShowCards(true) : null
              }
              className={
                showCardsByStatus
                  ? "show-cards-by show-card-selected"
                  : "show-cards-by"
              }
            >
              Show by status
            </button>
          </div>

          <div className="container-delete-rejected-cards">
            <button
              onClick={() =>
                OpenMessageAlert(
                  undefined,
                  "This action will delete all cards with the rejected status"
                )
              }
              className="delete-rejected-cards"
            >
              Delete all rejected cards
            </button>
          </div>

          <div className="container-logout-button">
            <button
              onClick={() => HandleClickLogout()}
              className="sidebar-logout-button"
            >
              Log out
            </button>
          </div>
        </div>

        {deleteCardAlert ? (
          <div className="alert-delete-card-message">
            <img
              onClick={() => CloseMessageAlert()}
              tabIndex={0}
              src={closeForm}
              className="close-alert"
            />
            <span className="alert-delete-message">{currentMessage}</span>
            <span className="alert-delete-message">
              Are you sure to continue?
            </span>
            <button
              onClick={() => HandleDelete()}
              className="alert-delete-button"
            >
              I'm sure
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SidebarMenu;
