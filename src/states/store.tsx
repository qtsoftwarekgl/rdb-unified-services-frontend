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
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
