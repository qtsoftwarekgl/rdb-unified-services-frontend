import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store';

export const businessRegistrationApiSlice = createApi({
  reducerPath: 'businessRegistrationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8051/api/company',
    prepareHeaders: (headers) => {
      const user = store.get('user');
      if (user) {
        headers.set('authorization', `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      // SEARCH COMPANIES
      searchCompanies: builder.query({
        query: ({ type, companyName, tin, page, size }) => {
          return {
            url: `/search?companyName=${companyName}&tin=${tin}&type=${type}&page=${page}&size=${size}`,
          };
        },
      }),
    };
  },
});

export const { useLazySearchCompaniesQuery } = businessRegistrationApiSlice;

export default businessRegistrationApiSlice;
