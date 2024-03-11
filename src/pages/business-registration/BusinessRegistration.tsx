import { useSelector } from "react-redux";
import { RootState } from "../../states/store";
import UserLayout from "../../containers/UserLayout";
import ProgressNavigation from "./ProgressNavigation";
import { useLocation } from "react-router-dom";
import Tab from "../../components/business-registration/Tab";
import { RegistrationTab } from "../../states/features/businessRegistrationSlice";

const BusinessRegistration = () => {

  // STATE VARIABLES
  const { registration_tabs } = useSelector(
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
          {registration_tabs?.map((tab: RegistrationTab, index: number) => {
            return (
              <Tab
                isOpen={tab?.active}
                steps={tab?.steps}
                key={`${String(index)}-${entry_id}`}
              />
            );
          })}
        </menu>
      </main>
    </UserLayout>
  );
}

export default BusinessRegistration;
