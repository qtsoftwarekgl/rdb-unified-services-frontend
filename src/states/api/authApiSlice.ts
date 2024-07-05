import {
  userManagementLocalApi,
  userManagementUatApi,
} from '@/constants/environments';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store';

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${userManagementLocalApi || userManagementUatApi}/auth`,
    prepareHeaders: (headers) => {
      const user = store.get('user');
      if (user?.token) {
        headers.set('authorization', `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      // LOGIN
      login: builder.mutation({
        query: ({ username, password }) => {
          return {
            url: '/login',
            method: 'POST',
            body: {
              email: username,
              password,
            },
          };
        },
      }),

      // SIGNUP
      signup: builder.mutation({
        query: ({
          email,
          firstName,
          lastName,
          nationalId,
          password,
          phoneNumber,
          userType,
        }) => {
          return {
            url: `/signup`,
            method: 'POST',
            body: {
              email,
              firstName,
              lastName,
              nationalId,
              password,
              phoneNumber,
              userType,
            },
          };
        },
      }),
    };
  },
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;

export default authApiSlice;
