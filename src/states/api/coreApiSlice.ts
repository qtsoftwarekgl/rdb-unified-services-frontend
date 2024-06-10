import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store';

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

    // FETCH PROVINCES
    fetchProvinces: builder.query({
      query: () => {
        return {
          url: `/location/provinces`,
        };
      },
    }),

    // FETCH DISTRICTS
    fetchDistricts: builder.query({
      query: ({ provinceId }) => {
        return {
          url: `/location/districts?provinceId=${provinceId}`,
        };
      },
    }),

    // FETCH SECTORS
    fetchSectors: builder.query({
      query: ({ districtId }) => {
        return {
          url: `/location/sectors?districtId=${districtId}`,
        };
      },
    }),

    // FETCH CELLS
    fetchCells: builder.query({
      query: ({ sectorId }) => {
        return {
          url: `/location/cells?sectorId=${sectorId}`,
        };
      },
    }),

    // FETCH VILLAGES
    fetchVillages: builder.query({
      query: ({ cellId }) => {
        return {
          url: `/location/villages?cellId=${cellId}`,
        };
      },
    }),
  }),
});

export const {
  useLazyFetchServicesQuery,
  useLazyGetServiceQuery,
  useLazyFetchProvincesQuery,
  useLazyFetchDistrictsQuery,
  useLazyFetchSectorsQuery,
  useLazyFetchCellsQuery,
  useLazyFetchVillagesQuery,
} = coreApiSlice;

export default coreApiSlice;
