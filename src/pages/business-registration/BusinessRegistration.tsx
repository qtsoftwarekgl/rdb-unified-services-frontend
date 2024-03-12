import { useSelector } from "react-redux";
import { RootState } from "../../states/store";
import UserLayout from "../../containers/UserLayout";
import ProgressNavigation from "./ProgressNavigation";
import { useLocation } from "react-router-dom";
import Tab from "../../components/business-registration/Tab";
import { RegistrationTab } from "../../states/features/businessRegistrationSlice";
import CompanyDetails from "./general-information/CompanyDetails";

const BusinessRegistration = () => {

  // STATE VARIABLES
  const { business_registration_tabs, business_active_step } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  // CATCH PROGRESS ID
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");

  return (
    <UserLayout>
      <main className="p-8 flex flex-col gap-6">
        <ProgressNavigation />
        <menu className="flex items-center w-full gap-5">
          {business_registration_tabs?.map((tab: RegistrationTab, index: number) => {
            return (
              <Tab
                isOpen={tab?.active}
                steps={tab?.steps}
                key={`${String(index)}-${entry_id}`}
              >

                {/* COMPANY DETAILS */}
                <CompanyDetails
                  isOpen={business_active_step?.name === 'company_details'}
                />
              </Tab>
            );
          })}
        </menu>
      </main>
    </UserLayout>
  );
}

export default BusinessRegistration;
