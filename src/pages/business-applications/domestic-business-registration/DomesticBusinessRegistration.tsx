import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import UserLayout from '../../../containers/UserLayout';
import ProgressNavigation from '../ProgressNavigation';
import { ErrorResponse, useLocation } from 'react-router-dom';
import NavigationTab from '../NavigationTab';
import CompanyDetails from './general-information/CompanyDetails';
import CompanyAddress from './general-information/CompanyAddress';
import BoardOfDirectors from './management/BoardOfDirectors';
import ExecutiveManagement from './management/ExecutiveManagement';
import EmploymentInfo from './management/EmploymentInfo';
import ShareDetails from './capital-information/ShareDetails';
import ShareHolders from './capital-information/ShareHolders';
import CapitalDetails from './capital-information/CapitalDetails';
import CompanyAttachments from './attachments/CompanyAttachments';
import PreviewSubmission from './preview-submission/BusinessPreviewSubmission';
import { useEffect, useState } from 'react';
import queryString, { ParsedQuery } from 'query-string';
import BusinessActivities from './general-information/BusinessActivities';
import {
  useCreateNavigationFlowMutation,
  useLazyFetchBusinessNavigationFlowsQuery,
  useLazyFetchNavigationFlowMassQuery,
  useLazyGetBusinessQuery,
} from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import { setBusiness } from '@/states/features/businessSlice';
import Loader from '@/components/Loader';
import Button from '@/components/inputs/Button';
import DeleteBusinessAttachment from '@/containers/business-registration/DeleteBusinessAttachment';
import BusinessPersonDetails from '@/containers/business-registration/BusinessPersonDetails';
import DeleteBusinessPerson from '@/containers/business-registration/DeleteBusinessPerson';
import {
  setBusinessNavigationFlowsList,
  setNavigationFlowMassList,
} from '@/states/features/navigationFlowSlice';
import {
  AbstractNavigationFlow,
  NavigationFlow,
} from '@/types/models/navigationFlow';
import DeleteFounder from "@/containers/business-registration/DeleteFounder";

