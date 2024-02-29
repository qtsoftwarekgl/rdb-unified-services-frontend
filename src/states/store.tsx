import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import authSlice from './features/authSlice';
import businessRegistrationSlice from './features/businessRegistrationSlice';
import sidebarSlice from './features/sidebarSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authSlice,
    businessRegistration: businessRegistrationSlice,
    sidebar: sidebarSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
