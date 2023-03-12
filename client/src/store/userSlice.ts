import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { getCards } from "./cardSlice"
import { deleteToken, getToken, saveToken } from "./__Functions";


export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
console.log("variables", import.meta.env)
console.log("single variable", import.meta.env.VITE_VERCEL_API_URL)
// export const API_URL = "https://jub-hunter-api.onrender.com"


export interface User {
  id?: number;
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

interface userState {
  user?: User;
  loading: boolean
  isLoggedIn: boolean
  error: boolean
}

const initialState: userState = {
  user: {},
  loading: false,
  isLoggedIn: false,
  error: false
}


export const registerUser = createAsyncThunk<Object, User>(
  "user/registerUser",
  async (data, ThunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/registration/register`, data)
      saveToken(response.data.token)
      return response.data.user
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const logInUser = createAsyncThunk<Object, User>(
  "user/logInUser",
  async (data, ThunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/registration/login`, data)
      saveToken(response.data.token)
      ThunkAPI.dispatch(getCards())
      return response.data.user
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const verifyToken = createAsyncThunk<User>(
  "user/verifyToken",

  async (_, ThunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/registration/verifyUser`, {
        headers: {
          Authorization: getToken(),
        },
      })
      return response.data
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)


export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOutUser: (state) => {
      deleteToken()
      state.user = {}
      state.isLoggedIn = false
    },
    closeError: (state) => {
      state.error = false
    }
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.isLoggedIn = true
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false
        state.error = true
      })


    builder
      .addCase(logInUser.pending, (state) => { state.loading = true })
      .addCase(logInUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.isLoggedIn = true
      })
      .addCase(logInUser.rejected, (state) => {
        state.loading = false
        state.error = true
      })


    builder
      .addCase(verifyToken.pending, (state) => { state.loading = true })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.isLoggedIn = true
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false
        state.isLoggedIn = false
      })
  },
})

export default UserSlice.reducer
export const { logOutUser, closeError } = UserSlice.actions