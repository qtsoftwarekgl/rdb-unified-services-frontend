import { createSlice } from '@reduxjs/toolkit';

export const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    servicesList: [],
    selectedService: null,
  },
  reducers: {
    setServicesList: (state, action) => {
      state.servicesList = action.payload;
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
  },
});

export const { setServicesList, setSelectedService } = serviceSlice.actions;

export default serviceSlice.reducer;
