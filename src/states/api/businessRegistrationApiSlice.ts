import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import store from "store";

export const businessRegistrationApiSlice = createApi({
  reducerPath: "businessRegistrationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8051/api/v1/business",
    prepareHeaders: (headers) => {
      const user = store.get("user");
      if (user) {
        headers.set("authorization", `Bearer ${user.token}`);
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

      //GET BUSINESS DETAILS
      getBusinessDetails: builder.query({
        query: ({ id }) => {
          return {
            url: `/details?businessId=${id}`,
          };
        },
      }),

      // GET BUSINESS ADDRESS
      getBusinessAddress: builder.query({
        query: ({ id }) => {
          return {
            url: `/address?businessId=${id}`,
          };
        },
      }),

      // CREATE BUSINESS
      createBusiness: builder.mutation({
        query: ({ isForeign, serviceId }) => {
          return {
            url: "/register",
            method: "POST",
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
            method: "DELETE",
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
            method: "POST",
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
            method: "POST",
            body: {
              villageId,
              address,
              email,
              phoneNumber,
              streetName,
            },
          };
        },
      }),

      // CREATE BUSINESS ACTIVITIES
      createBusinessActivities: builder.mutation({
        query: ({
          businessId,
          isVATRegistered,
          mainBusinessActivity,
          businessLines,
        }) => {
          return {
            url: `/business-activities?businessId=${businessId}`,
            method: "POST",
            body: {
              isVATRegistered,
              mainBusinessActivity,
              businessLines,
            },
          };
        },
      }),

      // FETCH BUSINESS ACTIVITIES
      fetchBusinessActivities: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/business-activities?businessId=${businessId}`,
          };
        },
      }),

      // CREATE MANAGEMENT OR BOARD PEOPLE
      createManagementOrBoardPerson: builder.mutation({
        query: ({
          route = "management",
          businessId,
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
          phoneNumber,
          email,
          fax,
          poBox,
        }) => {
          return {
            url: `/${route}?businessId=${businessId}`,
            method: "POST",
            body: {
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
              phoneNumber,
              email,
              fax,
              poBox,
            },
          };
        },
      }),

      // FETCH MANAGEMENT OR BOARD PEOPLE
      fetchManagementOrBoardPeople: builder.query({
        query: ({ businessId, route = "management" }) => {
          return {
            url: `/${route}?businessId=${businessId}`,
          };
        },
      }),

      // CREATE EMPLOYMENT INFORMATION
      createEmploymentInfo: builder.mutation({
        query: ({
          businessId,
          workingStartTime,
          workingEndTime,
          numberOfEmployees,
          hiringDate,
          employmentDeclarationDate,
          financialYearStartDate,
          financialYearEndDate = financialYearStartDate,
        }) => {
          return {
            url: `/employment-info?businessId=${businessId}`,
            method: "POST",
            body: {
              workingStartTime,
              workingEndTime,
              numberOfEmployees,
              hiringDate,
              employmentDeclarationDate,
              financialYearStartDate,
              financialYearEndDate,
            },
          };
        },
      }),

      // GET EMPLOYMENT INFO
      getEmploymentInfo: builder.query({
        query: ({ id }) => {
          return {
            url: `/employment-info?businessId=${id}`,
          };
        },
      }),

      // CREATE SHARE DETAILS
      createShareDetails: builder.mutation({
        query: ({ businessId, shareDetails }) => {
          return {
            url: `/share-details?businessId=${businessId}`,
            method: "POST",
            body: shareDetails,
          };
        },
      }),

      // CREATE SHAREHOLDER
      createShareholder: builder.mutation({
        query: ({
          shareHolderType,
          description,
          companyName,
          companyCode,
          countryOfIncorporation,
          incorporationDate,
          isBasedInRwanda,
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
          phoneNumber,
          email,
          fax,
          poBox,
          businessId,
        }) => {
          return {
            url: `/founder-details?businessId=${businessId}`,
            method: "POST",
            body: {
              shareHolderType,
              description,
              companyName,
              companyCode,
              countryOfIncorporation,
              incorporationDate,
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
              phoneNumber,
              email,
              fax,
              poBox,
              isBasedInRwanda,
            },
          };
        },
      }),

      // FETCH SHAREHOLDERS
      fetchShareholders: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/founders?businessId=${businessId}`,
          };
        },
      }),

      // FETCH SHARE DETAILS
      fetchShareDetails: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/share-details?businessId=${businessId}`,
          };
        },
      }),

      // ASSIGN SHARES
      assignShares: builder.mutation({
        query: ({ founderId, shareDetails }) => {
          return {
            url: `/assign-share?founderId=${founderId}`,
            method: "POST",
            body: shareDetails,
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
  useLazyGetBusinessDetailsQuery,
  useLazyGetBusinessAddressQuery,
  useCreateBusinessMutation,
  useDeleteBusinessMutation,
  useLazySearchBusinessNameAvailabilityQuery,
  useCreateCompanyDetailsMutation,
  useCreateCompanyAddressMutation,
  useCreateBusinessActivitiesMutation,
  useLazyFetchBusinessActivitiesQuery,
  useCreateManagementOrBoardPersonMutation,
  useLazyFetchManagementOrBoardPeopleQuery,
  useCreateEmploymentInfoMutation,
  useLazyGetEmploymentInfoQuery,
  useCreateShareDetailsMutation,
  useCreateShareholderMutation,
  useLazyFetchShareholdersQuery,
  useLazyFetchShareDetailsQuery,
  useAssignSharesMutation,
} = businessRegistrationApiSlice;

export default businessRegistrationApiSlice;
