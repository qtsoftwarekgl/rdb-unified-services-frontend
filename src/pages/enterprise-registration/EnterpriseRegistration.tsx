import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../containers/UserLayout";
import { RootState } from "../../states/store";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from "../../states/features/enterpriseRegistrationSlice";
import ProgressNavigation from "../../components/business-registration/ProgressNavigation";
import { TabType } from "../../states/features/types";
import Tab from "../../components/business-registration/Tab";
import { useLocation } from "react-router-dom";
import EnterpriseDetails from "./enterprise_details/EnterpriseDetails";
import BusinessActivity from "./enterprise_details/BusinessActivityVAT";
import OfficeAddress from "./enterprise_details/OfficeAddress";
import Attachments from "./Attachements";
import Preview from "./Preview";
import { setUserApplications } from "../../states/features/userApplicationSlice";
import moment from "moment";
import ReviewNavigation from "../business-registration/ReviewNavigation";
import AddReviewComments from "../../components/applications-review/AddReviewComments";
import ListReviewComments from "../../components/applications-review/ListReviewComments";
import { RDBAdminEmailPattern } from "../../constants/Users";
import UserReviewComments from "../../components/applications-review/UserReviewComments";

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
  const entry_id = queryParams.get("entry_id");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setUserApplications({
        entry_id,
        status: RDBAdminEmailPattern.test(user?.email) ? "in_review" : "in_progress",
        created_at: moment(Date.now()).format("DD/MM/YYYY"),
        path: `/enterprise-registration?entry_id=${entry_id}`,
        type: "enterprise",
        owner: user?.email,
      })
    );
  }, [entry_id, dispatch]);

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
                key={`${String(index)}-${entry_id}`}
                setActiveStep={setEnterpriseActiveStep}
                active_tab={enterprise_registration_active_tab}
              >
                {isActiveTab && (
                  <>
                    {activeStepName === "company_details" && (
                      <EnterpriseDetails entry_id={entry_id} />
                    )}
                    {activeStepName === "business_activity_vat" && (
                      <BusinessActivity entry_id={entry_id} />
                    )}
                    {activeStepName === "office_address" && (
                      <OfficeAddress entry_id={entry_id} />
                    )}
                    {activeStepName === "attachments" && (
                      <Attachments entry_id={entry_id} />
                    )}
                    {activeStepName === "enterprise_preview_submission" && (
                      <Preview entry_id={entry_id} />
                    )}
                  </>
                )}
              </Tab>
            );
          })}
          <UserReviewComments active_tab={enterprise_registration_active_tab} />
          {/* REVIEW APPLICATION SECTION */}
          {RDBAdminEmailPattern.test(user?.email) && (
            <>
              <ReviewNavigation
                entry_id={entry_id}
                setActiveStep={setEnterpriseActiveStep}
                setActiveTab={setEnterpriseActiveTab}
                tabs={enterprise_registration_tabs}
                activeStep={enterprise_registration_active_step}
              />
              <AddReviewComments
                entry_id={entry_id}
                activeStep={enterprise_registration_active_step}
                activeTab={enterprise_registration_active_tab}
              />
              <ListReviewComments
                entry_id={entry_id}
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
