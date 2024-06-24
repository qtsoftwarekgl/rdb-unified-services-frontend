import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import store from "store";

export const foreignCompanyRegistrationApiSlice = createApi({
  reducerPath: "foreignCompanyRegistrationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_LOCAL_APP_API_URL}/business`,
    prepareHeaders: (headers) => {
      const user = store.get("user");
      if (user) {
        headers.set("authorization", `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getForeignCompanyRegistration: builder.query({
      query: ({ id }) => {
        return {
          url: `/${id}`,
        };
      },
    }),
    createForeignCompanyRegistration: builder.mutation({
      query: ({ isForeign, serviceId }) => ({
        url: `/register`,
        method: "POST",
        body: { isForeign, serviceId },
      }),
    }),

    // DELETE COMPANY
    deleteForeignCompany: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
    }),

    // CREATE OR UPDATE COMPANY DETAILS
    createOrUpdateCompanyDetails: builder.mutation({
      query: ({
        businessId,
        companyName,
        companyType,
        companyCategory,
        position,
        hasArticlesOfAssociation,
      }) => {
        return {
          url: `/details?businessId=${businessId}`,
          method: "POST",
          body: {
            companyName,
            companyType,
            companyCategory,
            position,
            hasArticlesOfAssociation,
          },
        };
      },
    }),
    // CREATE OR UPDATE COMPANY ADDRESS
    createOrUpdateCompanyAddress: builder.mutation({
      query: ({
        businessId,
        countryOfIncorporation,
        streetName,
        city,
        zipCode,
        email,
        phoneNumber,
      }) => {
        return {
          url: `/address?businessId=${businessId}`,
          method: "POST",
          body: {
            countryOfIncorporation,
            streetName,
            city,
            zipCode,
            email,
            phoneNumber,
          },
        };
      },
    }),

    // CREATE OR UPDATE EXECUTIVE MANAGEMENT
    createManagementOrBoardMember: builder.mutation({
      query: ({
        route = "management",
        businessId,
        phoneNumber,
        position,
        firstName,
        middleName,
        lastName,
        fatherName,
        motherName,
        spouseName,
        maritalStatus,
        dateOfBirth,
        gender,
        nationality,
        personIdentType,
        personDocNo,
        persDocIssueDate,
        persDocExpiryDate,
        persDocIssuePlace,
        validFrom,
        validTo,
        isFromNida,
        streetNumber,
        email,
        fax,
        poBox,
      }) => ({
        url: `/${route}?businessId=${businessId}`,
        method: "POST",
        body: {
          phoneNumber,
          position,
          firstName,
          middleName,
          lastName,
          fatherName,
          motherName,
          spouseName,
          maritalStatus,
          dateOfBirth,
          gender,
          nationality,
          personIdentType,
          personDocNo,
          persDocIssueDate,
          persDocExpiryDate,
          persDocIssuePlace,
          validFrom,
          validTo,
          isFromNida,
          streetNumber,
          email,
          fax,
          poBox,
        },
      }),
    }),
    // GET MANAGEMENT OR BOARD MEMBERS
    fetchManagementOrBoardMembers: builder.query({
      query: ({ businessId, route = "management" }) => {
        return {
          url: `/${route}?businessId=${businessId}`,
        };
      },
    }),
  }),
});

export const {
  useGetForeignCompanyRegistrationQuery,
  useCreateForeignCompanyRegistrationMutation,
  useDeleteForeignCompanyMutation,
  useCreateOrUpdateCompanyDetailsMutation,
  useCreateManagementOrBoardMemberMutation,
  useLazyFetchManagementOrBoardMembersQuery,
  useCreateOrUpdateCompanyAddressMutation,
} = foreignCompanyRegistrationApiSlice;

export default foreignCompanyRegistrationApiSlice;
