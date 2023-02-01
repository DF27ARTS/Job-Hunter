import {
  Card,
  deleteCard,
  openLoading,
  setCardToUpdate,
  updateCard,
} from "../store/cardSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import deleteIcon from "../assets/delete-card.svg";
import updateIcon from "../assets/update-card.svg";
import closeForm from "../assets/close-create-form.svg";
import "../styles/SingleCard.scss";
import { useState } from "react";

const SingleCard = ({ id, company, role, status, description }: Card) => {
  const dispatch = useAppDispatch();
  const [delete_card, setDelete_card] = useState(false);
  const [currentSelectedStatus, setCurrentSelectedStatus] =
    useState<string>(status);

  const backgroundColorOne =
    status === "applyed"
      ? "rgba(71,139,214,1)"
      : status === "interview"
      ? "rgba(34,126,34,1)"
      : status === "rejected"
      ? "rgb(107, 13, 13)"
      : null;

  const backgroundColorTwo =
    status === "applyed"
      ? "rgba(37,216,211,1)"
      : status === "interview"
      ? "rgba(99,162,17,1)"
      : status === "rejected"
      ? "rgb(223, 28, 28)"
      : null;

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
    setTimeout(() => {
      const createCardForm = document.querySelector(".create-card-form");
      createCardForm?.classList.add("create-form-activated");
    }, 10);
  };

  const HandleSelectStatus = (value: string): void => {
    dispatch(openLoading());
    setCurrentSelectedStatus(value);
    dispatch(updateCard({ id: id, company, role, status: value }));
  };

  const style = {
    "--card-background-one": backgroundColorOne,
    "--card-background-two": backgroundColorTwo,
  } as React.CSSProperties;

  return (
    <div style={style} className="single-card">
      <div className="card-information-role">{role}</div>
      <div className="card-information-company">{company}</div>
      <div tabIndex={0} className="card-information-status">
        {status}
        <div className="open-status-selector"></div>
        <div className="container-select-status">
          <button
            onClick={() => HandleSelectStatus("applyed")}
            className={
              currentSelectedStatus === "applyed"
                ? "single-card-option-singlecard singlecard-applyed"
                : "single-card-option-singlecard"
            }
          >
            Applyed
          </button>
          <button
            onClick={() => HandleSelectStatus("interview")}
            className={
              currentSelectedStatus === "interview"
                ? "single-card-option-singlecard singlecard-interview"
                : "single-card-option-singlecard"
            }
          >
            Interview
          </button>
          <button
            onClick={() => HandleSelectStatus("rejected")}
            className={
              currentSelectedStatus === "rejected"
                ? "single-card-option-singlecard singlecard-rejected"
                : "single-card-option-singlecard"
            }
          >
            Rejected
          </button>
        </div>
      </div>
      {description ? <p>{description}</p> : null}
      <div className="container-card-menu">
        <img onClick={() => HandleOpenForm()} src={updateIcon} alt="" />
        <img onClick={() => setDelete_card(true)} src={deleteIcon} alt="" />
      </div>
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
    </div>
  );
};

export default SingleCard;
