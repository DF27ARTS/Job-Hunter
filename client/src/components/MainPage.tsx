import { useAppDispatch, useAppSelector } from "../store/store";
import Navbar from "./Navbar";
import "../styles/MainPage.scss";
import CardsContainer from "./CardsContainer";
import CardLoading from "./CardLoading";
import FormCreateCard from "./FormCreateCard";
import ErrorMessage from "./ErrorMessage";
import { getCards, setShowByStatus } from "../store/cardSlice";

const MainPage = () => {
  const { loading_single_card, card_error, searchError, create_form_active } =
    useAppSelector((state) => state.card);
  const dispatch = useAppDispatch();

  const HandleShowCards = (value: boolean, label: string): void => {
    dispatch(setShowByStatus(value));
    dispatch(getCards());

    const currentShowBy = document.querySelector(`.show-card-active`);
    currentShowBy?.classList.remove("show-card-active");

    const newShowBy = document.querySelector(`[area-text=${label}]`);
    newShowBy?.classList.add("show-card-active");
  };

  return (
    <div className="container-main-page">
      <div className="container-main-page-backdrop">
        <Navbar />
        <div className="container-filters-navbar">
          <button className="show-cards">
            <div
              onClick={() => HandleShowCards(false, "show-date")}
              area-text="show-date"
              className="show-card-active"
            >
              Show by Date
            </div>
          </button>
          <button className="show-cards">
            <div
              onClick={() => HandleShowCards(true, "show-status")}
              area-text="show-status"
            >
              Show by Status
            </div>
          </button>
        </div>
        <CardsContainer />
      </div>
      {create_form_active ? <FormCreateCard /> : null}
      {loading_single_card ? <CardLoading /> : null}
      {card_error ? (
        <ErrorMessage message="Required information is missing" />
      ) : null}
      {searchError ? (
        <ErrorMessage message="There are no matches with the input" />
      ) : null}
    </div>
  );
};

export default MainPage;
