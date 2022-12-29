import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

import { CardSlice } from "./cardSlice";
import { UserSlice } from "./userSlice";

export const store = configureStore({
  reducer: {
    card: CardSlice.reducer,
    user: UserSlice.reducer
  }
})

export const useAppDispatch: () => typeof store.dispatch=useDispatch
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
