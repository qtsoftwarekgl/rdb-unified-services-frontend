import { createApi } from "@reduxjs/toolkit/query/react";
import { businessBaseQueryWithReauth } from "./rootApiSlice";

export const businessRegApiSlice = createApi({
  reducerPath: "businessRegistrationApi",
  baseQuery: businessBaseQueryWithReauth,
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
          let url = `/?page=${page}&size=${size}`;
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

      // GET BUSINESS DETAILS
      getBusinessDetails: builder.query({
        query: ({ id }) => {
          return {
            url: `/details?businessId=${id}`,
          };
        },
      }),

      // GET BUSINESS ADDRESS
      getBusinessAddress: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/address?businessId=${businessId}`,
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
      createBusinessDetails: builder.mutation({
        query: ({
          businessId,
          companyName,
          position,
          hasArticlesOfAssociation,
          companyType,
          companyCategory,
          enterpriseName,
          enterpriseBusinessName,
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
              enterpriseName,
              enterpriseBusinessName,
            },
          };
        },
      }),

      // FETCH COMPANY DETAILS
      fetchBusinessDetails: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/details?businessId=${businessId}`,
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
      fetchBusinessPeople: builder.query({
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

      // FETCH BUSINESS ADDRESS
      fetchBusinessAddress: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/address?businessId=${businessId}`,
          };
        },
      }),

      // FETCH BUSINESS EMPLOYMENT INFO
      fetchBusinessEmploymentInfo: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/employment-info?businessId=${businessId}`,
          };
        },
      }),

      // UPDATE BUSINESS
      updateBusiness: builder.mutation({
        query: ({ businessId, applicationStatus }) => {
          return {
            url: `/?businessId=${businessId}`,
            method: "PATCH",
            body: {
              applicationStatus,
            },
          };
        },
      }),

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
          return { url: `/person/${id}`, method: "DELETE" };
        },
      }),

      // DELETE FOUNDER
      deleteShareholder: builder.mutation({
        query: ({ id }) => {
          return { url: `/founder/${id}`, method: "DELETE" };
        },
      }),

      // FETCH NAVIGATION FLOW MASS
      fetchNavigationFlowMass: builder.query({
        query: ({ businessType }) => {
          return {
            url: `/navigation-flow/mass?businessType=${businessType}`,
          };
        },
      }),

      // FETCH BUSINESS NAVIGATION FLOWS
      fetchBusinessNavigationFlows: builder.query({
        query: ({ businessId }) => {
          return {
            url: `/navigation-flow?businessId=${businessId}`,
          };
        },
      }),

      // CREATE NAVIGATION FLOW
      createNavigationFlow: builder.mutation({
        query: ({ businessId, massId, isActive }) => {
          return {
            url: `/navigation-flow`,
            method: 'POST',
            body: {
              businessId,
              massId,
              isActive,
            },
          };
        },
      }),

      // COMPLETE NAVIGATION FLOW
      completeNavigationFlow: builder.mutation({
        query: ({ isCompleted = true, navigationFlowId }) => {
          return {
            url: `/navigation-flow/complete`,
            method: 'POST',
            body: {
              isCompleted,
              navigationFlowId,
            },
          };
        },
      }),

      // DELETE BUSINESS FOUNDER
      deleteBusinessFounder: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/founder/${id}`,
            method: 'DELETE',
          };
        },
      }),

      // UPLOAD AMENDMENT ATTACHMENT
      uploadAmendmentAttachment: builder.mutation({
        query: ({ formData }) => {
          return {
            url: `/amendment/attachment`,
            method: 'POST',
            body: formData,
            formData: true,
          };
        },
      }),

      // DECLARE BUSINESS DORMANCY
      declareBusinessDormancy: builder.mutation({
        query: ({
          businessId,
          dormantReason,
          dormantStartDate,
          dormantDeclarationDate,
        }) => {
          return {
            url: `/amendment/dormant?businessId=${businessId}`,
            method: 'POST',
            body: {
              dormantReason,
              dormantStartDate,
              dormantDeclarationDate,
            },
          };
        },
      }),

      // CLOSE COMPANY
      closeCompany: builder.mutation({
        query: ({
          businessId,
          dissolutionReason,
          dissolutionDate,
          resolutionDate,
          resolutionReason,
        }) => {
          return {
            url: `/amendment/dissolution?businessId=${businessId}`,
            method: 'POST',
            body: {
              dissolutionReason,
              dissolutionDate,
              resolutionDate,
              resolutionReason,
            },
          };
        },
      }),

      // CREATE BUSINESS BRANCH
      createBusinessBranch: builder.mutation({
        query: ({
          businessId,
          branchName,
          workingHoursFrom,
          workingHoursTo,
          branchAddress,
        }) => {
          return {
            url: `/amendment/new-branch?businessId=${businessId}`,
            method: 'POST',
            body: {
              branchName,
              workingHoursFrom,
              workingHoursTo,
              branchAddress,
            },
          };
        },
      }),

      // REQUEST CESSATION TO DORMANCY
      cessationToDormancy: builder.mutation({
        query: ({ businessId, resolutionReason, resolutionStartDate, resolutionEndDate }) => {
          return {
            url: `/amendment/cessation?businessId=${businessId}`,
            method: 'POST',
            body: {
              resolutionReason,
              resolutionStartDate,
              resolutionEndDate,
            }
          };
        },
      }),

      // TRANSFER BUSINESS REGISTRATION
      transferBusinessRegistration: builder.mutation({
        query: ({ businessId, transferDate, transferReason }) => {
          return {
            url: `/amendment/transfer-registration?businessId=${businessId}`,
            method: 'POST',
            body: {
              transferDate,
              transferReason,
            },
          };
        },
      }),

      // RESTORE BUSINESS
      restoreBusiness: builder.mutation({
        query: ({ businessId }) => {
          return {
            url: `/amendment/restore?businessId=${businessId}`,
            method: 'POST',
          };
        },
      }),

      // FETCH BACK OFFICE BUSINESSES
      fetchBackOfficeBusinesses: builder.query({
        query: ({ page, size, applicationStatus, serviceId }) => {
          let url = `/back-office/?page=${page}&size=${size}`;
          if (applicationStatus) {
            url += `&applicationStatus=${applicationStatus}`;
          }
          if (serviceId) {
            url += `&serviceId=${serviceId}`;
          }
          return {
            url
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
  useLazyGetBusinessAddressQuery,
  useCreateBusinessMutation,
  useDeleteBusinessMutation,
  useLazySearchBusinessNameAvailabilityQuery,
  useCreateBusinessDetailsMutation,
  useCreateCompanyAddressMutation,
  useCreateBusinessActivitiesMutation,
  useLazyFetchBusinessActivitiesQuery,
  useCreateManagementOrBoardPersonMutation,
  useLazyFetchBusinessPeopleQuery,
  useCreateEmploymentInfoMutation,
  useLazyGetEmploymentInfoQuery,
  useCreateShareDetailsMutation,
  useCreateShareholderMutation,
  useLazyFetchShareholdersQuery,
  useLazyFetchShareDetailsQuery,
  useAssignSharesMutation,
  useLazyFetchBusinessDetailsQuery,
  useLazyFetchBusinessAddressQuery,
  useLazyFetchBusinessEmploymentInfoQuery,
  useUpdateBusinessMutation,
  useLazyGetBusinessDetailsQuery,
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
  useDeleteShareholderMutation,
  useLazyFetchNavigationFlowMassQuery,
  useLazyFetchBusinessNavigationFlowsQuery,
  useCreateNavigationFlowMutation,
  useCompleteNavigationFlowMutation,
  useDeleteBusinessFounderMutation,
  useUploadAmendmentAttachmentMutation,
  useDeclareBusinessDormancyMutation,
  useCloseCompanyMutation,
  useCreateBusinessBranchMutation,
  useCessationToDormancyMutation,
  useTransferBusinessRegistrationMutation,
  useRestoreBusinessMutation,
  useLazyFetchBackOfficeBusinessesQuery,
} = businessRegApiSlice;

export default businessRegApiSlice;
