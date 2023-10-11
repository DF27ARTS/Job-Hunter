import { useCallback, useRef, useState } from "react";
import {
  activateForm,
  Card,
  deleteCardByDate,
  deleteCardsByDefineStatus,
  getCardsSliced,
  getSlicedCardsBySearchInput,
} from "../store/cardSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  deleteShowCardAmount,
  FormatNumber,
  getSearchInput,
  getShowCardAmount,
  setShowCardAmount,
} from "../store/__Functions";
import { openFormCreateCard } from "./FormCreateCard";
import closeForm from "../assets/close-create-form.svg";
import SingleCard from "./SingleCard";
import singleColumnIcon from "../svgs/colum_menu_icon.svg";

import "../styles/SingleColumn.scss";

interface SingleColumnProps {
  cardArray: Card[];
  index: number;
  currenDate?: string;
}

export const scrollFirstColumnIntoView = (): void => {
  const FirstColumn = document.querySelector(".column-container");
  FirstColumn?.scrollIntoView({
    behavior: "smooth",
    inline: "start",
  });
};

const SingleColumn = ({ cardArray, index, currenDate }: SingleColumnProps) => {
  const dispatch = useAppDispatch();
  const {
    cards,
    showCardsByStatus,
    columnSliceAvailable,
    currentPropertyValue,
    LAST_COLUMN_CARD,
  } = useAppSelector((state) => state.card);
  const [currentDeleteState, setCurrentDeleteState] = useState<string>("");

  // // Infinite scroll Intersection Observer Ref
  const lastColumnObserver = useRef<IntersectionObserver | null>();
  const lastColumnElementRef = useCallback(
    (node: any) => {
      if (lastColumnObserver.current) lastColumnObserver.current.disconnect();
      lastColumnObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && cards[0].length) {
          if (getSearchInput()) {
            // Infinite scroll for the searching bar
            if (LAST_COLUMN_CARD.title) {
              dispatch(
                getSlicedCardsBySearchInput({
                  property: currentPropertyValue,
                  input: getSearchInput(),
                  initialDate: LAST_COLUMN_CARD.title,
                })
              );
            }
          } else {
            if (LAST_COLUMN_CARD.title)
              dispatch(getCardsSliced(LAST_COLUMN_CARD.title));
          }
        }
      });
      if (node) lastColumnObserver.current.observe(node);
    },
    [LAST_COLUMN_CARD]
  );

  /*
  
  
  
  
  */

  // Column animation Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("column-animation", entry.isIntersecting);
    });
  });

  setTimeout(() => {
    const columns = document.querySelectorAll(".column-container");
    columns.forEach((column) => {
      observer.observe(column);
    });
  }, 10);

  const HandleOpenForm = (): void => {
    openFormCreateCard();
    dispatch(activateForm());
  };

  /*
  
  
  
  
  */

  // Column menu handlers
  const columnMenuContainerRef = useRef<HTMLDivElement | null>(null);
  const columnMenuIconRef = useRef<HTMLImageElement | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const HandleMenuContainerOpening = (value: boolean): void => {
    const menuContainer = columnMenuContainerRef.current;
    menuContainer?.classList.toggle("single-column-menu-is-open", value);
    value
      ? setTimeout(() => {
          menuContainer?.classList.remove("single-column-hide-background");
        }, 500)
      : menuContainer?.classList.add("single-column-hide-background");

    setMenuIsOpen(value);
  };

  const HandleColumnMenuIconClick = (value: boolean): void => {
    const columnMenu = columnMenuIconRef.current;
    columnMenu?.classList.add("column-card-menu-icon-clicked-animation");
    setTimeout(() => {
      columnMenu?.classList.remove("column-card-menu-icon-clicked-animation");
    }, 350);
    HandleMenuContainerOpening(value);
  };

  /*
  
  
  
  
  */

  // Menu Alert message handler
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [currentAlertMessage, setCurrentAlertMessage] = useState<string>("");
  const [currentAlertMessageAction, setCurrentAlertMessageAction] =
    useState<string>("");

  const HandleOpenAlertMessage = (
    alertMessage: string,
    currentAction: string,
    currentStatus: string = "applied"
  ) => {
    setCurrentAlertMessage(alertMessage);
    setAlertMessageOpen(true);

    setCurrentAlertMessageAction(currentAction);
    setCurrentDeleteState(currentStatus);
  };

  const HandleAlertMessageButton = () => {
    if (currentAlertMessageAction === "delete all cards") {
      dispatch(deleteCardByDate(currenDate));
    }

    if (
      currentAlertMessageAction === "delete all cards with especific status"
    ) {
      const arrayIds = returnArrayIds(currentDeleteState);
      dispatch(deleteCardsByDefineStatus(arrayIds));
    }

    // close the alert message and the menu
    setAlertMessageOpen(false);
    HandleMenuContainerOpening(false);
  };
  /*
  
  
  
  
  */

  // Handle show cards amount slicer
  const showCardsAmountSlicerRef = useRef<HTMLDivElement | null>(null);

  const showCardsAmountActive = !getShowCardAmount(cardArray[0].title);

  const [showCardsAmount, setshowCardsAmount] = useState<boolean>(
    getShowCardAmount(cardArray[0].title)
  );

  const HandleShowCardsAmountSlicer = (value: boolean) => {
    const cardsAmountSlider = showCardsAmountSlicerRef.current;
    cardsAmountSlider?.classList.toggle("show-cards-amount-active", value);

    if (!value) setShowCardAmount(cardArray[0].title);
    else deleteShowCardAmount(cardArray[0].title);

    setshowCardsAmount(getShowCardAmount(cardArray[0].title));
  };

  const LAST_COLUMN_AVAILABLE =
    !showCardsByStatus && columnSliceAvailable && index === cards.length - 1;

  /*
  
  
  
  
  */

  const returnArrayIds = (status: string): number[] => {
    const arrayIds: number[] | undefined = [];
    cardArray.forEach((card) => {
      if (card.status && card.status === status) {
        card.id && arrayIds.push(card.id);
      }
    });
    return arrayIds;
  };

  /*
  
  
  
  
  */

  // column-menu-options-status
  const [columnMenuOptionsStatusOpen, setColumnMenuOptionsStatusOpen] =
    useState<boolean>(false);
  const columnMenuOptionsStatus = useRef<HTMLDivElement | null>(null);
  const columnMenuOptionsStatusExtended = (value: boolean) => {
    const OptionStatus = columnMenuOptionsStatus.current;
    OptionStatus?.classList.toggle(
      "column-menu-status-options-container-active",
      value
    );

    setColumnMenuOptionsStatusOpen(value);
  };
  return (
    <div
      ref={LAST_COLUMN_AVAILABLE ? lastColumnElementRef : null}
      key={index}
      className="column-container"
    >
      <div
        ref={columnMenuContainerRef}
        className="single-column-hide-background single-column-menu-container"
      >
        <div
          onClick={() =>
            HandleOpenAlertMessage(
              "This action will delete this column and all the cards it contains",
              "delete all cards"
            )
          }
          className="single-column-menu-options"
        >
          Delete this column with its cards
        </div>
        <div className="single-column-menu-options-status">
          <span
            onClick={() =>
              columnMenuOptionsStatusExtended(!columnMenuOptionsStatusOpen)
            }
            className="column-menu-status-options-title"
          >
            Delete cards by status
          </span>
          <div
            ref={columnMenuOptionsStatus}
            className="column-menu-status-options-container"
          >
            <span
              onClick={() =>
                HandleOpenAlertMessage(
                  "This action will remove all cards with the status 'applied' from this column",
                  "delete all cards with especific status",
                  "applied"
                )
              }
              className="column-menu-status-single-option"
            >
              Applied
            </span>
            <span
              onClick={() =>
                HandleOpenAlertMessage(
                  "This action will remove all cards with the status 'interview' from this column",
                  "delete all cards with especific status",
                  "interview"
                )
              }
              className="column-menu-status-single-option"
            >
              Interview
            </span>
            <span
              onClick={() =>
                HandleOpenAlertMessage(
                  "This action will remove all cards with the status 'rejected' from this column",
                  "delete all cards with especific status",
                  "rejected"
                )
              }
              className="column-menu-status-single-option"
            >
              Rejected
            </span>
          </div>
        </div>
        {alertMessageOpen ? (
          <div className="column-menu-alert-message">
            <img
              onClick={() => setAlertMessageOpen(false)}
              src={closeForm}
              className="column-close-alert-message-icon"
            />
            <span className="menu-alert-message-title">
              {currentAlertMessage}
            </span>
            <button
              onClick={() => HandleAlertMessageButton()}
              className="button menu-alert-message-button"
            >
              I'm sure
            </button>
          </div>
        ) : null}

        <div className="show-cards-amount-container">
          <div className="show-cards-amount-message">Show cards amount</div>
          <div
            ref={showCardsAmountSlicerRef}
            onClick={() => HandleShowCardsAmountSlicer(!showCardsAmountActive)}
            className={
              showCardsAmountActive
                ? "show-cards-amount-active show-cards-amount-slider"
                : "show-cards-amount-slider"
            }
          >
            <div className="show-cards-slider"></div>
            <div className="show-cards-dot"></div>
          </div>
        </div>
      </div>

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
        {!showCardsAmount ? (
          <span
            area-text={
              cardArray.length - 1 >= 99 ? "container-total-amount" : ""
            }
            className="cards-amount"
          >
            {cardArray.length - 1 <= 99
              ? showCardsByStatus && !cardArray[0].lastCards
                ? `${cardArray.length - 1}+`
                : cardArray.length - 1
              : "99+"}
            <div area-text="total-amount" className="cards_total_amount">
              {cardArray.length - 1}
            </div>
          </span>
        ) : null}

        {!showCardsByStatus ? (
          <img
            ref={columnMenuIconRef}
            src={singleColumnIcon}
            onClick={() => HandleColumnMenuIconClick(!menuIsOpen)}
            className="column-card-menu-icon"
          />
        ) : null}
      </div>
      <div area-text={cardArray[0].title} className="scroll-container">
        {cardArray.map((card, index) => {
          const LAST_CARD =
            index === cardArray.length - 1 &&
            cardArray.length > 10 &&
            cardArray[0].lastCards === false &&
            showCardsByStatus;

          return (
            card.company && (
              <SingleCard
                key={card.id}
                id={card.id}
                company={card.company}
                role={card.role}
                status={card.status}
                description={card.description}
                lastCard={LAST_CARD}
              />
            )
          );
        })}
        <div className="loading-muck-card"></div>
      </div>
    </div>
  );
};

export default SingleColumn;
