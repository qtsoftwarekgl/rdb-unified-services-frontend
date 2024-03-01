import { createSlice } from "@reduxjs/toolkit";

export const tableSlice = createSlice({
    name: 'table',
    initialState: {
        filterModal: false,
    },
    reducers: {
        setFilterModal: (state, action) => {
            state.filterModal = action.payload;
        }
    }
});

export default tableSlice.reducer;

export const { setFilterModal } = tableSlice.actions;
