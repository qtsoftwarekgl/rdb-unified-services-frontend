import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import authSlice from './features/authSlice';
import businessRegistrationSlice from './features/businessRegistrationSlice';
import sidebarSlice from './features/sidebarSlice';
import tableSlice from './features/tableSlice';
import paginationSlice from './features/paginationSlice';
import navbarSlice from './features/navbarSlice';
import roleSlice from './features/roleSlice';
import permissionSlice from './features/permissionSlice';
import institutionSlice from './features/institutionSlice';
import localeSlice from './features/localeSlice';
import businessSlice from './features/businessSlice';
import enterpriseRegistrationSlice from './features/enterpriseRegistrationSlice';
import foreignCompanyRegistrationSlice from './features/foreignCompanyRegistrationSlice';
import nameReservationSlice from './features/nameReservationSlice';
import userApplicationSlice from './features/userApplicationSlice';
import businessRegistrationApiSlice from './api/businessRegistrationApiSlice';
import userManagementApiSlice from './api/userManagamentApiSlice';
import collateralRegistrationSlice from './features/collateralRegistrationSlice';
import collateralReviewSlice from './features/collateralReviewSlice';
import applicationReviewSlice from './features/applicationReviewSlice';
import serviceSlice from './features/serviceSlice';
import coreApiSlice from './api/coreApiSlice';
import locationSlice from './features/locationSlice';

export const store = configureStore({
  reducer: {
    [businessRegistrationApiSlice.reducerPath]:
      businessRegistrationApiSlice.reducer,
    [userManagementApiSlice.reducerPath]: userManagementApiSlice.reducer,
    [coreApiSlice.reducerPath]: coreApiSlice.reducer,
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
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      businessRegistrationApiSlice.middleware,
      userManagementApiSlice.middleware,
      coreApiSlice.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
