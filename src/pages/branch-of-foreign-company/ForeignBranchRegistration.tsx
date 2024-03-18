import { useSelector } from "react-redux";
import { RootState } from "../../states/store";
import UserLayout from "../../containers/UserLayout";
import ProgressNavigation from "../business-registration/ProgressNavigation";
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

const ForeignBranchRegistration = () => {
  // STATE VARIABLES
  const {
    foreign_business_registration_tabs,
    foreign_business_active_step,
    foreign_business_active_tab,
  } = useSelector((state: RootState) => state.foreignBranchRegistration);

  // CATCH PROGRESS ID
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");

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
              return (
                <Tab
                  isOpen={tab?.active}
                  steps={tab?.steps}
                  key={`${String(index)}-${entry_id}`}
                  setActiveStep={setForeignBusinessActiveStep}
                  active_tab={foreign_business_active_tab}
                >
                  {/* COMPANY DETAILS */}
                  <CompanyDetails
                    isOpen={
                      foreign_business_active_step?.name === "company_details"
                    }
                  />
                  {/* COMPANY ADDRESS */}
                  <CompanyAddress
                    isOpen={
                      foreign_business_active_step?.name === "company_address"
                    }
                  />
                  {/* BUSINESS ACTIVITY */}
                  <BusinessActivity
                    isOpen={
                      foreign_business_active_step?.name ===
                      "business_activity_vat"
                    }
                  />

                  {/* BOARD OF DIRECTORS */}
                  <BoardDirectors
                    isOpen={
                      foreign_business_active_step?.name ===
                      "board_of_directors"
                    }
                  />

                  {/* SENIOR MANAGEMENT */}
                  <SeniorManagement
                    isOpen={
                      foreign_business_active_step?.name === "senior_management"
                    }
                  />

                  {/* EMPLOYMENT INFO */}
                  <EmploymentInfo
                    isOpen={
                      foreign_business_active_step?.name === "employment_info"
                    }
                  />

                  {/* BENEFICIAL OWNERS */}
                  <BeneficialOwners
                    isOpen={
                      foreign_business_active_step?.name === "beneficial_owners"
                    }
                  />

                  {/* ATTACHMENTS */}
                  <CompanyAttachments
                    isOpen={
                      foreign_business_active_step?.name === "attachments"
                    }
                  />

                  {/* PREVIEW AND SUBMISSINO */}
                  <PreviewSubmission
                    isOpen={
                      foreign_business_active_step?.name ===
                      "preview_submission"
                    }
                  />
                </Tab>
              );
            }
          )}
        </menu>
      </main>
    </UserLayout>
  );
};

export default ForeignBranchRegistration;
