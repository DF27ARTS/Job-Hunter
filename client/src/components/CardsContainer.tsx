import React from "react";
import { Card } from "../store/cardSlice";
import { useAppSelector } from "../store/store";
import SingleColumn from "./SingleColumn";
import "../styles/CardsContainer.scss";

export const addLoadingCardClass = (status: string): void => {
  const currentColumn = document.querySelector(`[area-text="${status}"]`);
  currentColumn?.classList.add("loading-column-active");
};

export const removeLoadingCardClass = (): void => {
  const currentColumn = document.querySelector(".loading-column-active");
  currentColumn?.classList.remove("loading-column-active");
};

const CardsContainer = () => {
  const { user } = useAppSelector((state) => state.user);
  const { cards, loadingSlice } = useAppSelector((state) => state.card);

  return (
    <>
      <div
        className={
          cards[0].length
            ? "container-columns"
            : "container-columns without-cards-conainer"
        }
      >
        {cards[0].length ? (
          cards.map<Card[] | any>((cardArray, index) => {
            return cardArray.length > 1 ? (
              <SingleColumn
                key={index}
                index={index}
                cardArray={cardArray}
                currenDate={cardArray[0].title}
              />
            ) : null;
          })
        ) : (
          <>
            <div className="conteiner-message-without-cards">
              <span className="user-message">Wellcome</span>
              <span className="user-message">
                {`${user?.name} ${user?.lastName}`}
              </span>
            </div>

            <div className="single-muck-column-one">
              <div className="muck-column-title"></div>
              <div className="single-muck-card"></div>
              <div className="single-muck-card"></div>
              <div className="single-muck-card"></div>
            </div>
            <div className="single-muck-column-two">
              <div className="muck-column-title"></div>
              <div className="single-muck-card"></div>
              <div className="single-muck-card"></div>
              <div className="single-muck-card"></div>
            </div>
            <div className="single-muck-column-three">
              <div className="muck-column-title"></div>
              <div className="single-muck-card"></div>
              <div className="single-muck-card"></div>
              <div className="single-muck-card"></div>
            </div>
          </>
        )}
        {loadingSlice ? (
          <div className="column-container loading-slice-column">
            <div className="muck-column-title"></div>
            <div className="single-muck-card"></div>
            <div className="single-muck-card"></div>
            <div className="single-muck-card"></div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default React.memo(CardsContainer);
