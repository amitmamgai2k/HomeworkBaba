import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";
import { ToastAndroid } from "react-native";
import { auth } from "../../firebase.config";

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


      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();


      const response = await axiosInstance.post("/users/register", userData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Registration response:", response.data);
      return response.data;

    } catch (error) {
      ToastAndroid.show(
        error.response?.data?.message || "Registration failed",
        ToastAndroid.SHORT
      );
      console.error("Error registering user:", error);

      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "Network error - no response from server" });
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);
export const createAssignment = createAsyncThunk(
  "user/createAssignment",
  async (assignmentData, { rejectWithValue }) => {
    try {
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();
      console.log("Creating assignment with data:", assignmentData);

      const response = await axiosInstance.post("/users/new-assignment", assignmentData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating assignment:", error);
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "Network error - no response from server" });
      } else {
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
      })
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload);
        state.error = null;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Failed to create assignment" };
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;