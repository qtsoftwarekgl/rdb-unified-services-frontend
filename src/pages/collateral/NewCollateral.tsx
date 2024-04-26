import ProgressNavigation from "@/components/business-registration/ProgressNavigation";
import Tab from "@/components/business-registration/Tab";
import AdminLayout from "@/containers/AdminLayout";
import {
  setCollateralActiveStep,
  setCollateralActiveTab,
} from "@/states/features/collateralRegistrationSlice";
import { TabType } from "@/states/features/types";
import { RootState } from "@/states/store";
import { useSelector } from "react-redux";
import DebtorInformation from "./DebtorInformation";
import { useLocation, useNavigate } from "react-router-dom";
import CollateralInformation from "./CollateralInformation";
import CollateralAttachments from "./Attachments";
import PreviewSubmission from "./PreviewSubmission";
import UserReviewComments from "@/components/applications-review/UserReviewComments";
import ReviewComments from "./ReviewComments";
import { RDBVerifierAndApproverEmailPattern } from "@/constants/Users";

const NewCollateral = () => {
  const {
    collateral_registration_tabs,
    collateral_active_step,
    collateral_active_tab,
  } = useSelector((state: RootState) => state.collateralRegistration);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");

  const { collateral_applications } = useSelector(
    (state: RootState) => state.collateralRegistration
  );
  const application = collateral_applications.find(
    (app) => app.entry_id === entry_id
  );

  return (
    <AdminLayout>
      <section className="flex flex-col w-full gap-4 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex items-center justify-between w-full gap-3">
          <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
            New Collateral
          </h1>
        </menu>
        <ProgressNavigation
          tabs={collateral_registration_tabs}
          setActiveTab={setCollateralActiveTab}
        />
        <menu className="flex w-full gap-2 rounded">
          {collateral_registration_tabs.map((tab: TabType, index: number) => {
            const isActiveTab = tab.active;
            const activeStepName = collateral_active_step?.name;
            return (
              <Tab
                isOpen={isActiveTab}
                steps={tab?.steps}
                key={`${String(index)}-${tab?.name}`}
                setActiveStep={setCollateralActiveStep}
                active_tab={collateral_active_tab}
              >
                {isActiveTab && (
                  <>
                    {activeStepName === "debtor_information" && (
                      <DebtorInformation
                        entry_id={entry_id}
                        debtor_info={application?.debtor_info}
                      />
                    )}
                    {activeStepName === "collateral_information" && (
                      <CollateralInformation
                        entry_id={entry_id}
                        collateral_infos={application?.collateral_infos || []}
                        debtor_info={application?.debtor_info}
                        collateral_type={application?.collateral_type}
                        loan_amount={application?.loan_amount}
                        loan_amount_in_words={application?.loan_amount_in_words}
                      />
                    )}
                    {activeStepName === "attachments" && (
                      <CollateralAttachments
                        entry_id={entry_id}
                        attachments={application?.attachments?.fileNames || []}
                        isAOMADownloaded={
                          application?.isAOMADownloaded || false
                        }
                      />
                    )}
                    {activeStepName === "preview" && (
                      <PreviewSubmission
                        entry_id={entry_id}
                        collateral_attachments={application?.attachments}
                        debtor_info={application?.debtor_info}
                        collateral_infos={application?.collateral_infos}
                        loan_amount={application?.loan_amount}
                        collateral_type={application?.collateral_type}
                        isAOMADownloaded={
                          application?.isAOMADownloaded || false
                        }
                      />
                    )}
                  </>
                )}
              </Tab>
            );
          })}
          <ReviewComments />
        </menu>
        <UserReviewComments active_tab={collateral_active_tab} />
      </section>
    </AdminLayout>
  );
};

export default NewCollateral;
