import { Card, deleteCard, setCardToUpdate } from "../store/cardSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import deleteIcon from "../assets/delete-card.svg";
import updateIcon from "../assets/update-card.svg";
import "../styles/SingleCard.scss";
import { useState } from "react";

const SingleCard = ({ id, company, role, status, description }: Card) => {
  const dispatch = useAppDispatch();
  const [delete_card, setDelete_card] = useState(false);

  const backgroundColorOne =
    status === "applyed"
      ? "rgba(71,139,214,1)"
      : status === "interview"
      ? "rgba(34,126,34,1)"
      : status === "rejected"
      ? "rgba(29,29,29,1)"
      : null;

  const backgroundColorTwo =
    status === "applyed"
      ? "rgba(37,216,211,1)"
      : status === "interview"
      ? "rgba(99,162,17,1)"
      : status === "rejected"
      ? "rgba(168,0,0,1)"
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

  const style = {
    "--card-background-one": backgroundColorOne,
    "--card-background-two": backgroundColorTwo,
  } as React.CSSProperties;
  return (
    <div style={style} className="single-card">
      <p className="card-information">{role}</p>
      <p className="card-information">{company}</p>
      <p className="card-information">{status}</p>
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
        <p>Are you sure?</p>
        <button onClick={() => dispatch(deleteCard(id))}>DELETE</button>
        <button onClick={() => setDelete_card(false)}>X</button>
      </div>
    </div>
  );
};

export default SingleCard;
