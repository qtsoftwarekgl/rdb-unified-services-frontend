import { createSlice } from "@reduxjs/toolkit";

export const localeSlice = createSlice({
  name: "locale",
  initialState: {
    locale: sessionStorage.getItem("locale") || "en",
  },
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload;
      sessionStorage.setItem("locale", action.payload);
    },
  },
});

export const { setLocale } = localeSlice.actions;

export default localeSlice.reducer;
