import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Registering user with data:", userData);

      // Make sure axiosInstance is properly configured
      const response = await axiosInstance.post("/users/register", userData);

      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue({ message: "Network error - no response from server" });
      } else {
        // Something else happened
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Registration failed" };
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;