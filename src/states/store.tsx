import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import authSlice from "./features/authSlice";
import businessRegistrationSlice from "./features/businessRegistrationSlice";
import sidebarSlice from "./features/sidebarSlice";
import tableSlice from "./features/tableSlice";
import paginationSlice from "./features/paginationSlice";
import navbarSlice from "./features/navbarSlice";
import roleSlice from "./features/roleSlice";
import permissionSlice from "./features/permissionSlice";
import institutionSlice from "./features/institutionSlice";
import localeSlice from "./features/localeSlice";
import userCompaniesSlice from "./features/userCompaniesSlice";
import enterpriseRegistrationSlice from "./features/enterpriseRegistrationSlice";
import nameReservationSlice from "./features/nameReservation";

export const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authSlice,
    businessRegistration: businessRegistrationSlice,
    sidebar: sidebarSlice,
    table: tableSlice,
    pagination: paginationSlice,
    navbar: navbarSlice,
    role: roleSlice,
    permission: permissionSlice,
    institution: institutionSlice,
    locale: localeSlice,
    userCompanies: userCompaniesSlice,
    enterpriseRegistration: enterpriseRegistrationSlice,
    nameReservation: nameReservationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
