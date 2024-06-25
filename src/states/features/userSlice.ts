import { User } from "@/types/models/User";
import { createSlice } from "@reduxjs/toolkit";
import store from "store";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: store.get("token") || "",
    user: store.get("user") || ({} as User),
    usersList: [],
    pagination: {
      page: 1,
      size: 10,
      totalElements: 0,
      currentPage: 1,
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      store.set("user", action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      store.set("token", action.payload);
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUser, setToken, setUsersList, setPagination } =
  userSlice.actions;
