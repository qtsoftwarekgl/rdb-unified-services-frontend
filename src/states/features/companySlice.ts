import { createSlice } from '@reduxjs/toolkit';

export const companySlice = createSlice({
  name: 'userCompanies',
  initialState: {
    companiesList: [],
    pagination: {
      page: 1,
      size: 10,
      totalElements: 0,
      currentPage: 1,
    },
  },
  reducers: {
    setCompaniesList: (state, action) => {
      state.companiesList = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
});

export default companySlice.reducer;

export const { setCompaniesList, setPagination } = companySlice.actions;
