import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeaderValue {
  title: string;
  subtitle?: string;
    showBack?: boolean;   // 👈 ADD
}

interface HeaderState {
  title: string;
  subtitle: string;
    showBack: boolean;    // 👈 ADD
}

const initialState: HeaderState = {
  title: "",
  subtitle: "",
   showBack: false,   // 👈 ADD
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderData: (state, action: PayloadAction<HeaderValue>) => {
      state.title = action.payload.title;
      state.subtitle = action.payload.subtitle || "";
      state.showBack = action.payload.showBack ?? false; // 👈 ADD
    },
    clearHeaderData: (state) => {
      state.title = "";
      state.subtitle = "";
      state.showBack = false; // 👈 ADD
    },
  },
});


export const { setHeaderData, clearHeaderData } = headerSlice.actions;
export default headerSlice.reducer;
