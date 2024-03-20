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
      // create user application entry if not exist
      const userApplicationIndex = state.user_applications?.findIndex(
        (app) => app?.entry_id === action?.payload?.entry_id
      );

      if (userApplicationIndex === -1)
        state.user_applications = [...state.user_applications, action.payload];
      else
        state.user_applications[userApplicationIndex] = {
          ...state.user_applications[userApplicationIndex],
          ...action.payload,
        };

      localStorage.setItem(
        "user_applications",
        JSON.stringify(state.user_applications)
      );
    },
  },
});

export default userApplicationsSlice.reducer;

export const { setUserApplications } = userApplicationsSlice.actions;
