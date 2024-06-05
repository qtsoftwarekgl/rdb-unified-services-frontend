import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ResponseErrorType {
  status: number;
  data: {
    message: string;
  };
}

export const businessRegistrationApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8051/api/company',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
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
