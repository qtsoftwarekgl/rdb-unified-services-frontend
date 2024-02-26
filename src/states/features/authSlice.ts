import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        infoModal: false,
    },
    reducers: {
        setInfoModal: (state, action) => {
            state.infoModal = action.payload;
        },
    }
});

export default authSlice.reducer;

export const { setInfoModal } = authSlice.actions;
