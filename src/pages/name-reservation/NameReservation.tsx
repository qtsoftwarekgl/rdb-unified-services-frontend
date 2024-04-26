import { useSelector } from "react-redux";
import UserLayout from "../../containers/UserLayout";
import ProgressNavigation from "../../components/business-registration/ProgressNavigation";
import { RootState } from "../../states/store";
import {
  setNameReservationActiveTab,
  setNameReservationActiveStep,
} from "../../states/features/nameReservationSlice";
import Tab from "../../components/business-registration/Tab";
import { TabType } from "../../states/features/types";
import { useLocation } from "react-router-dom";
import OwnerDetails from "./OwnerDetails";
import NameReservationSearch from "./NameReservationSearch";
import NameReservationSuccess from "./NameReservationSuccess";

const NameReservation = () => {
  const {
    name_reservation_tabs,
    name_reservation_active_tab,
    name_reservation_active_step,
  } = useSelector((state: RootState) => state.nameReservation);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 py-6">
        <ProgressNavigation
          tabs={name_reservation_tabs}
          setActiveTab={setNameReservationActiveTab}
        />
      </main>
      <menu className="flex items-center w-full gap-5">
        {name_reservation_tabs?.map((tab: TabType, index: number) => {
          return (
            <Tab
              isOpen={tab?.active}
              steps={tab?.steps}
              key={`${String(index)}-${entry_id}`}
              setActiveStep={setNameReservationActiveStep}
              active_tab={name_reservation_active_tab}
            >
              {/* OWNER DETAILS */}
              <OwnerDetails
                isOpen={name_reservation_active_step?.name === 'owner_details'}
              />

              {/* NAME RESERVATION */}
              <NameReservationSearch
                entry_id={String(entry_id)}
                isOpen={
                  name_reservation_active_step?.name === 'name_reservation'
                }
              />

              {/* NAME RESERVATION SUCCESS */}
              {name_reservation_active_step?.name === 'success' && (
                <NameReservationSuccess entry_id={String(entry_id)} />
              )}
            </Tab>
          );
        })}
      </menu>
    </UserLayout>
  );
};

export default NameReservation;
