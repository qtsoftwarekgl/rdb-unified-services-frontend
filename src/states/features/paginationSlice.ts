import { createSlice } from '@reduxjs/toolkit';

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    page: 0,
    size: 10,
    totalPages: 1,
    totalSize: 0,
    currentPage: 1,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setTotalSize: (state, action) => {
      state.totalSize = action.payload;
    },
    setCurrentPage: (state, action) => {
        state.currentPage = action.payload;
    }
  },
});

export default paginationSlice.reducer;

export const { setPage, setSize, setTotalPages, setTotalSize, setCurrentPage } =
  paginationSlice.actions;
