import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { jwtDecode } from "jwt-decode";

const ADMIN_TOKEN_KEY = "AdminToken";

const getPersistedToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

const extractErrorMessage = (payload, fallback) => {
  if (payload?.message) return payload.message;
  if (Array.isArray(payload?.error) && payload.error.length > 0) {
    return payload.error[0]?.message || fallback;
  }
  return fallback;
};

const resetAdminAuthState = (state) => {
  state.isAdminLoggedIn = false;
  state.token = null;
  state.admin = null;
};

const initialState = {
  isAdminLoggedIn: !!getPersistedToken(),
  token: getPersistedToken() || null,
  admin: null,
  loading: false,
  error: null
};

export const admin_signup = createAsyncThunk(
  "adminAuth/signup",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/admin/signup", adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        ...error.response?.data,
        status: error.response?.status
      });
    }
  }
);

export const admin_login = createAsyncThunk(
  "adminAuth/login",
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/admin/login", adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        ...error.response?.data,
        status: error.response?.status
      });
    }
  }
);

export const getCurrentAdmin = createAsyncThunk(
  "adminAuth/getCurrentAdmin",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.adminAuth?.token || getPersistedToken();

      if (!token) {
        return rejectWithValue({
          message: "Admin token missing"
        });
      }

      const response = await api.get("/api/v1/admin/getCurrentAdmin", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data?.success) {
        return rejectWithValue(response.data);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        ...error.response?.data,
        status: error.response?.status
      });
    }
  }
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    admin_token_check: (state) => {
      const token = getPersistedToken();
      if (!token) {
        resetAdminAuthState(state);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const nowInSeconds = Date.now() / 1000;

        if (!decoded?.exp || decoded.exp <= nowInSeconds + 60) {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          resetAdminAuthState(state);
          return;
        }

        state.isAdminLoggedIn = true;
        state.token = token;
      } catch (error) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        resetAdminAuthState(state);
      }
    },
    admin_logout: (state) => {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      resetAdminAuthState(state);
      state.error = null;
      state.loading = false;
    },
    clear_admin_error: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(admin_signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(admin_signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdminLoggedIn = true;
        state.token = action.payload?.token || null;
        state.admin = action.payload?.admin || null;
        state.error = null;

        if (action.payload?.token) {
          localStorage.setItem(ADMIN_TOKEN_KEY, action.payload.token);
        }
      })
      .addCase(admin_signup.rejected, (state, action) => {
        state.loading = false;
        resetAdminAuthState(state);
        state.error = extractErrorMessage(action.payload, "Admin signup failed");
      })
      .addCase(admin_login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(admin_login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdminLoggedIn = true;
        state.token = action.payload?.token || null;
        state.admin = action.payload?.admin || null;
        state.error = null;

        if (action.payload?.token) {
          localStorage.setItem(ADMIN_TOKEN_KEY, action.payload.token);
        }
      })
      .addCase(admin_login.rejected, (state, action) => {
        state.loading = false;
        resetAdminAuthState(state);
        state.error = extractErrorMessage(action.payload, "Admin login failed");
      })
      .addCase(getCurrentAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload?.admin || null;
        state.error = null;
      })
      .addCase(getCurrentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = extractErrorMessage(action.payload, "Failed to fetch admin");

        if ([401, 404].includes(action.payload?.status)) {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          resetAdminAuthState(state);
        }
      });
  }
});

export const { admin_token_check, admin_logout, clear_admin_error } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
