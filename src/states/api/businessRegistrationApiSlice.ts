import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store';

export const businessRegistrationApiSlice = createApi({
  reducerPath: 'businessRegistrationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8051/api/business',
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
      // SEARCH BUSINESSES
      searchBusinesses: builder.query({
        query: ({ type, companyName, tin, page, size }) => {
          return {
            url: `/search?companyName=${companyName}&tin=${tin}&type=${type}&page=${page}&size=${size}`,
          };
        },
      }),

      // FETCH BUSINESSES
      fetchBusinesses: builder.query({
        query: ({ page, size, applicationStatus, serviceId }) => {
          let url = `?page=${page}&size=${size}`;
          if (applicationStatus) {
            url += `&applicationStatus=${applicationStatus}`;
          }
          if (serviceId) {
            url += `&serviceId=${serviceId}`;
          }
          return {
            url,
          };
        },
      }),

      // GET BUSINESS
      getBusiness: builder.query({
        query: ({ id }) => {
          return {
            url: `/${id}`,
          };
        },
      }),

      // CREATE BUSINESS
      createBusiness: builder.mutation({
        query: ({ isForeign, serviceId }) => {
          return {
            url: '/register',
            method: 'POST',
            body: {
              isForeign,
              serviceId,
            },
          };
        },
      }),

      // DELETE BUSINESS
      deleteBusiness: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // SEARCH BUSINESS NAME AVAILABILITY
      searchBusinessNameAvailability: builder.query({
        query: ({ companyName }) => {
          return {
            url: `/search-availability?companyName=${companyName}`,
          };
        },
      }),

      // CREATE OR UPDATE COMPANY DETAILS
      createCompanyDetails: builder.mutation({
        query: ({
          businessId,
          companyName,
          position,
          hasArticlesOfAssociation,
          companyType,
          companyCategory,
        }) => {
          return {
            url: `/details?businessId=${businessId}`,
            method: 'POST',
            body: {
              companyName,
              position,
              hasArticlesOfAssociation,
              companyType,
              companyCategory,
            },
          };
        },
      }),

      // CREATE OR UPDATE COMPANY ADDRESS
      createCompanyAddress: builder.mutation({
        query: ({
          businessId,
          villageId,
          address,
          email,
          phoneNumber,
          streetName,
        }) => {
          return {
            url: `/address?businessId=${businessId}`,
            method: 'POST',
            body: {
              villageId,
              address,
              email,
              phoneNumber,
              streetName
            },
          };
        },
      }),
    };
  },
});

export const {
  useLazySearchBusinessesQuery,
  useLazyFetchBusinessesQuery,
  useLazyGetBusinessQuery,
  useCreateBusinessMutation,
  useDeleteBusinessMutation,
  useLazySearchBusinessNameAvailabilityQuery,
  useCreateCompanyDetailsMutation,
  useCreateCompanyAddressMutation,
} = businessRegistrationApiSlice;

export default businessRegistrationApiSlice;
