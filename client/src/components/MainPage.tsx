import { useAppDispatch, useAppSelector } from "../store/store";
import Navbar from "./Navbar";
import "../styles/MainPage.scss";
import CardsContainer from "./CardsContainer";
import CardLoading from "./CardLoading";
import FormCreateCard from "./FormCreateCard";
import ErrorMessage from "./ErrorMessage";
import { clearStorage, getCards, setShowByStatus } from "../store/cardSlice";

const MainPage = () => {
  const {
    loading_single_card,
    card_error,
    searchError,
    create_form_active,
    showCardsByStatus,
  } = useAppSelector((state) => state.card);
  const dispatch = useAppDispatch();

  return (
    <div className="container-main-page">
      <div className="container-main-page-backdrop">
        <Navbar />
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
