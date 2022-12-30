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
            element={!isLoggedIn ? <Registration /> : <Navigate to="/home" />}
          />
          <Route
            path={"/login"}
            element={!isLoggedIn ? <Login /> : <Navigate to="/home" />}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <MainPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
