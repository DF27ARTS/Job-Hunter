import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Registration from "./components/Registration";
import { useAppDispatch, useAppSelector } from "./store/store";
import { verifyToken } from "./store/userSlice";
import { useEffect } from "react";
import MainPage from "./components/MainPage";
import { getCards, getCardsSliced } from "./store/cardSlice";
import UserLoader from "./components/UserLoader";

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const dispatch = useAppDispatch();

  const { loading_single_card } = useAppSelector((state) => state.card);

  useEffect(() => {
    dispatch(verifyToken());
    dispatch(getCards());
  }, [dispatch, verifyToken, getCards]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/registration"
            element={
              !isLoggedIn ? <Registration /> : <Navigate replace to="/home" />
            }
          />
          <Route
            path={"/login"}
            element={!isLoggedIn ? <Login /> : <Navigate replace to="/home" />}
          />
          <Route
            path="/home"
            element={
              isLoggedIn ? <MainPage /> : <Navigate replace to="/login" />
            }
          />
          <Route path="/*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
      {loading_single_card ? <UserLoader /> : null}
    </>
  );
}

export default App;
