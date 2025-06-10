import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
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

      const response = await axiosInstance.post("/user/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { logout } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;
