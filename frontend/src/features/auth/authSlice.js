import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { jwtDecode } from "jwt-decode";


const initialState = {
  isLoggedIn: !!localStorage.getItem("Token"),
  token: localStorage.getItem("Token") || null,
  error: null
};

export const signup_user = createAsyncThunk(
  'auth/createuser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/user/register', userData)
      return response.data;;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const login_user = createAsyncThunk(
  'auth/loginuser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/user/login', userData);
      return response.data;
    } catch (err) {
      console.log(err)
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    token_check: (state) => {
      try {
        const token = localStorage.getItem("Token")
        if (!token) {
          state.isLoggedIn = false;
          state.token = null;
          return;
        }
        const checkvalid = jwtDecode(token)
        const currentTime = Date.now() / 1000
        if (checkvalid.exp - currentTime < 60) {
          localStorage.removeItem('Token')
          state.isLoggedIn = false;
          state.token = null
        }

      } catch (error) {
        console.log(error)
        state.isLoggedIn = false;
        state.token = null
      }
    },
    logout: (state) => {
      localStorage.clear(),
      state.isLoggedIn= false,
      state.token = null

    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(signup_user.fulfilled, (state, action) => {
        state.isLoggedIn = true,
          state.token = action.payload.token,
          state.error = false
        localStorage.setItem("Token", action.payload.token);
      })

      .addCase(signup_user.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.error = action.payload?.message || "Signup failed";
      })
      .addCase(login_user.fulfilled, (state, action) => {
        state.isLoggedIn = true,
          state.token = action.payload.token,
          state.error = false
        localStorage.setItem("Token", action.payload.token);

      })
      .addCase(login_user.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.error = action.payload?.message || "Login failed";
      })
  }

});

export const { token_check,logout } = authSlice.actions

export default authSlice.reducer;