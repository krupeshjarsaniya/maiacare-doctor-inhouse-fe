import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LogoutState = {
  isLoggedOut: boolean;
};

const initialState: LogoutState = {
  isLoggedOut: false,
};

export const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    setLogoutState: (state, action: PayloadAction<boolean>) => {
      state.isLoggedOut = action.payload;
    },
  },
});

export const { setLogoutState } = logoutSlice.actions;
export default logoutSlice.reducer;
