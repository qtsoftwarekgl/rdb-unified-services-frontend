import { createSlice } from "@reduxjs/toolkit";

export const businessRegistrationSlice = createSlice({
    name: 'businessRegistration',
    initialState: {
        step: 1
    },
    reducers: {
        setStep: (state, action) => {
            state.step = action.payload;
        }
    }
});

export default businessRegistrationSlice.reducer;

export const { setStep } = businessRegistrationSlice.actions; 
