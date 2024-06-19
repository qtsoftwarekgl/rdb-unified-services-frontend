import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../containers/UserLayout";
import { RootState } from "../../states/store";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from "../../states/features/enterpriseRegistrationSlice";
import ProgressNavigation from "../../components/business-registration/ProgressNavigation";
import { TabType } from "../../types/navigationTypes";
import Tab from "../../components/business-registration/Tab";
import { useLocation } from "react-router-dom";
import EnterpriseDetails from "./enterprise_details/EnterpriseDetails";
import BusinessActivity from "./enterprise_details/BusinessActivityVAT";
import OfficeAddress from "./enterprise_details/OfficeAddress";
import Attachments from "./Attachements";
import Preview from "./Preview";
import { setUserApplications } from "../../states/features/userApplicationSlice";
import moment from "moment";
import ReviewNavigation from "../business-applications/domestic-business-registration/ReviewNavigation";
import AddReviewComments from "../../components/applications-review/AddReviewComments";
import ListReviewComments from "../../components/applications-review/ListReviewComments";
import { RDBAdminEmailPattern } from "../../constants/Users";
import UserReviewTabComments from "../../components/applications-review/UserReviewTabComments";

const EnterpriseRegistration = () => {
  const {
    enterprise_registration_tabs,
    enterprise_registration_active_step,
    enterprise_registration_active_tab,
  } = useSelector((state: RootState) => state.enterpriseRegistration);

  const { user } = useSelector((state: RootState) => state.user);

  // CATCH PROGRESS ID
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entryId = queryParams.get("entryId");
  const dispatch = useDispatch();
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
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
        createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        path: `/enterprise-registration?entryId=${entryId}`,
        type: "enterprise",
        owner: user?.email,
      })
    );
  }, [entryId, dispatch]);

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 p-8">
        <ProgressNavigation
          tabs={enterprise_registration_tabs}
          setActiveTab={setEnterpriseActiveTab}
        />
        <menu className="flex items-center w-full gap-5 p-8 rounded ">
          {enterprise_registration_tabs?.map((tab: TabType, index: number) => {
            const isActiveTab = tab.active;
            const activeStepName = enterprise_registration_active_step?.name;

            return (
              <Tab
                isOpen={isActiveTab}
                steps={tab.steps}
                key={`${String(index)}-${entryId}`}
                setActiveStep={setEnterpriseActiveStep}
                active_tab={enterprise_registration_active_tab}
              >
                {isActiveTab && (
                  <>
                    {activeStepName === "company_details" && (
                      <EnterpriseDetails
                        entryId={entryId}
                        company_details={
                          current_application?.company_details || {}
                        }
                        status={status}
                      />
                    )}
                    {activeStepName === "business_activity_vat" && (
                      <BusinessActivity
                        entryId={entryId}
                        enterprise_business_lines={
                          current_application?.business_lines
                            ?.enterprise_business_lines || []
                        }
                        status={status}
                      />
                    )}
                    {activeStepName === "office_address" && (
                      <OfficeAddress
                        entryId={entryId}
                        enterprise_office_address={
                          current_application?.office_address || {}
                        }
                        status={status}
                      />
                    )}
                    {activeStepName === "attachments" && (
                      <Attachments
                        entryId={entryId}
                        enterprise_attachments={
                          current_application?.enterprise_attachments?.fileNames
                        }
                      />
                    )}
                    {activeStepName === "enterprise_preview_submission" && (
                      <Preview entryId={entryId} status={status} />
                    )}
                  </>
                )}
              </Tab>
            );
          })}
          <UserReviewTabComments active_tab={enterprise_registration_active_tab} />
          {/* REVIEW APPLICATION SECTION */}
          {RDBAdminEmailPattern.test(user?.email) && (
            <>
              <ReviewNavigation
                entryId={entryId}
                setActiveStep={setEnterpriseActiveStep}
                setActiveTab={setEnterpriseActiveTab}
                tabs={enterprise_registration_tabs}
                activeStep={enterprise_registration_active_step}
                first_step="company_details"
                last_step="preview_submission"
                redirectUrl="/admin/review-applications"
                setApplication={setUserApplications}
              />
              <AddReviewComments
                entryId={entryId}
                activeStep={enterprise_registration_active_step}
                activeTab={enterprise_registration_active_tab}
              />
              <ListReviewComments
                entryId={entryId}
                setActiveStep={setEnterpriseActiveStep}
                setActiveTab={setEnterpriseActiveTab}
                title="Enterprise Registration Review Comments"
              />
            </>
          )}
        </menu>
      </main>
    </UserLayout>
  );
};

export default EnterpriseRegistration;
