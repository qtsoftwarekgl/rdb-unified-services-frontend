import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store';

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8050/api/v1/auth',
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
    };
  },
});

export const { useLoginMutation } = authApiSlice;

export default authApiSlice;
