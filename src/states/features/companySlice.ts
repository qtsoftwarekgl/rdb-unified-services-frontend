import { createSlice } from '@reduxjs/toolkit';

export const companySlice = createSlice({
  name: 'userCompanies',
  initialState: {
    companiesList: [],
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  },
  reducers: {
    setCompaniesList: (state, action) => {
      state.companiesList = action.payload;
    },
    setCompanyPage: (state, action) => {
      state.page = action.payload;
    },
    setCompanySize: (state, action) => {
      state.size = action.payload;
    },
    setCompanyTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },
    setCompanyTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
  },
});

export default companySlice.reducer;

export const {
  setCompaniesList,
  setCompanyPage,
  setCompanySize,
  setCompanyTotalElements,
  setCompanyTotalPages,
} = companySlice.actions;
