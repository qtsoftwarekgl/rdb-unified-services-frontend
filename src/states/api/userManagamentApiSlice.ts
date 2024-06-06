import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store';

export const userManagementApiSlice = createApi({
  reducerPath: 'userManagementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8050/api/users',
    prepareHeaders: (headers) => {
      const user = store.get('user');
      if (user.token) {
        headers.set('authorization', `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    // LOGIN
    return {
      login: builder.mutation({
        query: ({ username, password }) => {
          return {
            url: '/auth/login',
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

export const { useLoginMutation } = userManagementApiSlice;

export default userManagementApiSlice;
