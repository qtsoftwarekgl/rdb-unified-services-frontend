import { createSlice } from "@reduxjs/toolkit";
import store from "store";
export interface User {
  name: string;
  email: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: sessionStorage.getItem("token") || "",
    user: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") as string)
      : ({} as User),
    isAuthenticated:
      sessionStorage.getItem("isAuthenticated") === "true" || false,
      usersList: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      store.set("user", action.payload);
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      store.set("token", action.payload);
      sessionStorage.setItem("token", action.payload);
    },
    setUserAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      sessionStorage.setItem("isAuthenticated", JSON.stringify(action.payload));
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUser, setToken, setUserAuthenticated, setUsersList } = userSlice.actions;
