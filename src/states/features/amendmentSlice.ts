import { createSlice } from "@reduxjs/toolkit";

const amendmentSlice = createSlice({
  name: "amendment",
  initialState: {
    isAmending: false,
  },
  reducers: {
    setIsAmending: (state, action) => {
      state.isAmending = action.payload;
    },
  },
});

export default amendmentSlice.reducer;

export const { setIsAmending } = amendmentSlice.actions;
