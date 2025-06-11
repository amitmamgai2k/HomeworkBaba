import {configureStore} from '@reduxjs/toolkit';
import { userSliceReducer } from './Slices/userSlice';
export const store = configureStore({
  reducer: {
    user: userSliceReducer,

  }
});
