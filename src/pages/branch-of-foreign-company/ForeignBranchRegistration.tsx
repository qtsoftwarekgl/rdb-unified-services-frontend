import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../containers/UserLayout";
import ProgressNavigation from "../../components/business-registration/ProgressNavigation";
import { useLocation } from "react-router-dom";
import Tab from "../../components/business-registration/Tab";
import {
  RegistrationTab,
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from "../../states/features/foreignBranchRegistrationSlice";
import CompanyDetails from "./general-information/CompanyDetails";
import CompanyAddress from "./general-information/CompanyAddress";
import BusinessActivity from "./general-information/BusinessActivity";
import BoardDirectors from "./management/BoardDirectors";
import SeniorManagement from "./management/SeniorManagement";
import EmploymentInfo from "./management/EmploymentInfo";
import BeneficialOwners from "./beneficial-owners/BeneficialOwners";
import CompanyAttachments from "./attachments/CompanyAttachments";
import PreviewSubmission from "./preview-submission/BusinessPreviewSubmission";
import { setUserApplications } from "../../states/features/userApplicationSlice";
import moment from "moment";
import { RootState } from "../../states/store";
import ReviewNavigation from "../business-registration/ReviewNavigation";
import AddReviewComments from "../../components/applications-review/AddReviewComments";
import ListReviewComments from "../../components/applications-review/ListReviewComments";
import { RDBAdminEmailPattern } from "../../constants/Users";
import UserReviewComments from "../../components/applications-review/UserReviewComments";

const ForeignBranchRegistration = () => {
  const {
    foreign_business_registration_tabs,
    foreign_business_active_step,
    foreign_business_active_tab,
  } = useSelector((state: RootState) => state.foreignBranchRegistration);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");
  const dispatch = useDispatch();
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { user } = useSelector((state: RootState) => state.user);
  const current_application = user_applications?.find(
    (app) => app.entry_id === entry_id
  );

  useEffect(() => {
    dispatch(
      setUserApplications({
        entry_id,
        status: RDBAdminEmailPattern.test(user?.email)
          ? "in_review"
          : "in_progress",
        type: "foreign_branch",
        path: `/foreign-branch-registration?entry_id=${entry_id}`,
        created_at: moment(Date.now()).format("DD/MM/YYYY"),
        owner: user?.email,
      })
    );
  }, [entry_id, dispatch]);

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 p-8">
        <ProgressNavigation
          tabs={foreign_business_registration_tabs}
          setActiveTab={setForeignBusinessActiveTab}
        />
        <menu className="flex items-center w-full gap-5">
          {foreign_business_registration_tabs?.map(
            (tab: RegistrationTab, index: number) => {
              const isActiveTab = tab?.active;
              const activeStepName = foreign_business_active_step?.name;

              return (
                <Tab
                  isOpen={isActiveTab}
                  steps={tab?.steps}
                  key={`${String(index)}-${entry_id}`}
                  setActiveStep={setForeignBusinessActiveStep}
                  active_tab={foreign_business_active_tab}
                >
                  {isActiveTab && (
                    <>
                      {activeStepName === "company_details" && (
                        <CompanyDetails
                          entry_id={entry_id}
                          company_details={current_application?.company_details}
                        />
                      )}
                      {activeStepName === "foreign_company_address" && (
                        <CompanyAddress
                          entry_id={entry_id}
                          foreign_company_address={
                            current_application?.foreign_company_address
                          }
                        />
                      )}
                      {activeStepName === "foreign_business_activity_vat" && (
                        <BusinessActivity
                          entry_id={entry_id}
                          foreign_company_activities={
                            current_application?.foreign_company_activities
                          }
                        />
                      )}
                      {activeStepName === "foreign_board_of_directors" && (
                        <BoardDirectors
                          entry_id={entry_id}
                          foreign_board_of_directors={
                            current_application?.foreign_board_of_directors ||
                            []
                          }
                        />
                      )}
                      {activeStepName === "foreign_senior_management" && (
                        <SeniorManagement
                          entry_id={entry_id}
                          foreign_senior_management={
                            current_application?.foreign_senior_management || []
                          }
                        />
                      )}
                      {activeStepName === "foreign_employment_info" && (
                        <EmploymentInfo
                          entry_id={entry_id}
                          foreign_employment_info={
                            current_application?.foreign_employment_info
                          }
                        />
                      )}
                      {activeStepName === "foreign_beneficial_owners" && (
                        <BeneficialOwners
                          entry_id={entry_id}
                          foreign_beneficial_owners={
                            current_application?.foreign_beneficial_owners || []
                          }
                        />
                      )}
                      {activeStepName === "foreign_attachments" && (
                        <CompanyAttachments
                          entry_id={entry_id}
                          foreign_company_attachments={
                            current_application?.foreign_company_attachments
                          }
                          foreign_company_details={
                            current_application?.company_details
                          }
                        />
                      )}
                      {activeStepName === "foreign_preview_submission" && (
                        <PreviewSubmission
                          entry_id={entry_id}
                          current_application={current_application}
                        />
                      )}
                    </>
                  )}
                </Tab>
              );
            }
          )}
        </menu>
        <UserReviewComments active_tab={foreign_business_active_tab} />
        {RDBAdminEmailPattern.test(user?.email) && (
          <>
            <ReviewNavigation
              entry_id={entry_id}
              setActiveStep={setForeignBusinessActiveStep}
              setActiveTab={setForeignBusinessActiveTab}
              tabs={foreign_business_registration_tabs}
              activeStep={foreign_business_active_step}
            />
            <AddReviewComments
              entry_id={entry_id}
              activeStep={foreign_business_active_step}
              activeTab={foreign_business_active_tab}
            />
            <ListReviewComments
              entry_id={entry_id}
              setActiveStep={setForeignBusinessActiveStep}
              setActiveTab={setForeignBusinessActiveTab}
              title="Branch of Foreign Company Registration Review Comments"
            />
          </>
        )}
      </main>
    </UserLayout>
  );
};

export default ForeignBranchRegistration;
