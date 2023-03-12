import {
  Card,
  deleteCard,
  getStatusCardsSlice,
  openLoading,
  setCardToUpdate,
  updateCard,
} from "../store/cardSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import deleteIcon from "../assets/delete-card.svg";
import updateIcon from "../assets/update-card.svg";
import closeForm from "../assets/close-create-form.svg";
import "../styles/SingleCard.scss";
import { useCallback, useRef, useState } from "react";
import { openFormCreateCard } from "./FormCreateCard";
import { addLoadingCardClass } from "./CardsContainer";
interface SingleCard extends Card {
  lastCard: boolean;
}

const SingleCard = ({
  id,
  company,
  role,
  status,
  description,
  lastCard,
}: SingleCard) => {
  const dispatch = useAppDispatch();
  const { cards } = useAppSelector((state) => state.card);
  const [delete_card, setDelete_card] = useState(false);

  const backgroundColorOne =
    status === "applied"
      ? "rgba(71,139,214,1)"
      : status === "interview"
      ? "rgba(34,126,34,1)"
      : status === "rejected"
      ? "rgb(190, 134, 14)"
      : null;

  const backgroundColorTwo =
    status === "applied"
      ? "rgba(37,216,211,1)"
      : status === "interview"
      ? "rgba(99,162,17,1)"
      : status === "rejected"
      ? "rgb(168, 82, 11)"
      : null;

  const lastCardStatusObserver = useRef<IntersectionObserver | null>();
  const lastCardStatusElementRef = useCallback((node: any) => {
    if (lastCardStatusObserver.current)
      lastCardStatusObserver.current.disconnect();
    lastCardStatusObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const APPLIED = `${status[0].toUpperCase() + status.slice(1)}`;
        addLoadingCardClass(APPLIED);

        const currentColumn = cards.filter(
          (cardsArray) => cardsArray[0].title === APPLIED
        )[0];

        dispatch(
          getStatusCardsSlice({ status: status, start: currentColumn.length })
        );
      }
    });
    if (node) lastCardStatusObserver.current.observe(node);
  }, []);

  const HandleOpenForm = (): void => {
    dispatch(
      setCardToUpdate({
        id,
        company,
        role,
        status,
        description,
      })
    );
    openFormCreateCard();
  };

  const HandleSelectStatus = (value: string): void => {
    dispatch(openLoading());
    dispatch(updateCard({ id: id, company, role, status: value }));

    // close the select card status container
    HandleSelectCardStatus(false);
  };

  const style = {
    "--card-background-one": backgroundColorOne,
    "--card-background-two": backgroundColorTwo,
  } as React.CSSProperties;

  // Card menu handlers
  const [cardMenuOpen, setCardMenuOpen] = useState<boolean>(true);
  const singleCardRef = useRef<HTMLDivElement | null>(null);
  const menuIconRef = useRef<HTMLDivElement | null>(null);
  const HandleMenu = (value: boolean): void => {
    const cardMenu = singleCardRef.current;
    cardMenu?.classList.toggle("single-card-menu-containe-active", value);

    value
      ? cardMenu?.style.setProperty(
          "--single-card-background",
          "rgb(41, 41, 41)"
        )
      : setTimeout(() => {
          cardMenu?.style.setProperty(
            "--single-card-background",
            "rgb(56, 56, 56)"
          );
        }, 350);
  };

  const HandleMenuClick = (value: boolean) => {
    const menuIcon = menuIconRef.current;
    menuIcon?.classList.add("icon-clicked");

    HandleMenu(value);
    setCardMenuOpen(!value);
    HandleSelectCardStatus(false);
  };

  const menuIconAnimationEnd = () => {
    const menuIcon = menuIconRef.current;
    menuIcon?.classList.remove("icon-clicked");
  };

  // Select card status handler
  const singleCardStatusRef = useRef<HTMLDivElement | null>(null);
  const HandleSelectCardStatus = (value: boolean): void => {
    const singleCard = singleCardStatusRef.current;
    singleCard?.classList.toggle("single-card-select-status-open", value);
    value
      ? setTimeout(() => {
          singleCard?.classList.toggle("select-status-hidden-color", !value);
        }, 350)
      : singleCard?.classList.toggle("select-status-hidden-color", !value);
  };

  return (
    <div
      ref={lastCard ? lastCardStatusElementRef : null}
      style={style}
      className="single-card"
    >
      <div className="card-information-role">{role}</div>
      <div className="card-information-company">{company}</div>
      <div tabIndex={0} className="card-information-status">
        {status}
      </div>
      {description ? (
        <div className="card-information-status">{description}</div>
      ) : null}
      <div
        className={
          delete_card ? "delete-message message-open" : "delete-message"
        }
      >
        <p className="singlecard-delete-message-title">Are you sure ?</p>
        <button
          className="singlecard-delete-button"
          onClick={() => dispatch(deleteCard(id))}
        >
          I'm sure
        </button>
        <button
          className="singlecard-close-button"
          onClick={() => setDelete_card(false)}
        >
          <img src={closeForm} className="singlecard-close-button-icon" />
        </button>
      </div>

      <div ref={singleCardRef} className="single-card-menu-container">
        <div
          ref={menuIconRef}
          onAnimationEnd={() => menuIconAnimationEnd()}
          onClick={() => HandleMenuClick(cardMenuOpen)}
          className="single-card-menu-icon"
        >
          <div className="menu-single-dot"></div>
          <div className="menu-single-dot"></div>
          <div className="menu-single-dot"></div>
        </div>

        <div className="single-card-menu-container-options">
          <div
            onClick={() => HandleOpenForm()}
            className="card-menu-single-option-container"
          >
            <span className="card-menu-option-message">Update card</span>
            <img className="card-menu-option-icon" src={updateIcon} />
          </div>

          <div
            onClick={() => HandleSelectCardStatus(true)}
            className="card-menu-single-option-container"
          >
            <span className="card-menu-option-message">Update card state</span>
            <img className="card-menu-option-icon" src={updateIcon} />
          </div>
          <div
            onClick={() => setDelete_card(true)}
            className="card-menu-single-option-container"
          >
            <span className="card-menu-option-message">Delete card</span>
            <img className="card-menu-option-icon" src={deleteIcon} />
          </div>
        </div>

        <div
          ref={singleCardStatusRef}
          className="select-status-hidden-color single-card-select-status-container"
        >
          <div
            onClick={() => HandleSelectStatus("applied")}
            area-text={status === "applied" ? status : null}
            className="single-card-status-option"
          >
            Applied
          </div>
          <div
            onClick={() => HandleSelectStatus("interview")}
            area-text={status === "interview" ? status : null}
            className="single-card-status-option"
          >
            Interview
          </div>
          <div
            onClick={() => HandleSelectStatus("rejected")}
            area-text={status === "rejected" ? status : null}
            className="single-card-status-option"
          >
            Rejected
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
