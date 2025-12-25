import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeaderValue {
  title: string;
  subtitle?: string;
}

interface HeaderState {
  title: string;
  subtitle: string;
}

const initialState: HeaderState = {
  title: "",
  subtitle: "",
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    setHeaderData: (state, action: PayloadAction<HeaderValue>) => {
      state.title = action.payload.title;
      state.subtitle = action.payload.subtitle || "";
    },
    clearHeaderData: (state) => {
      state.title = "";
      state.subtitle = "";
    },
  },
});

export const { setHeaderData, clearHeaderData } = headerSlice.actions;
export default headerSlice.reducer;
