import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        token: null,
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
    }
});

export default userSlice.reducer;

export const { setUser, setToken } = userSlice.actions;
