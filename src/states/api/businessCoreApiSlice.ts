import { businessRegLocalApi } from "@/constants/environments";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import store from "store";

export const businessCoreApiSlice = createApi({
  reducerPath: "businessCoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: businessRegLocalApi,
    prepareHeaders: (headers) => {
      const user = store.get("user");
      if (user?.token) {
        headers.set("authorization", `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // FETCH SERVICES
    fetchServices: builder.query({
      query: ({ category }) => {
        return {
          url: `/services?${category ? `category=${category}` : ""}`,
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

    // SEARCH VILLAGE
    searchVillage: builder.query({
      query: ({
        villageName,
        cellName,
        sectorName,
        districtName,
        provinceName,
      }) => {
        return {
          url: `/location/villages/search?villageName=${villageName}&cellName=${cellName}&sectorName=${sectorName}&districtName=${districtName}&provinceName=${provinceName}`,
        };
      },
    }),

    // FETCH BUSINESS ACTIVITY SECTORS
    fetchBusinessActivitiesSectors: builder.query({
      query: () => {
        return {
          url: `/business-activity/sectors`,
        };
      },
    }),

    // FETCH BUSINESS LINES
    fetchBusinessLines: builder.query({
      query: ({ sectorCode }) => {
        return {
          url: `/business-activity/business-lines?sectorCode=${sectorCode}`,
        };
      },
    }),

    // UPLOAD PERSON ATTACHMENT
    uploadPersonAttachment: builder.mutation({
      query: ({ formData }) => {
        return {
          url: `/attachment/person-upload`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),

    // UPLOAD BUSINESS ATTACHMENT
    uploadBusinessAttachment: builder.mutation({
      query: ({ formData }) => {
        return {
          url: `/attachment/business-upload`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),

    // FETCH BUSINESS ATTACHMENTS
    fetchBusinessAttachments: builder.query({
      query: ({ businessId }) => {
        return {
          url: `/attachment/business?businessId=${businessId}`,
        };
      },
    }),

    // DELETE BUSINESS ATTACHMENT
    deleteBusinessAttachment: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/attachment/business/${id}`,
          method: "DELETE",
        };
      },
    }),

    // GET PERSON DETAILS BY ID
    getBusinessPersonDetails: builder.query({
      query: ({ id }) => `/person/${id}`,
    }),

    // GET PERSON ATTACHMENTS
    fetchPersonAttachments: builder.query({
      query: ({ personId }) => `/attachment/person?personId=${personId}`,
    }),

    // DELETE BUSINESS PERSON
    deleteBusinessPerson: builder.mutation({
      query: ({ id }) => {
        return { url: `/business/management/${id}`, method: "DELETE" };
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
  useLazyFetchBusinessActivitiesSectorsQuery,
  useLazyFetchBusinessLinesQuery,
  useLazyFetchBusinessAttachmentsQuery,
  useUploadPersonAttachmentMutation,
  useUploadBusinessAttachmentMutation,
  useLazySearchVillageQuery,
  useDeleteBusinessAttachmentMutation,
  useLazyGetBusinessPersonDetailsQuery,
  useLazyFetchPersonAttachmentsQuery,
  useDeleteBusinessPersonMutation,
} = businessCoreApiSlice;

export default businessCoreApiSlice;
