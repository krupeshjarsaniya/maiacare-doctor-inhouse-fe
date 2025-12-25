import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of user/auth data
export interface AuthData {
  _id?: string | number;
  name?: string;
  profilePicture?: string;
}

interface AuthState {
  user: AuthData | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
