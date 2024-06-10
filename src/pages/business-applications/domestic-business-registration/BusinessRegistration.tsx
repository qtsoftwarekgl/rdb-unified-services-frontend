import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import UserLayout from '../../../containers/UserLayout';
import ProgressNavigation from '../../../components/business-registration/ProgressNavigation';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import Tab from '../../../components/business-registration/Tab';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from '../../../states/features/businessRegistrationSlice';
import CompanyDetails from './general-information/CompanyDetails';
import CompanyAddress from './general-information/CompanyAddress';
import BusinessActivity from './general-information/BusinessActivity';
import BoardDirectors from './management/BoardDirectors';
import SeniorManagement from './management/SeniorManagement';
import EmploymentInfo from './management/EmploymentInfo';
import ShareDetails from './capital-information/ShareDetails';
import ShareHolders from './capital-information/ShareHolders';
import CapitalDetails from './capital-information/CapitalDetails';
import BeneficialOwners from './beneficial-owners/BeneficialOwners';
import CompanyAttachments from './attachments/CompanyAttachments';
import PreviewSubmission from './preview-submission/BusinessPreviewSubmission';
import { useEffect, useState } from 'react';
import { TabType } from '../../../types/navigationTypes';
import {
  setApplicationReviewStepName,
  setApplicationReviewTabName,
} from '@/states/features/applicationReviewSlice';
import queryString, { ParsedQuery } from 'query-string';

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
                  <CompanyDetails
                    businessId={queryParams?.businessId}
                  />
                )}
                {/* {business_active_step?.name === 'company_address' && (
                  <CompanyAddress
                    isOpen={business_active_step?.name === 'company_address'}
                    company_address={businessApplication?.company_address}
                    businessId={queryParams?.businessId}
                    status={status}
                  />
                )}
                {business_active_step?.name === 'business_activity_vat' && (
                  <BusinessActivity
                    isOpen={
                      business_active_step?.name === 'business_activity_vat'
                    }
                    company_activities={businessApplication?.company_activities}
                    businessId={queryParams?.businessId}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'board_of_directors' && (
                  <BoardDirectors
                    isOpen={business_active_step?.name === 'board_of_directors'}
                    board_of_directors={businessApplication?.board_of_directors}
                    businessId={queryParams?.businessId}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'senior_management' && (
                  <SeniorManagement
                    isOpen={business_active_step?.name === 'senior_management'}
                    senior_management={businessApplication?.senior_management}
                    businessId={queryParams?.businessId}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'employment_info' && (
                  <EmploymentInfo
                    isOpen={business_active_step?.name === 'employment_info'}
                    employment_info={businessApplication?.employment_info}
                    businessId={queryParams?.businessId}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'share_details' && (
                  <ShareDetails
                    isOpen={business_active_step?.name === 'share_details'}
                    share_details={businessApplication?.share_details}
                    businessId={queryParams?.businessId}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'shareholders' && (
                  <ShareHolders
                    isOpen={business_active_step?.name === 'shareholders'}
                    shareholders={businessApplication?.shareholders}
                    businessId={queryParams?.businessId}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'capital_details' && (
                  <CapitalDetails
                    isOpen={business_active_step?.name === 'capital_details'}
                    capital_details={businessApplication?.capital_details}
                    businessId={queryParams?.businessId}
                    share_details={businessApplication?.share_details}
                    shareholders={businessApplication?.shareholders}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'beneficial_owners' && (
                  <BeneficialOwners
                    isOpen={business_active_step?.name === 'beneficial_owners'}
                    beneficial_owners={businessApplication?.beneficial_owners}
                    businessId={queryParams?.businessId}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'attachments' && (
                  <CompanyAttachments
                    isOpen={business_active_step?.name === 'attachments'}
                    company_attachments={
                      businessApplication?.company_attachments
                    }
                    businessId={queryParams?.businessId}
                    company_details={businessApplication?.company_details}
                    status={status}
                  />
                )}

                {business_active_step?.name === 'preview_submission' && (
                  <PreviewSubmission
                    isOpen={business_active_step?.name === 'preview_submission'}
                    business_application={businessApplication}
                    status={status}
                  />
                )} */}
              </Tab>
            );
          })}
        </menu>
      </main>
    </UserLayout>
  );
};

export default BusinessRegistration;
