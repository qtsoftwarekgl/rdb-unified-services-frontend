import { Service } from '@/types/models/service';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  servicesList: Service[];
  service: Service;
} = {
  servicesList: [],
  service: {} as Service,
};

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServicesList: (state, action) => {
      state.servicesList = action.payload;
    },
    setService: (state, action) => {
      state.service = action.payload;
    },
  },
});

export const { setServicesList, setService } =
  serviceSlice.actions;

export default serviceSlice.reducer;
