import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import store from "store";

export const coreApiSlice = createApi({
  reducerPath: 'coreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8051/api',
    prepareHeaders: (headers) => {
      const user = store.get('user');
      if (user?.token) {
        headers.set('authorization', `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // FETCH SERVICES
    fetchServices: builder.query({
      query: ({ category }) => {
        return {
          url: `/services?${category ? `category=${category}` : ''}`,
        };
      },
    }),

    // GET SERVICE
    getService: builder.query({
      query: ({ id }) => {
        return {
          url: `/services/${id}`,
        };
      },
    }),
  }),
});

export const { useLazyFetchServicesQuery, useLazyGetServiceQuery } = coreApiSlice;

export default coreApiSlice;
