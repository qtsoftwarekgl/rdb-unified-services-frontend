import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../../containers/UserLayout";
import ProgressNavigation from "../../../components/business-registration/ProgressNavigation";
import { useLocation } from "react-router-dom";
import Tab from "../../../components/business-registration/Tab";
import {
  RegistrationTab,
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from "../../../states/features/foreignCompanyRegistrationSlice";
import CompanyDetails from "./general-information/CompanyDetails";
import CompanyAddress from "./general-information/CompanyAddress";
import BusinessActivity from "./general-information/BusinessActivity";
import BoardDirectors from "./management/BoardDirectors";
import SeniorManagement from "./management/SeniorManagement";
import EmploymentInfo from "./management/EmploymentInfo";
import BeneficialOwners from "./beneficial-owners/BeneficialOwners";
import CompanyAttachments from "./attachments/CompanyAttachments";
import PreviewSubmission from "./preview-submission/BusinessPreviewSubmission";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import moment from "moment";
import { RootState } from "../../../states/store";
import ReviewNavigation from "../domestic-business-registration/ReviewNavigation";
import AddReviewComments from "../../../components/applications-review/AddReviewComments";
import ListReviewComments from "../../../components/applications-review/ListReviewComments";
import { RDBAdminEmailPattern } from "../../../constants/Users";
import UserReviewTabComments from "../../../components/applications-review/UserReviewTabComments";

const ForeignBranchRegistration = () => {
  const {
    foreign_business_registration_tabs,
    foreign_business_active_step,
    foreign_business_active_tab,
  } = useSelector((state: RootState) => state.foreignCompanyRegistration);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entryId = queryParams.get("entryId");
  const dispatch = useDispatch();
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { user } = useSelector((state: RootState) => state.user);
  const current_application = user_applications?.find(
    (app: {
      entryId: string;
      status: string;
      path: string;
      type: string;
      owner: string;
    }) => app.entryId === entryId
  );

  // APPLICATION STATUS
  let status = "IN_PROGRESS";
  if (current_application) {
    status = current_application.status;
  }
  if (RDBAdminEmailPattern.test(user?.email)) {
    status = "IN_REVIEW";
  }

  useEffect(() => {
    dispatch(
      setUserApplications({
        entryId,
        status,
        type: "foreign_branch",
        path: `/foreign-branch-registration?entryId=${entryId}`,
        createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        owner: user?.email,
      })
    );
  }, [entryId, dispatch]);

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
                  key={`${String(index)}-${entryId}`}
                  setActiveStep={setForeignBusinessActiveStep}
                  active_tab={foreign_business_active_tab}
                >
                  {isActiveTab && (
                    <>
                      {activeStepName === 'company_details' && (
                        <CompanyDetails
                          entryId={entryId}
                          company_details={current_application?.company_details}
                          status={status}
                        />
                      )}
                      {activeStepName === 'foreign_company_address' && (
                        <CompanyAddress
                          entryId={entryId}
                          foreign_company_address={
                            current_application?.foreign_company_address
                          }
                          status={status}
                        />
                      )}
                      {activeStepName === 'foreign_business_activity_vat' && (
                        <BusinessActivity
                          entryId={entryId}
                          foreign_company_activities={
                            current_application?.foreign_company_activities
                          }
                          status={status}
                        />
                      )}
                      {activeStepName === 'foreign_board_of_directors' && (
                        <BoardDirectors
                          entryId={entryId}
                          foreign_board_of_directors={
                            current_application?.foreign_board_of_directors ||
                            []
                          }
                          status={status}
                        />
                      )}
                      {activeStepName === 'foreign_executive_management' && (
                        <SeniorManagement
                          entryId={entryId}
                          foreign_executive_management={
                            current_application?.foreign_executive_management || []
                          }
                          status={status}
                        />
                      )}
                      {activeStepName === 'foreign_employment_info' && (
                        <EmploymentInfo
                          entryId={entryId}
                          foreign_employment_info={
                            current_application?.foreign_employment_info
                          }
                          status={status}
                        />
                      )}
                      {activeStepName === 'foreign_beneficial_owners' && (
                        <BeneficialOwners
                          entryId={entryId}
                          foreign_beneficial_owners={
                            current_application?.foreign_beneficial_owners || []
                          }
                          status={status}
                        />
                      )}
                      {activeStepName === 'foreign_attachments' && (
                        <CompanyAttachments
                          entryId={entryId}
                          foreign_company_attachments={
                            current_application?.foreign_company_attachments
                          }
                          foreign_company_details={
                            current_application?.company_details
                          }
                        />
                      )}
                      {activeStepName === 'foreign_preview_submission' && (
                        <PreviewSubmission
                          entryId={entryId}
                          current_application={current_application}
                          status={status}
                        />
                      )}
                    </>
                  )}
                </Tab>
              );
            }
          )}
        </menu>
        <UserReviewTabComments active_tab={foreign_business_active_tab} />
        {RDBAdminEmailPattern.test(user?.email) && (
          <>
            <ReviewNavigation
              entryId={entryId}
              setActiveStep={setForeignBusinessActiveStep}
              setActiveTab={setForeignBusinessActiveTab}
              tabs={foreign_business_registration_tabs}
              activeStep={foreign_business_active_step}
              first_step="company_details"
              last_step="preview_submission"
              redirectUrl="/admin/review-applications"
              setApplication={setUserApplications}
            />
            <AddReviewComments
              entryId={entryId}
              activeStep={foreign_business_active_step}
              activeTab={foreign_business_active_tab}
            />
            <ListReviewComments
              entryId={entryId}
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
