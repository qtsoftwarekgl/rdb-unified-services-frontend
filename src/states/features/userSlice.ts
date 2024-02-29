import { createSlice } from "@reduxjs/toolkit";

export interface User {
    name: string;
    email: string;
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        token: sessionStorage.getItem("token") || '',
        user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user") as string) : {} as User,
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
