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
import ReviewNavigation from './ReviewNavigation';

const BusinessRegistration = () => {

    // CATCH PROGRESS ID
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const entry_id = queryParams.get('entry_id');

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    business_registration_tabs,
    business_active_step,
    business_active_tab,
  } = useSelector((state: RootState) => state.businessRegistration);
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const businessApplication = user_applications?.find((app) => app.entry_id === entry_id);

  // NAVIGATION
  const navigate = useNavigate();

  useEffect(() => {
    if (entry_id) {
      dispatch(
        setUserApplications({
          entry_id,
          status: 'in_progress',
          path: `/business-registration/?entry_id=${entry_id}`,
          type: 'business_registration',
        })
      );
    } else {
      navigate('/business-registration/new');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  {business_active_step?.name === 'company_details' && (
                    <CompanyDetails
                      entry_id={entry_id}
                      isOpen={business_active_step?.name === 'company_details'}
                      company_details={businessApplication?.company_details}
                    />
                  )}
                  {/* COMPANY ADDRESS */}
                  {business_active_step?.name === 'company_address' && (
                    <CompanyAddress
                      isOpen={business_active_step?.name === 'company_address'}
                      company_address={businessApplication?.company_address}
                      entry_id={entry_id}
                    />
                  )}
                  {/* BUSINESS ACTIVITY */}
                  {business_active_step?.name === 'business_activity_vat' && (
                    <BusinessActivity
                      isOpen={
                        business_active_step?.name === 'business_activity_vat'
                      }
                      company_activities={
                        businessApplication?.company_activities
                      }
                      entry_id={entry_id}
                    />
                  )}

                  {/* BOARD OF DIRECTORS */}
                  {business_active_step?.name === 'board_of_directors' && (
                    <BoardDirectors
                      isOpen={
                        business_active_step?.name === 'board_of_directors'
                      }
                      board_of_directors={
                        businessApplication?.board_of_directors
                      }
                      entry_id={entry_id}
                    />
                  )}

                  {/* SENIOR MANAGEMENT */}
                  {business_active_step?.name === 'senior_management' && (
                    <SeniorManagement
                      isOpen={
                        business_active_step?.name === 'senior_management'
                      }
                      senior_management={businessApplication?.senior_management}
                      entry_id={entry_id}
                    />
                  )}

                  {/* EMPLOYMENT INFO */}
                  {business_active_step?.name === 'employment_info' && (
                    <EmploymentInfo
                      isOpen={business_active_step?.name === 'employment_info'}
                      employment_info={businessApplication?.employment_info}
                      entry_id={entry_id}
                    />
                  )}

                  {/* SHARE DETAILS */}
                  {business_active_step?.name === 'share_details' && (
                    <ShareDetails
                      isOpen={business_active_step?.name === 'share_details'}
                      share_details={businessApplication?.share_details}
                      entry_id={entry_id}
                    />
                  )}

                  {/* SHAREHOLDERS */}
                  {business_active_step?.name === 'shareholders' && (
                    <ShareHolders
                      isOpen={business_active_step?.name === 'shareholders'}
                      shareholders={businessApplication?.shareholders}
                      entry_id={entry_id}
                    />
                  )}

                  {/* CAPITAL DETAILS */}
                  {business_active_step?.name === 'capital_details' && (
                    <CapitalDetails
                      isOpen={business_active_step?.name === 'capital_details'}
                      capital_details={businessApplication?.capital_details}
                      entry_id={entry_id}
                      share_details={businessApplication?.share_details}
                      shareholders={businessApplication?.shareholders}
                    />
                  )}

                  {/* BENEFICIAL OWNERS */}
                  {business_active_step?.name === 'beneficial_owners' && (
                    <BeneficialOwners
                      isOpen={
                        business_active_step?.name === 'beneficial_owners'
                      }
                      beneficial_owners={businessApplication?.beneficial_owners}
                      entry_id={entry_id}
                    />
                  )}

                  {/* ATTACHMENTS */}
                  {business_active_step?.name === 'attachments' && (
                    <CompanyAttachments
                      isOpen={business_active_step?.name === 'attachments'}
                      company_attachments={businessApplication?.company_attachments}
                      entry_id={entry_id}
                    />
                  )}

                  {/* PREVIEW AND SUBMISSINO */}
                  {business_active_step?.name === 'preview_submission' && (
                    <PreviewSubmission
                      isOpen={
                        business_active_step?.name === 'preview_submission'
                      }
                      business_application={businessApplication}
                    />
                  )}
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
