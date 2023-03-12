import { useAppSelector } from "../store/store";
import Navbar from "./Navbar";
import "../styles/MainPage.scss";
import CardsContainer from "./CardsContainer";
import FormCreateCard from "./FormCreateCard";
import ErrorMessage from "./ErrorMessage";

const MainPage = () => {
  const { card_error, searchError, create_form_active } = useAppSelector(
    (state) => state.card
  );

  return (
    <div className="container-main-page">
      <div className="container-main-page-backdrop">
        <Navbar />
        <CardsContainer />
      </div>
      {create_form_active ? <FormCreateCard /> : null}
      {/* {loading_single_card ? <UserLoader /> : null} */}
      {card_error ? (
        <ErrorMessage message="There's been an error please verify the information" />
      ) : null}
      {searchError ? (
        <ErrorMessage message="There are no matches with the input" />
      ) : null}
    </div>
  );
};

export default MainPage;
