import { ReservedName } from "@/types/models/reservedName";
import { createSlice } from "@reduxjs/toolkit";

const initialState :{
    reservedNames: ReservedName[];
    selectedReservedName: ReservedName | null;
    skipReservedName: boolean;
    showSelectReservedName: boolean;
} = {
    reservedNames: [],
    selectedReservedName: null,
    skipReservedName: false,
    showSelectReservedName: false
}
export const businessRegistrationUISlice = createSlice({
    name: "businessRegistrationUI",
    initialState,
    reducers: {
        setReservedNames: (state, action) => {
            state.reservedNames = action.payload;
        },
        setSelectedReservedName: (state, action) => {
            state.selectedReservedName = action.payload;
        },
        setSkipReservedName: (state, action) => {
            state.skipReservedName = action.payload;
        },
        setShowSelectReservedName: (state, action) => { 
            state.showSelectReservedName = action.payload
        }
    }
});

export const { setReservedNames, setSelectedReservedName, setSkipReservedName, setShowSelectReservedName } = businessRegistrationUISlice.actions;

export default businessRegistrationUISlice.reducer;
