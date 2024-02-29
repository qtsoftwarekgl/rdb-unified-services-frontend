import { useSelector } from "react-redux";
import { RootState } from "../../states/store";
import UserLayout from "../../containers/UserLayout";
import ProgressNavigation from "./ProgressNavigation";
import CompanyDetails from "./CompanyDetails";

const BusinessRegistration = () => {

  // STATE VARIABLES
  const { step } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  // REGISTRATION STEPS
  const registrationSteps = [
    {
      component: <CompanyDetails />,
    }
  ];

  return (
    <UserLayout>
      <main className="p-8 flex flex-col gap-6">
        <ProgressNavigation />
        <menu className="flex items-center w-full gap-5">
          {registrationSteps[step - 1]?.component}
        </menu>
      </main>
    </UserLayout>
  )
}

export default BusinessRegistration;
