import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import axios, {AxiosResponse} from "axios"
import { getCards } from "./cardSlice"

export const saveToken = (token: string): void => {
  const response = localStorage.setItem("token", token)
  return response
}

export const getToken = (): string | null => {
  const response = localStorage.getItem("token")
  return response
}

export const deleteToken = (): void => {
  const response = localStorage.removeItem("token")
  return response
}

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


export const registerUser = createAsyncThunk<Object, User > (
  "user/registerUser",
  async (data, ThunkAPI) => {
    try {
      const response = await axios.post("http://localhost:3001/registration/register", data)
      saveToken(response.data.token)
      return response.data.user
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const logInUser = createAsyncThunk<Object, User > (
  "user/logInUser",
  async (data, ThunkAPI) => {
    try {
      const response = await axios.post("http://localhost:3001/registration/login", data )
      saveToken(response.data.token)
      ThunkAPI.dispatch(getCards())
      return response.data.user
    } catch (error) {
      return ThunkAPI.rejectWithValue(error)
    }
  }
)

export const verifyToken = createAsyncThunk< User > (
  "user/verifyToken",

  async (_, ThunkAPI) => {
    try {
      const response = await axios.get("http://localhost:3001/registration/verifyUser", {
        headers: {
          Authorization: getToken(),
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      return ThunkAPI.rejectWithValue(error)
    }
  }
)


export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // logOutUser: (state, action:PayloadAction<User>) => {
    logOutUser:  (state) => {
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
export const {logOutUser, closeError} = UserSlice.actions