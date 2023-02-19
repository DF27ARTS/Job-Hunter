import React, { useCallback, useRef, useState } from "react";
import {
  activateForm,
  Card,
  getSlicedCardsBySearchInput,
} from "../store/cardSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import SingleCard from "./SingleCard";
import "../styles/CardsContainer.scss";
import { getCardsSliced } from "../store/cardSlice";
import { openFormCreateCard } from "./FormCreateCard";
import { FormatNumber, getSearchInput } from "../store/__Functions";

const CardsContainer = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);
  const {
    cards,
    showCardsByStatus,
    loadingSlice,
    grid_columns,
    columnSliceAvailable,
    currentPropertyValue,
  } = useAppSelector((state) => state.card);

  // Infinite scroll Intersection Observer
  const lastColumnObserver = useRef<any>();
  const lastColumnElementRef = useCallback((node: any) => {
    if (lastColumnObserver.current) lastColumnObserver.current.disconnect();
    lastColumnObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (getSearchInput()) {
          // Infinite scroll for the searching bar
          if (cards.length) {
            const LAST_COLUMN_DATE =
              cards[cards.length - 1].length &&
              cards[cards.length - 1][0].title;
            dispatch(
              getSlicedCardsBySearchInput({
                property: currentPropertyValue,
                input: getSearchInput(),
                initialDate: LAST_COLUMN_DATE,
              })
            );
          }
        } else {
          // Infinite scroll for the main page
          if (cards.length) {
            const LAST_COLUMN_DATE =
              cards[cards.length - 1].length &&
              cards[cards.length - 1][0].title;
            if (LAST_COLUMN_DATE) dispatch(getCardsSliced(LAST_COLUMN_DATE));
          }
        }
      }
    });
    if (node) lastColumnObserver.current.observe(node);
  }, []);

  // Column animation Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("column-animation", entry.isIntersecting);
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
            const LAST_COLUMN_AVAILABLE =
              !showCardsByStatus &&
              columnSliceAvailable &&
              index === cards.length - 1;

            return cardArray.length > 1 ? (
              <div
                ref={LAST_COLUMN_AVAILABLE ? lastColumnElementRef : null}
                key={index}
                className="column"
              >
                <div className="column-title-container">
                  {index === 0 ? (
                    <button
                      onClick={() => HandleOpenForm()}
                      className="create-new-card-button"
                    >
                      +
                    </button>
                  ) : null}
                  {showCardsByStatus ? (
                    <h2 className="column-title">Status</h2>
                  ) : (
                    <h2 className="column-title">Date</h2>
                  )}
                  {showCardsByStatus ? (
                    <h2 className="colum-title-value">{cardArray[0].title}</h2>
                  ) : (
                    <h2 className="colum-title-value">
                      {FormatNumber(cardArray[0].title)}
                    </h2>
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
