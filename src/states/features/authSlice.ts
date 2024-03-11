import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    infoModal: false,
    registrationStep:
      sessionStorage.getItem('registrationStep') || 'select-nationality',
    userDetails: JSON.parse(sessionStorage.getItem('userDetails') as string) || null,
    nationalIdDetails:
      JSON.parse(sessionStorage.getItem('nationalIdDetails') as string) || null,
  },
  reducers: {
    setInfoModal: (state, action) => {
      state.infoModal = action.payload;
    },
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
      sessionStorage.setItem('registrationStep', action.payload);
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
      sessionStorage.setItem('userDetails', JSON.stringify(action.payload));
    },
    setNationalIdDetails: (state, action) => {
      state.nationalIdDetails = action.payload;
      sessionStorage.setItem(
        'nationalIdDetails',
        JSON.stringify(action.payload)
      );
    },
  },
});

export default authSlice.reducer;

export const {
  setInfoModal,
  setRegistrationStep,
  setUserDetails,
  setNationalIdDetails,
} = authSlice.actions;
