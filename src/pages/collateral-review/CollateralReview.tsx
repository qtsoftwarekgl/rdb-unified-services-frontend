import ProgressNavigation from "@/components/business-registration/ProgressNavigation";
import Tab from "@/components/business-registration/Tab";
import AdminLayout from "@/containers/AdminLayout";
import {
  setCollateralReviewActiveStep,
  setCollateralReviewActiveTab,
} from "@/states/features/collateralReviewSlice";
import { TabType } from "@/states/features/types";
import { RootState } from "@/states/store";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Property from "./Property";
import { RDBAdminEmailPattern, documents } from "@/constants/Users";
import ReviewNavigation from "../business-registration/ReviewNavigation";
import AddReviewComments from "@/components/applications-review/AddReviewComments";
import ListReviewComments from "@/components/applications-review/ListReviewComments";
import Mortgage from "./Mortgage";
import AoMA from "./AoMA";
import Attachements from "./Attachments";
import { generateUUID } from "@/helpers/strings";
import MortgageHistory from "./MortgageHistory";
import { setCollateralApplications } from "@/states/features/collateralRegistrationSlice";

const CollateralReview = () => {
  const {
    collateral_review_active_tab,
    collateral_review_tabs,
    collateral_review_active_step,
  } = useSelector((state: RootState) => state.collateralReview);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");
  const collateral_id = queryParams.get("collateral_id");

  const { collateral_applications } = useSelector(
    (state: RootState) => state.collateralRegistration
  );
  const { user } = useSelector((state: RootState) => state.user);

  const application = collateral_applications.find(
    (app) => app?.entry_id === entry_id
  );

  const collateral = application?.collateral_infos.find(
    (collateral) => collateral.collateral_id === collateral_id
  );

  return (
    <AdminLayout>
      <section className="flex flex-col w-full gap-4 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex flex-col gap-3 mb-6">
          <menu className="flex justify-between w-full">
            <h1 className="font-bold">
              Amendment - Receivership: Default notice Regarding load default
            </h1>
            <h1 className="font-bold">
              In-Journal No: {Math.floor(Math.random() * 2000) + 1000}
            </h1>
          </menu>
          <p className="flex flex-col gap-2">
            <span>Notice Id: {Math.floor(Math.random() * 2000) + 1000}</span>
            <span>Submitted</span>
            <span>
              Registration No: {Math.floor(Math.random() * 2000) + 1000}
              /2022/ORG
            </span>
            <span>
              First Mortgage Registration:{" "}
              {Math.floor(Math.random() * 2000) + 1000}/2011/ORG
            </span>
          </p>
        </menu>
        <ProgressNavigation
          tabs={collateral_review_tabs}
          setActiveTab={setCollateralReviewActiveTab}
        />
        <menu className="flex items-center w-full gap-2 rounded">
          {collateral_review_tabs.map((tab: TabType, index: number) => {
            const isActiveTab = tab.active;
            const activeStepName = collateral_review_active_step?.name;
            return (
              <Tab
                isOpen={isActiveTab}
                steps={tab?.steps}
                key={`${String(index)}-${tab?.name}`}
                setActiveStep={setCollateralReviewActiveStep}
                active_tab={collateral_review_active_tab}
              >
                {isActiveTab && (
                  <>
                    {activeStepName === "property" && (
                      <Property property={collateral} />
                    )}
                    {activeStepName === "mortgage" && (
                      <Mortgage
                        property={{
                          loan_amount: application.loan_amount,
                          loan_amount_in_words:
                            application.loan_amount_in_words,
                          ...collateral,
                          debtors: [
                            {
                              ...application?.debtor_info,
                              debtor_address:
                                application.debtor_info?.debtor_address ||
                                application.debtor_info?.company_address,
                              debtor_id:
                                application.debtor_info?.id_number ||
                                application.debtor_info?.tin_number,
                            },
                          ],
                          creditors: [application?.creditor],
                        }}
                      />
                    )}
                    {activeStepName === "aoma" && (
                      <AoMA documentUrl="/public/BusinessCrt_202104051447207533.pdf" />
                    )}
                    {activeStepName === "attachments" && (
                      <Attachements
                        loan_attachments={application?.attachments?.fileNames.map(
                          (attachment: string, index: number) => {
                            return {
                              id: generateUUID(),
                              name: attachment,
                              url: documents[Math.floor(Math.random() * 2)],
                              active: index === 0 ? true : false,
                            };
                          }
                        )}
                      />
                    )}

                    {activeStepName === "mortgage_history" && (
                      <MortgageHistory
                        mortgage_history={collateral?.mortgage_history || []}
                      />
                    )}
                  </>
                )}
              </Tab>
            );
          })}
        </menu>
        {RDBAdminEmailPattern.test(user?.email) && (
          <>
            <ReviewNavigation
              entry_id={entry_id}
              setActiveStep={setCollateralReviewActiveStep}
              setActiveTab={setCollateralReviewActiveTab}
              tabs={collateral_review_tabs}
              activeStep={collateral_review_active_step}
              first_step="property"
              last_step="mortgage_history"
              redirectUrl="/admin/review-collaterals"
              setApplication={setCollateralApplications}
            />
            <AddReviewComments
              entry_id={entry_id}
              activeStep={collateral_review_active_step}
              activeTab={collateral_review_active_tab}
            />
            <ListReviewComments
              entry_id={entry_id}
              setActiveStep={setCollateralReviewActiveStep}
              setActiveTab={setCollateralReviewActiveTab}
              title="Collateral Review Comments"
            />
          </>
        )}
      </section>
    </AdminLayout>
  );
};

export default CollateralReview;
