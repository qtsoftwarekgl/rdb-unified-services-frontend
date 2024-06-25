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
import businessSlice from "./features/businessSlice";
import enterpriseRegistrationSlice from "./features/enterpriseRegistrationSlice";
import foreignCompanyRegistrationSlice from "./features/foreignCompanyRegistrationSlice";
import nameReservationSlice from "./features/nameReservationSlice";
import userApplicationSlice from "./features/userApplicationSlice";
import businessRegApiSlice from "./api/businessRegApiSlice";
import collateralRegistrationSlice from "./features/collateralRegistrationSlice";
import collateralReviewSlice from "./features/collateralReviewSlice";
import applicationReviewSlice from "./features/applicationReviewSlice";
import serviceSlice from "./features/serviceSlice";
import coreApiSlice from "./api/coreApiSlice";
import locationSlice from "./features/locationSlice";
import businessActivitySlice from "./features/businessActivitySlice";
import businessPeopleSlice from "./features/businessPeopleSlice";
import authApiSlice from "./api/authApiSlice";
import founderDetailSlice from "./features/founderDetailSlice";
import shareDetailSlice from "./features/shareDetailSlice";
import externalServiceApiSlice from "./api/externalServiceApiSlice";
import executiveManagerSlice from "./features/executiveManagerSlice";
import boardOfDirectorSlice from "./features/boardOfDirectorSlice";
import foreignRegApiSlice from "./api/foreignCompanyRegistrationApiSlice";

export const store = configureStore({
  reducer: {
    [businessRegApiSlice.reducerPath]: businessRegApiSlice.reducer,
    [foreignRegApiSlice.reducerPath]: foreignRegApiSlice.reducer,
    [coreApiSlice.reducerPath]: coreApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [externalServiceApiSlice.reducerPath]: externalServiceApiSlice.reducer,
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
    business: businessSlice,
    enterpriseRegistration: enterpriseRegistrationSlice,
    foreignCompanyRegistration: foreignCompanyRegistrationSlice,
    nameReservation: nameReservationSlice,
    userApplication: userApplicationSlice,
    collateralRegistration: collateralRegistrationSlice,
    collateralReview: collateralReviewSlice,
    applicationReview: applicationReviewSlice,
    service: serviceSlice,
    location: locationSlice,
    businessActivity: businessActivitySlice,
    businessPeople: businessPeopleSlice,
    executiveManager: executiveManagerSlice,
    boardOfDirector: boardOfDirectorSlice,
    founderDetail: founderDetailSlice,
    shareDetail: shareDetailSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      businessRegApiSlice.middleware,
      foreignRegApiSlice.middleware,
      authApiSlice.middleware,
      coreApiSlice.middleware,
      externalServiceApiSlice.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
