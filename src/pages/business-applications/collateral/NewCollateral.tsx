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
import { useLocation } from "react-router-dom";
import CollateralInformation from "./CollateralInformation";
import CollateralAttachments from "./Attachments";
import PreviewSubmission from "./PreviewSubmission";
import UserReviewTabComments from "@/components/applications-review/UserReviewTabComments";
import ReviewComments from "./ReviewComments";

const NewCollateral = () => {
  const {
    collateral_registration_tabs,
    collateral_active_step,
    collateral_active_tab,
  } = useSelector((state: RootState) => state.collateralRegistration);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entryId = queryParams.get("entryId");

  const { collateral_applications } = useSelector(
    (state: RootState) => state.collateralRegistration
  );
  const application = collateral_applications.find(
    (app) => app.entryId === entryId
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
                        entryId={entryId}
                        debtor_info={application?.debtor_info}
                      />
                    )}
                    {activeStepName === "collateral_information" && (
                      <CollateralInformation
                        entryId={entryId}
                        collateral_infos={application?.collateral_infos || []}
                        debtor_info={application?.debtor_info}
                        collateral_type={application?.collateral_type}
                        loan_amount={application?.loan_amount}
                        loan_amount_in_words={application?.loan_amount_in_words}
                      />
                    )}
                    {activeStepName === "attachments" && (
                      <CollateralAttachments
                        entryId={entryId}
                        attachments={application?.attachments?.fileNames || []}
                        isAOMADownloaded={
                          application?.isAOMADownloaded || false
                        }
                      />
                    )}
                    {activeStepName === "preview" && (
                      <PreviewSubmission
                        entryId={entryId}
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
        <UserReviewTabComments active_tab={collateral_active_tab} />
      </section>
    </AdminLayout>
  );
};

export default NewCollateral;
