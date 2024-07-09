import store from 'store'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  registrationStep:
  store.get('registrationStep') || 'selectNationality',
  infoModal: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInfoModal: (state, action) => {
      state.infoModal = action.payload;
    },
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
      store.set('registrationStep', action.payload);
    },
  },
});

export default authSlice.reducer;

export const {
  setInfoModal,
  setRegistrationStep,
} = authSlice.actions;
