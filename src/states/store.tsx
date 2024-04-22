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
import foreignBranchRegistrationSlice from "./features/foreignBranchRegistrationSlice";
import nameReservationSlice from "./features/nameReservationSlice";
import userApplicationSlice from "./features/userApplicationSlice";
import { rootApi } from "./api/api";
import collateralRegistrationSlice from "./features/collateralRegistrationSlice";
import collateralReviewSlice from "./features/collateralReviewSlice";

export const store = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
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
    foreignBranchRegistration: foreignBranchRegistrationSlice,
    nameReservation: nameReservationSlice,
    userApplication: userApplicationSlice,
    collateralRegistration: collateralRegistrationSlice,
    collateralReview: collateralReviewSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(rootApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
