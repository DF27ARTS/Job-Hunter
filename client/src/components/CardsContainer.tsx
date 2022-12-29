import React from "react";
import { Card } from "../store/cardSlice";
import { useAppSelector } from "../store/store";
import SingleCard from "./SingleCard";
import "../styles/CardsContainer.scss";
import CardLoading from "./CardLoading";

const CardsContainer = () => {
  const { cards, grid_columns, showCardsByStatus } = useAppSelector(
    (state) => state.card
  );

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

  var style = { "--columns-amount": grid_columns } as React.CSSProperties;
  return (
    <div style={style} className="container-columns">
      {cards[0].length ? (
        cards.map<Card[] | any>((cardArray, index) =>
          cardArray.length > 1 ? (
            <div key={index} className="column ">
              <div className="column-title-container">
                {showCardsByStatus ? <h2>Status</h2> : <h2>Date</h2>}
                <h2>{cardArray[0].title}</h2>
                <span className="cards-amount">{cardArray.length - 1}</span>
              </div>
              <div className="scroll-container">
                {cardArray.map(
                  (card) =>
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
                )}
              </div>
            </div>
          ) : null
        )
      ) : (
        <div className="message-create-card">
          <h2 className="message-title">¡Create a new card!</h2>
          <p className="message-description">
            To create a new card click the button <br /> "New card" on the
            navigation panel
          </p>
          <p className="message-description">
            The cards will be shown like in the example below
          </p>
          <div className="conteiner-muck-cards">
            <div className="muck-title"></div>
            <div className="muck-card"></div>
            <div className="muck-card"></div>
            <div className="muck-card"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsContainer;
