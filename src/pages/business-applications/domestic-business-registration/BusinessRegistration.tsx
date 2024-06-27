import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import UserLayout from '../../../containers/UserLayout';
import ProgressNavigation from '../../../components/business-registration/ProgressNavigation';
import { ErrorResponse, useLocation } from 'react-router-dom';
import Tab from '../../../components/business-registration/Tab';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from '../../../states/features/businessRegistrationSlice';
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
import { TabType } from '../../../types/navigationTypes';
import {
  setApplicationReviewStepName,
  setApplicationReviewTabName,
} from '@/states/features/applicationReviewSlice';
import queryString, { ParsedQuery } from 'query-string';
import BusinessActivities from './general-information/BusinessActivities';
import { useLazyGetBusinessQuery } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import { setBusiness } from '@/states/features/businessSlice';
import Loader from '@/components/Loader';
import Button from '@/components/inputs/Button';

const BusinessRegistration = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { business } = useSelector((state: RootState) => state.business);
  const {
    business_registration_tabs,
    business_active_step,
    business_active_tab,
  } = useSelector((state: RootState) => state.businessRegistration);
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
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

  // UPDATE APPLICATION REVIEW STEP AND TAB
  useEffect(() => {
    dispatch(setApplicationReviewStepName(business_active_step?.name));
    dispatch(setApplicationReviewTabName(business_active_tab?.name));
  }, [dispatch, business_active_step, business_active_tab]);

  return (
    <UserLayout>
      <main className="flex flex-col w-full h-screen gap-6 p-8">
        <ProgressNavigation
          tabs={business_registration_tabs}
          setActiveTab={setBusinessActiveTab}
        />
        {businessIsFetching ? (
          <figure className="w-full flex flex-col gap-2 min-h-[40vh] items-center justify-center">
            <Loader />
          </figure>
        ) : businessIsSuccess ? (
          <menu className="flex items-center w-full gap-5">
            {business_registration_tabs?.map((tab: TabType, index: number) => {
              return (
                <Tab
                  isOpen={tab?.active}
                  steps={tab?.steps}
                  key={`${String(index)}-${queryParams?.businessId}`}
                  setActiveStep={setBusinessActiveStep}
                  active_tab={business_active_tab}
                >
                  {business_active_step?.name === 'company_details' && (
                    <CompanyDetails
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}
                  {business_active_step?.name === 'company_address' && (
                    <CompanyAddress
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}
                  {business_active_step?.name === 'business_activity_vat' && (
                    <BusinessActivities
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}

                  {business_active_step?.name === 'executive_management' && (
                    <ExecutiveManagement
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}

                  {business_active_step?.name === 'board_of_directors' && (
                    <BoardOfDirectors
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}

                  {business_active_step?.name === 'employment_info' && (
                    <EmploymentInfo
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}

                  {business_active_step?.name === 'share_details' && (
                    <ShareDetails
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}

                  {business_active_step?.name === 'shareholders' && (
                    <ShareHolders
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}

                  {business_active_step?.name === 'capital_details' && (
                    <CapitalDetails
                      businessId={queryParams?.businessId}
                      status={business?.applicationStatus}
                    />
                  )}

                  {business_active_step?.name === 'attachments' && (
                    <CompanyAttachments
                      businessId={queryParams?.businessId}
                      status={business?.applicationStatus}
                    />
                  )}

                  {business_active_step?.name === 'preview_submission' && (
                    <PreviewSubmission
                      businessId={queryParams?.businessId}
                      applicationStatus={business?.applicationStatus}
                    />
                  )}
                </Tab>
              );
            })}
          </menu>
        ) : (
          <article className="w-full flex flex-col gap-2 min-h-[40vh] items-center justify-center">
            <p>Business not found</p>
            <Button route="/services" value={'Return to services'} />
          </article>
        )}
      </main>
    </UserLayout>
  );
};

export default BusinessRegistration;
