import { createSlice } from "@reduxjs/toolkit";

export const userCompaniesSlice = createSlice({
  name: "userCompanies",
  initialState: {
    userCompanies: [],
    viewedCompany: null,
  },
  reducers: {
    setUserCompanies: (state, action) => {
      state.userCompanies = action.payload;
    },
    setViewedCompany: (state, action) => {
      state.viewedCompany = action.payload;
    },
  },
});

export default userCompaniesSlice.reducer;
export const { setUserCompanies, setViewedCompany } =
  userCompaniesSlice.actions;
