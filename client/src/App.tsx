import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Registration from "./components/Registration";
import { useAppDispatch, useAppSelector } from "./store/store";
import { verifyToken } from "./store/userSlice";
import { useEffect } from "react";
import MainPage from "./components/MainPage";
import { getCards } from "./store/cardSlice";

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(verifyToken());
    dispatch(getCards());
  }, [dispatch, verifyToken, getCards]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/registration"
          element={
            !isLoggedIn ? <Registration /> : <Navigate to="/home" replace />
          }
        />
        <Route
          path={"/login"}
          element={!isLoggedIn ? <Login /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <MainPage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
