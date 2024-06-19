import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import UserLayout from '../../../containers/UserLayout';
import ProgressNavigation from '../../../components/business-registration/ProgressNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
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

const BusinessRegistration = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    business_registration_tabs,
    business_active_step,
    business_active_tab,
  } = useSelector((state: RootState) => state.businessRegistration);
  const { business } = useSelector((state: RootState) => state.business);
  const { user } = useSelector((state: RootState) => state.user);
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // NAVIGATION
  const { search } = useLocation();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // NAVIGATION
  const navigate = useNavigate();

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
                  <CompanyDetails businessId={queryParams?.businessId} />
                )}
                {business_active_step?.name === 'company_address' && (
                  <CompanyAddress businessId={queryParams?.businessId} />
                )}
                {business_active_step?.name === 'business_activity_vat' && (
                  <BusinessActivities
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}

                {business_active_step?.name === 'executive_management' && (
                  <ExecutiveManagement
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}

                {business_active_step?.name === 'board_of_directors' && (
                  <BoardOfDirectors
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}

               {business_active_step?.name === 'employment_info' && (
                  <EmploymentInfo
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}

                {business_active_step?.name === 'share_details' && (
                  <ShareDetails
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}

                {business_active_step?.name === 'shareholders' && (
                  <ShareHolders
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}

               {business_active_step?.name === 'capital_details' && (
                  <CapitalDetails
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}

                {business_active_step?.name === 'attachments' && (
                  <CompanyAttachments
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}

                 {business_active_step?.name === 'preview_submission' && (
                  <PreviewSubmission
                    businessId={queryParams?.businessId}
                    status={'IN_PROGRESS'}
                  />
                )}
              </Tab>
            );
          })}
        </menu>
      </main>
    </UserLayout>
  );
};

export default BusinessRegistration;
