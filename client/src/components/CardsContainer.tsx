import React from "react";
import {
  activateForm,
  Card,
  getSlicedCardsBySearchInput,
} from "../store/cardSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import SingleCard from "./SingleCard";
import "../styles/CardsContainer.scss";
import { FormatNumber } from "../store/userSlice";
import { getCardsSliced } from "../store/cardSlice";
import { openFormCreateCard } from "./FormCreateCard";

const CardsContainer = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);
  const {
    cards,
    showCardsByStatus,
    loadingSlice,
    grid_columns,
    columnSliceAvailable,
    currentInputValue,
    currentSearchValue,
  } = useAppSelector((state) => state.card);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("column-animation", entry.isIntersecting);
    });
  });

  const SlicerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      dispatch(getCardsSliced({ start: 0, end: cards.length + 10 }));
      SlicerObserver.unobserve(entry.target);
    });
  });

  const SlicerSearcherObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      SlicerSearcherObserver.unobserve(entry.target);
      dispatch(
        getSlicedCardsBySearchInput({
          input: currentInputValue,
          search: currentSearchValue,
          start: 0,
          end: cards.length + 10,
        })
      );
    });
  });

  setTimeout(() => {
    const columns = document.querySelectorAll(".column");
    columns.forEach((column) => {
      observer.observe(column);
    });
  }, 10);

  const HandleOpenForm = (): void => {
    openFormCreateCard();
    dispatch(activateForm());
  };

  setTimeout(() => {
    const createNewCardButton = document.querySelector(
      ".create-new-card-button"
    );

    if (!createNewCardButton) {
      const columnTitleContainer = document.querySelector(
        ".column-title-container"
      );
      const button = document.createElement("button");
      button.classList.add("create-new-card-button");
      button.textContent = "+";
      button.addEventListener("click", HandleOpenForm);
      columnTitleContainer?.appendChild(button);
    }
  }, 50);

  const styles = {
    "--columns-amount": grid_columns,
  } as React.CSSProperties;
  const withoutCarsStyles = { "----columns-amount": 3 } as React.CSSProperties;

  return (
    <>
      <div
        style={cards[0].length ? styles : withoutCarsStyles}
        className={
          cards[0].length
            ? "container-columns"
            : "container-columns without-cards-conainer"
        }
      >
        {cards[0].length ? (
          cards.map<Card[] | any>((cardArray, index) => {
            if (columnSliceAvailable && index === cards.length - 1) {
              setTimeout(() => {
                if (!currentSearchValue) {
                  const LastColumn =
                    document.querySelector(".column:last-child");
                  LastColumn && SlicerObserver.observe(LastColumn);
                } else {
                  const LastColumn =
                    document.querySelector(".column:last-child");
                  LastColumn && SlicerSearcherObserver.observe(LastColumn);
                }
              }, 50);
            }

            return cardArray.length > 1 ? (
              <div key={index} className="column">
                <div className="column-title-container">
                  {showCardsByStatus ? <h2>Status</h2> : <h2>Date</h2>}
                  {showCardsByStatus ? (
                    <h2>{cardArray[0].title}</h2>
                  ) : (
                    <h2>{FormatNumber(cardArray[0].title)}</h2>
                  )}

                  {/* Show the amount of cards - 1 because of the one that has the title */}
                  <span
                    area-text={
                      cardArray.length - 1 >= 99 ? "container-total-amount" : ""
                    }
                    className="cards-amount"
                  >
                    {cardArray.length - 1 <= 99 ? cardArray.length - 1 : "99+"}
                    <div
                      area-text="total-amount"
                      className="cards_total_amount"
                    >
                      {cardArray.length - 1}
                    </div>
                  </span>
                </div>
                <div className="scroll-container">
                  {cardArray.map((card) => {
                    return (
                      card.company && (
                        <SingleCard
                          key={card.id}
                          id={card.id}
                          company={card.company}
                          role={card.role}
                          status={card.status}
                          description={card.description}
                        />
                      )
                    );
                  })}
                </div>
              </div>
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
          <div className="column loading-slice-column">
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
