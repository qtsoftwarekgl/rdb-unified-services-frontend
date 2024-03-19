import { createSlice } from "@reduxjs/toolkit";

export const userApplicationsSlice = createSlice({
  name: "userApplications",
  initialState: {
    user_applications:
      JSON.parse(String(localStorage.getItem("user_applications"))) || [],
    user_uncompleted_applications:
      JSON.parse(
        String(localStorage.getItem("user_uncompleted_applications"))
      ) || [],
  },
  reducers: {
    setUserApplications: (state, action) => {
      state.user_applications = [...state.user_applications, action.payload];
      localStorage.setItem(
        "user_applications",
        JSON.stringify(state.user_applications)
      );
    },
  },
});

export default userApplicationsSlice.reducer;

export const { setUserApplications } = userApplicationsSlice.actions;
