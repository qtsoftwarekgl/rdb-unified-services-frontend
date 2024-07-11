import store from 'store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { externalServiceApi } from '@/constants/environments';

export const businessExternalServiceApiSlice = createApi({
  reducerPath: 'externalServiceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${externalServiceApi}/business`,
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
      // GET USER INFO
      getUserInformation: builder.query({
        query: ({ documentNumber }) =>
          `/user-info?documentNumber=${documentNumber}`,
      }),
    };
  },
});

export const { useLazyGetUserInformationQuery } = businessExternalServiceApiSlice;

export default businessExternalServiceApiSlice;
