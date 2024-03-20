import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import UserLayout from '../../containers/UserLayout';
import ProgressNavigation from './ProgressNavigation';
import { useLocation, useNavigate } from 'react-router-dom';
import Tab from '../../components/business-registration/Tab';
import {
  RegistrationTab,
  setBusinessActiveStep,
  setBusinessActiveTab,
} from '../../states/features/businessRegistrationSlice';
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
import AddReviewComments from './applications-review/AddReviewComments';
import ListReviewComments from './applications-review/ListReviewComments';
import { useEffect } from 'react';
import { setUserApplications } from '../../states/features/userApplicationSlice';

const BusinessRegistration = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    business_registration_tabs,
    business_active_step,
    business_active_tab,
  } = useSelector((state: RootState) => state.businessRegistration);

  // NAVIGATION
  const navigate = useNavigate();

  // CATCH PROGRESS ID
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get('entry_id');

  useEffect(() => {
    if (entry_id) {
      dispatch(
        setUserApplications({
          entry_id,
          status: 'in_progress',
          type: 'business_registration'
        })
      );
    } else {
      navigate('/business-registration/new');
    }
  }, [dispatch, entry_id, navigate]);

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 p-8 h-screen w-full">
        <ProgressNavigation
          tabs={business_registration_tabs}
          setActiveTab={setBusinessActiveTab}
        />
        <menu className="flex items-center w-full gap-5">
          {business_registration_tabs?.map(
            (tab: RegistrationTab, index: number) => {
              return (
                <Tab
                  isOpen={tab?.active}
                  steps={tab?.steps}
                  key={`${String(index)}-${entry_id}`}
                  setActiveStep={setBusinessActiveStep}
                  active_tab={business_active_tab}
                >
                  {/* COMPANY DETAILS */}
                  <CompanyDetails
                    entry_id={entry_id}
                    isOpen={business_active_step?.name === 'company_details'}
                  />
                  {/* COMPANY ADDRESS */}
                  <CompanyAddress
                    isOpen={business_active_step?.name === 'company_address'}
                  />
                  {/* BUSINESS ACTIVITY */}
                  <BusinessActivity
                    isOpen={
                      business_active_step?.name === 'business_activity_vat'
                    }
                  />

                  {/* BOARD OF DIRECTORS */}
                  <BoardDirectors
                    isOpen={business_active_step?.name === 'board_of_directors'}
                  />

                  {/* SENIOR MANAGEMENT */}
                  <SeniorManagement
                    isOpen={business_active_step?.name === 'senior_management'}
                  />

                  {/* EMPLOYMENT INFO */}
                  <EmploymentInfo
                    isOpen={business_active_step?.name === 'employment_info'}
                  />

                  {/* SHARE DETAILS */}
                  <ShareDetails
                    isOpen={business_active_step?.name === 'share_details'}
                  />

                  {/* SHAREHOLDERS */}
                  <ShareHolders
                    isOpen={business_active_step?.name === 'shareholders'}
                  />

                  {/* CAPITAL DETAILS */}
                  <CapitalDetails
                    isOpen={business_active_step?.name === 'capital_details'}
                  />

                  {/* BENEFICIAL OWNERS */}
                  <BeneficialOwners
                    isOpen={business_active_step?.name === 'beneficial_owners'}
                  />

                  {/* ATTACHMENTS */}
                  <CompanyAttachments
                    isOpen={business_active_step?.name === 'attachments'}
                  />

                  {/* PREVIEW AND SUBMISSINO */}
                  <PreviewSubmission
                    isOpen={business_active_step?.name === 'preview_submission'}
                  />
                </Tab>
              );
            }
          )}
        </menu>
        {/* <ReviewNavigation
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
        tabs={business_registration_tabs}
        activeStep={business_active_step}
      /> */}
        <AddReviewComments />
        <ListReviewComments />
      </main>
    </UserLayout>
  );
};

export default BusinessRegistration;
