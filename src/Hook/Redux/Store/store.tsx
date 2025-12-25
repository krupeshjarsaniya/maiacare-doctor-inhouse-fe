import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/Hook/Redux/Slice/authSlice";
import tokenReducer from "@/Hook/Redux/Slice/tokenSlice";
import headerReducer from "@/Hook/Redux/Slice/headerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    token: tokenReducer,
    header: headerReducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;
