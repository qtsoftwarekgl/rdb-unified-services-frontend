import { useSelector } from 'react-redux';
import { RootState } from '../../states/store';
import UserLayout from '../../containers/UserLayout';
import ProgressNavigation from './ProgressNavigation';
import { useLocation } from 'react-router-dom';
import Tab from '../../components/business-registration/Tab';
import {
  RegistrationTab,
  setBusinessActiveStep,
  setBusinessActiveTab,
} from '../../states/features/businessRegistrationSlice';
import CompanyDetails from './general-information/CompanyDetails';
import CompanyAddress from './general-information/CompanyAddress';
import BusinessActivity from './general-information/BusinessActivity';
import BoardDirectors from './management/BoardDirectors';
import SeniorManagement from './management/SeniorManagement';

const BusinessRegistration = () => {
  // STATE VARIABLES
  const { business_registration_tabs, business_active_step } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  // CATCH PROGRESS ID
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get('entry_id');

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 p-8">
        <ProgressNavigation
          tabs={business_registration_tabs}
          setActiveTab={setBusinessActiveTab}
        />
        <menu className="flex items-center w-full gap-5">
          {business_registration_tabs?.map(
            (tab: RegistrationTab, index: number) => {
              return (
                <Tab
                  isOpen={tab?.active}
                  steps={tab?.steps}
                  key={`${String(index)}-${entry_id}`}
                  setActiveStep={setBusinessActiveStep}
                >
                  {/* COMPANY DETAILS */}
                  <CompanyDetails
                    isOpen={business_active_step?.name === 'company_details'}
                  />
                  {/* COMPANY ADDRESS */}
                  <CompanyAddress
                    isOpen={business_active_step?.name === 'company_address'}
                  />
                  {/* BUSINESS ACTIVITY */}
                  <BusinessActivity
                    isOpen={
                      business_active_step?.name === 'business_activity_vat'
                    }
                  />

                  {/* BOARD OF DIRECTORS */}
                  <BoardDirectors
                    isOpen={business_active_step?.name === 'board_of_directors'}
                  />

                  {/* SENIOR MANAGEMENT */}
                  <SeniorManagement
                    isOpen={business_active_step?.name === 'senior_management'}
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

export default BusinessRegistration;
