import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        infoModal: false,
        registrationStep: sessionStorage.getItem('registrationStep') || 'select-nationality',
        userDetails: sessionStorage.getItem('userDetails') || null,
        nationalIdDetails: sessionStorage.getItem('nationalIdDetails') || null
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
            sessionStorage.setItem('userDetails', action.payload);
        },
        setNationalIdDetails: (state, action) => {
            state.nationalIdDetails = action.payload;
            sessionStorage.setItem('nationalIdDetails', action.payload);
        }
    }
});

export default authSlice.reducer;

export const { setInfoModal, setRegistrationStep, setUserDetails, setNationalIdDetails } = authSlice.actions;
