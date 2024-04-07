import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAmending: localStorage.getItem("isAmending") === "true" ? true : false,
};

const amendmentSlice = createSlice({
  name: "amendment",
  initialState,
  reducers: {
    setIsAmending: (state, action) => {
      state.isAmending = action.payload;
      localStorage.setItem("isAmending", action.payload);
    },
  },
});

export default amendmentSlice.reducer;

export const { setIsAmending } = amendmentSlice.actions;
