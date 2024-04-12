import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/store";
import UserLayout from "../../containers/UserLayout";
import ProgressNavigation from "../../components/business-registration/ProgressNavigation";
import { useLocation, useNavigate } from "react-router-dom";
import Tab from "../../components/business-registration/Tab";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from "../../states/features/businessRegistrationSlice";
import CompanyDetails from "./general-information/CompanyDetails";
import CompanyAddress from "./general-information/CompanyAddress";
import BusinessActivity from "./general-information/BusinessActivity";
import BoardDirectors from "./management/BoardDirectors";
import SeniorManagement from "./management/SeniorManagement";
import EmploymentInfo from "./management/EmploymentInfo";
import ShareDetails from "./capital-information/ShareDetails";
import ShareHolders from "./capital-information/ShareHolders";
import CapitalDetails from "./capital-information/CapitalDetails";
import BeneficialOwners from "./beneficial-owners/BeneficialOwners";
import CompanyAttachments from "./attachments/CompanyAttachments";
import PreviewSubmission from "./preview-submission/BusinessPreviewSubmission";
import AddReviewComments from "../../components/applications-review/AddReviewComments";
import ListReviewComments from "../../components/applications-review/ListReviewComments";
import { useEffect } from "react";
import { setUserApplications } from "../../states/features/userApplicationSlice";
import ReviewNavigation from "./ReviewNavigation";
import { RDBAdminEmailPattern } from "../../constants/Users";
import UserReviewComments from "../../components/applications-review/UserReviewComments";
import { TabType } from "../../states/features/types";

const BusinessRegistration = () => {
  // CATCH PROGRESS ID
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");

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
  const { user } = useSelector((state: RootState) => state.user);
  const businessApplication = user_applications?.find(
    (app: {
      entry_id: string;
      status: string;
      path: string;
      type: string;
      owner: string;
    }) => app?.entry_id === entry_id
  );

  // NAVIGATION
  const navigate = useNavigate();

  // APPLICATION STATUS
  let status = "in_progress";
  if (businessApplication) {
    status = businessApplication.status;
  }
  if (RDBAdminEmailPattern.test(user?.email)) {
    status = "in_review";
  }

  useEffect(() => {
    if (entry_id) {
      dispatch(
        setUserApplications({
          entry_id,
          status,
          path: `/business-registration?entry_id=${entry_id}`,
          type: "business_registration",
          owner: user?.email,
        })
      );
    } else {
      navigate("/business-registration/new");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, entry_id, navigate]);

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
                key={`${String(index)}-${entry_id}`}
                setActiveStep={setBusinessActiveStep}
                active_tab={business_active_tab}
              >
                {/* COMPANY DETAILS */}
                {business_active_step?.name === "company_details" && (
                  <CompanyDetails
                    entry_id={entry_id}
                    isOpen={business_active_step?.name === "company_details"}
                    company_details={businessApplication?.company_details}
                    status={status}
                  />
                )}
                {/* COMPANY ADDRESS */}
                {business_active_step?.name === "company_address" && (
                  <CompanyAddress
                    isOpen={business_active_step?.name === "company_address"}
                    company_address={businessApplication?.company_address}
                    entry_id={entry_id}
                    status={status}
                  />
                )}
                {/* BUSINESS ACTIVITY */}
                {business_active_step?.name === "business_activity_vat" && (
                  <BusinessActivity
                    isOpen={
                      business_active_step?.name === "business_activity_vat"
                    }
                    company_activities={businessApplication?.company_activities}
                    entry_id={entry_id}
                    status={status}
                  />
                )}

                {/* BOARD OF DIRECTORS */}
                {business_active_step?.name === "board_of_directors" && (
                  <BoardDirectors
                    isOpen={business_active_step?.name === "board_of_directors"}
                    board_of_directors={businessApplication?.board_of_directors}
                    entry_id={entry_id}
                    status={status}
                  />
                )}

                {/* SENIOR MANAGEMENT */}
                {business_active_step?.name === "senior_management" && (
                  <SeniorManagement
                    isOpen={business_active_step?.name === "senior_management"}
                    senior_management={businessApplication?.senior_management}
                    entry_id={entry_id}
                    status={status}
                  />
                )}

                {/* EMPLOYMENT INFO */}
                {business_active_step?.name === "employment_info" && (
                  <EmploymentInfo
                    isOpen={business_active_step?.name === "employment_info"}
                    employment_info={businessApplication?.employment_info}
                    entry_id={entry_id}
                    status={status}
                  />
                )}

                {/* SHARE DETAILS */}
                {business_active_step?.name === "share_details" && (
                  <ShareDetails
                    isOpen={business_active_step?.name === "share_details"}
                    share_details={businessApplication?.share_details}
                    entry_id={entry_id}
                    status={status}
                  />
                )}

                {/* SHAREHOLDERS */}
                {business_active_step?.name === "shareholders" && (
                  <ShareHolders
                    isOpen={business_active_step?.name === "shareholders"}
                    shareholders={businessApplication?.shareholders}
                    entry_id={entry_id}
                    status={status}
                  />
                )}

                {/* CAPITAL DETAILS */}
                {business_active_step?.name === "capital_details" && (
                  <CapitalDetails
                    isOpen={business_active_step?.name === "capital_details"}
                    capital_details={businessApplication?.capital_details}
                    entry_id={entry_id}
                    share_details={businessApplication?.share_details}
                    shareholders={businessApplication?.shareholders}
                    status={status}
                  />
                )}

                {/* BENEFICIAL OWNERS */}
                {business_active_step?.name === "beneficial_owners" && (
                  <BeneficialOwners
                    isOpen={business_active_step?.name === "beneficial_owners"}
                    beneficial_owners={businessApplication?.beneficial_owners}
                    entry_id={entry_id}
                    status={status}
                  />
                )}

                {/* ATTACHMENTS */}
                {business_active_step?.name === "attachments" && (
                  <CompanyAttachments
                    isOpen={business_active_step?.name === "attachments"}
                    company_attachments={
                      businessApplication?.company_attachments
                    }
                    entry_id={entry_id}
                    company_details={businessApplication?.company_details}
                    status={status}
                  />
                )}

                {/* PREVIEW AND SUBMISSINO */}
                {business_active_step?.name === "preview_submission" && (
                  <PreviewSubmission
                    isOpen={business_active_step?.name === "preview_submission"}
                    business_application={businessApplication}
                    status={status}
                  />
                )}
              </Tab>
            );
          })}
        </menu>
        {RDBAdminEmailPattern.test(user?.email) && (
          <>
            <ReviewNavigation
              entry_id={entry_id}
              setActiveStep={setBusinessActiveStep}
              setActiveTab={setBusinessActiveTab}
              tabs={business_registration_tabs}
              activeStep={business_active_step}
            />
            <AddReviewComments
              entry_id={entry_id}
              activeStep={business_active_step}
              activeTab={business_active_tab}
            />
            <ListReviewComments
              entry_id={entry_id}
              setActiveStep={setBusinessActiveStep}
              setActiveTab={setBusinessActiveTab}
              title="Business Registration Review Comments"
            />
          </>
        )}
      </main>
      <UserReviewComments active_tab={business_active_tab} />
    </UserLayout>
  );
};

export default BusinessRegistration;
