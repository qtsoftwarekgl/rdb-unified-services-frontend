import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from '../../containers/UserLayout';
import { AppDispatch, RootState } from '../../states/store';
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from '../../states/features/enterpriseRegistrationSlice';
import ProgressNavigation from '../../components/business-registration/ProgressNavigation';
import { TabType } from '../../types/navigationTypes';
import Tab from '../../components/business-registration/Tab';
import { ErrorResponse, useLocation } from 'react-router-dom';
import EnterpriseDetails from './enterprise_details/EnterpriseDetails';
import BusinessActivity from './enterprise_details/BusinessActivities';
import OfficeAddress from './enterprise_details/OfficeAddress';
import Attachments from './Attachements';
import Preview from './Preview';
import queryString, { ParsedQuery } from 'query-string';
import { useLazyGetBusinessQuery } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import { setBusiness } from '@/states/features/businessSlice';
import Loader from '@/components/Loader';

const EnterpriseRegistration = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { business } = useSelector((state: RootState) => state.business);
  const {
    enterprise_registration_tabs,
    enterprise_registration_active_step,
    enterprise_registration_active_tab,
  } = useSelector((state: RootState) => state.enterpriseRegistration);
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

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 p-8">
        <ProgressNavigation
          tabs={enterprise_registration_tabs}
          setActiveTab={setEnterpriseActiveTab}
        />
        {businessIsFetching ? (
          <figure className="min-h-[40vh] flex items-center justify-center w-full">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <menu className="flex items-center w-full gap-5 p-8 rounded ">
            {enterprise_registration_tabs?.map(
              (tab: TabType, index: number) => {
                const isActiveTab = tab.active;
                const activeStepName =
                  enterprise_registration_active_step?.name;

                return (
                  <Tab
                    isOpen={isActiveTab}
                    steps={tab.steps}
                    key={`${String(index)}`}
                    setActiveStep={setEnterpriseActiveStep}
                    active_tab={enterprise_registration_active_tab}
                  >
                    {isActiveTab && (
                      <>
                        {activeStepName === 'company_details' && (
                          <EnterpriseDetails
                            businessId={queryParams?.businessId}
                            applicationStatus={business?.applicationStatus}
                          />
                        )}
                        {activeStepName === 'business_activity_vat' && (
                          <BusinessActivity
                            businessId={queryParams?.businessId}
                            applicationStatus={business?.applicationStatus}
                          />
                        )}
                        {activeStepName === 'office_address' && (
                          <OfficeAddress
                            businessId={queryParams?.businessId}
                            applicationStatus={business?.applicationStatus}
                          />
                        )}
                        {activeStepName === 'attachments' && (
                          <Attachments businessId={queryParams?.businessId} />
                        )}
                        {activeStepName === 'enterprise_preview_submission' && (
                          <Preview
                            businessId={queryParams?.businessId}
                            applicationStatus={business?.applicationStatus}
                          />
                        )}
                      </>
                    )}
                  </Tab>
                );
              }
            )}
          </menu>
        )}
      </main>
    </UserLayout>
  );
};

export default EnterpriseRegistration;
