import { useSelector } from "react-redux";
import UserLayout from "../../containers/UserLayout";
import { RootState } from "../../states/store";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from "../../states/features/enterpriseRegistrationSlice";
import ProgressNavigation from "../business-registration/ProgressNavigation";
import { TabType } from "../../states/features/types";
import Tab from "../../components/business-registration/Tab";
import { useLocation } from "react-router-dom";
import EnterpriseDetails from "./EnterpriseDetails";

const EnterpriseRegistration = () => {
  const { enterprise_registration_tabs, enterprise_registration_active_step } =
    useSelector((state: RootState) => state.enterpriseRegistration);
  // CATCH PROGRESS ID
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 p-8">
        <ProgressNavigation
          tabs={enterprise_registration_tabs}
          setActiveTab={setEnterpriseActiveTab}
        />
        <menu className="flex items-center w-full gap-5">
          {enterprise_registration_tabs?.map((tab: TabType, index: number) => {
            return (
              <Tab
                isOpen={tab?.active}
                steps={tab?.steps}
                key={`${String(index)}-${entry_id}`}
                setActiveStep={setEnterpriseActiveStep}
              >
                <EnterpriseDetails
                  isOpen={
                    enterprise_registration_active_step?.name ===
                    "enterprise_details"
                  }
                />
              </Tab>
            );
          })}
        </menu>
      </main>
    </UserLayout>
  );
};

export default EnterpriseRegistration;
