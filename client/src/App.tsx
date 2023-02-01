import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Registration from "./components/Registration";
import { useAppDispatch, useAppSelector } from "./store/store";
import { verifyToken } from "./store/userSlice";
import { useEffect } from "react";
import MainPage from "./components/MainPage";
import { getCards } from "./store/cardSlice";
import { DotenvConfigOutput } from "dotenv";
import UserLoader from "./components/UserLoader";
// dotenv.configure()
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const dispatch = useAppDispatch();

  const { loading_single_card } = useAppSelector((state) => state.card);

  useEffect(() => {
    dispatch(verifyToken());
    dispatch(getCards());
  }, [dispatch, verifyToken, getCards]);

  return (
    <div onLoad={() => <Navigate to="/login" />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/registration"
            element={!isLoggedIn ? <Registration /> : <MainPage />}
          />
          <Route
            path={"/login"}
            element={!isLoggedIn ? <Login /> : <MainPage />}
          />
          <Route path="/home" element={isLoggedIn ? <MainPage /> : <Login />} />
          <Route path="/*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
      {loading_single_card ? <UserLoader /> : null}
    </div>
  );
}

export default App;