const DomesticBusinessRegistration = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { business } = useSelector((state: RootState) => state.business);
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // NAVIGATION
  const { search } = useLocation();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusiness,
    {
      data: businessData,
      error: businessError,
      isError: businessIsError,
      isFetching: businessIsFetching,
      isSuccess: businessIsSuccess,
    },
  ] = useLazyGetBusinessQuery();

  // GET BUSINESS
  useEffect(() => {
    if (queryParams?.businessId) {
      getBusiness({ id: queryParams?.businessId });
    }
  }, [queryParams, getBusiness]);

  // HANDLE GET BUSINESS RESPONSE
  useEffect(() => {
    if (businessIsError) {
      if ((businessError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred. Please try again later.');
      } else {
        toast.error((businessError as ErrorResponse)?.data?.message);
      }
    } else if (businessIsSuccess && businessData) {
      dispatch(setBusiness(businessData?.data));
    }
  }, [
    businessData,
    businessError,
    businessIsError,
    businessIsSuccess,
    dispatch,
  ]);

  // INITIALIZE FETCH NAVIGATION FLOW MASS
  const [
    fetchNavigationFlowMass,
    {
      data: navigationFlowMassData,
      error: navigationFlowMassError,
      isError: navigationFlowMassIsError,
      isFetching: navigationFlowMassIsFetching,
      isSuccess: navigationFlowMassIsSuccess,
    },
  ] = useLazyFetchNavigationFlowMassQuery();

  // FETCH NAVIGATION FLOW MASS
  useEffect(() => {
    fetchNavigationFlowMass({ businessType: 'domestic' });
  }, [fetchNavigationFlowMass]);

  // HANDLE FETCH NAVIGATION FLOW MASS RESPONSE
  useEffect(() => {
    if (navigationFlowMassIsError) {
      const errorResponse =
        (navigationFlowMassError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching navigation flow mass. Refresh and try again';
      toast.error(errorResponse);
    } else if (navigationFlowMassIsSuccess) {
      dispatch(setNavigationFlowMassList(navigationFlowMassData?.data));
    }
  }, [
    dispatch,
    navigationFlowMassData?.data,
    navigationFlowMassError,
    navigationFlowMassIsError,
    navigationFlowMassIsSuccess,
  ]);

  // FETCH BUSINESS NAVIGATION FLOWS
  const [
    fetchBusinessNavigationFlows,
    {
      data: businessNavigationFlowsData,
      error: businessNavigationFlowsError,
      isError: businessNavigationFlowsIsError,
      isFetching: businessNavigationFlowsIsFetching,
      isSuccess: businessNavigationFlowsIsSuccess,
    },
  ] = useLazyFetchBusinessNavigationFlowsQuery();

  // FETCH BUSINESS NAVIGATION FLOWS
  useEffect(() => {
    if (queryParams?.businessId) {
      fetchBusinessNavigationFlows({ businessId: queryParams?.businessId });
    }
  }, [fetchBusinessNavigationFlows, queryParams]);

  // HANDLE FETCH BUSINESS NAVIGATION FLOWS RESPONSE
  useEffect(() => {
    if (businessNavigationFlowsIsError) {
      const errorResponse =
        (businessNavigationFlowsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching business navigation flows. Refresh and try again';
      toast.error(errorResponse);
    } else if (businessNavigationFlowsIsSuccess) {
      dispatch(
        setBusinessNavigationFlowsList(businessNavigationFlowsData?.data)
      );
    }
  }, [
    businessNavigationFlowsData?.data,
    businessNavigationFlowsError,
    businessNavigationFlowsIsError,
    businessNavigationFlowsIsSuccess,
    dispatch,
  ]);

  // INITIALIZE CREATE BUSINESS NAVIGATION FLOW
  const [
    createNavigationFlow,
    {
      data: createNavigationFlowData,
      error: createNavigationFlowError,
      isError: createNavigationFlowIsError,
      isSuccess: createNavigationFlowIsSuccess,
      isLoading: createNavigationFlowIsLoading,
    },
  ] = useCreateNavigationFlowMutation();

  // CREATE BUSINESS NAVIGATION FLOW
  useEffect(() => {
    if (
      businessNavigationFlowsIsSuccess &&
      businessNavigationFlowsData?.data?.length <= 0
    ) {
      createNavigationFlow({
        isActive: true,
        businessId: queryParams?.businessId,
        massId: Object.values(navigationFlowMassList ?? {})
          ?.flat()
          ?.find(
            (flow: AbstractNavigationFlow) =>
              flow?.stepName === 'Company Details'
          )?.id,
      });
    }
  }, [
    businessNavigationFlowsData?.data?.length,
    businessNavigationFlowsIsSuccess,
    createNavigationFlow,
    navigationFlowMassList,
    queryParams?.businessId,
  ]);

  // HANDLE CREATE BUSINESS NAVIGATION FLOW RESPONSE
  useEffect(() => {
    if (createNavigationFlowIsError) {
      const errorResponse =
        (createNavigationFlowError as ErrorResponse)?.data?.message ||
        'An error occurred while creating business navigation flow. Refresh and try again';
      toast.error(errorResponse);
    } else if (createNavigationFlowIsSuccess) {
      dispatch(setBusinessNavigationFlowsList(createNavigationFlowData?.data));
    }
  }, [
    createNavigationFlowData?.data,
    createNavigationFlowError,
    createNavigationFlowIsError,
    createNavigationFlowIsSuccess,
    dispatch,
  ]);

  return (
    <UserLayout>
      <main className="flex flex-col w-full h-screen gap-6 p-8">
        <ProgressNavigation
          navigationTabs={Object.entries(navigationFlowMassList ?? {}).map(
            ([key, value]) => {
              const navigationExists = businessNavigationFlowsList?.find(
                (businessNavigationFlow: NavigationFlow) =>
                  businessNavigationFlow?.navigationFlowMass?.tabName === key &&
                  businessNavigationFlow?.active
              );
              return {
                navigationSteps: value,
                tabName: key,
                active: !!navigationExists?.active,
                completed: !!navigationExists?.completed,
              };
            }
          )}
        />
        {businessIsFetching ||
        navigationFlowMassIsFetching ||
        businessNavigationFlowsIsFetching ||
        createNavigationFlowIsLoading ? (
          <figure className="w-full flex flex-col gap-2 min-h-[40vh] items-center justify-center">
            <Loader className="text-primary" size={'medium'} />
          </figure>
        ) : businessIsSuccess && navigationFlowMassIsSuccess ? (
          <menu className="flex items-center w-full gap-5">
            {Object.values(navigationFlowMassList ?? {})
              ?.flat()
              .map(
                (
                  navigationFlow: AbstractNavigationFlow,
                  index: number,
                  arr: AbstractNavigationFlow[]
                ) => {
                  const navigationExists =
                    businessNavigationFlowsList?.find(
                      (navigationFlow) => navigationFlow?.active
                    )?.navigationFlowMass?.stepName ===
                    navigationFlow?.stepName;
                  if (!navigationExists) {
                    return null;
                  }
                  return (
                    <NavigationTab
                      navigationSteps={arr}
                      key={index}
                      activeNavigation={businessNavigationFlowsList?.find(
                        (navigationFlow) => navigationFlow?.active
                      )}
                    >
                      {navigationFlow?.stepName === 'Company Details' && (
                        <CompanyDetails
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}
                      {navigationFlow?.stepName === 'Company Address' && (
                        <CompanyAddress
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}
                      {navigationFlow?.stepName ===
                        'Business Activity & VAT' && (
                        <BusinessActivities
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}

                      {navigationFlow?.stepName === 'Executive Management' && (
                        <ExecutiveManagement
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}

                      {navigationFlow?.stepName === 'Board of Directors' && (
                        <BoardOfDirectors
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}

                      {navigationFlow?.stepName === 'Employment Info' && (
                        <EmploymentInfo
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}

                      {navigationFlow?.stepName === 'Share Details' && (
                        <ShareDetails
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}

                      {navigationFlow?.stepName === 'Shareholders' && (
                        <ShareHolders
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}

                      {navigationFlow?.stepName === 'Capital Details' && (
                        <CapitalDetails
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}

                      {navigationFlow?.stepName === 'Attachments' && (
                        <CompanyAttachments
                          businessId={queryParams?.businessId}
                          status={business?.applicationStatus}
                        />
                      )}

                      {navigationFlow?.stepName === 'Preview & Submission' && (
                        <PreviewSubmission
                          businessId={queryParams?.businessId}
                          applicationStatus={business?.applicationStatus}
                        />
                      )}
                    </NavigationTab>
                  );
                }
              )}
          </menu>
        ) : (
          <article className="w-full flex flex-col gap-2 min-h-[40vh] items-center justify-center">
            <p>Business not found</p>
            <Button primary route="/services" value={'Return to services'} />
          </article>
        )}
      </main>
      <DeleteBusinessAttachment />
      <BusinessPersonDetails />
      <DeleteBusinessPerson />
      <DeleteFounder />
    </UserLayout>
  );
};

export default DomesticBusinessRegistration;
