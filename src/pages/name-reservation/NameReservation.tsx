import UserLayout from '../../containers/UserLayout';
import OwnerDetails from './OwnerDetails';
import NameReservationSearch from './NameReservationSearch';
import NameReservationSuccess from './NameReservationSuccess';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { capitalizeString } from '@/helpers/strings';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';

const NameReservation = () => {
  const [navigationTabs] = useState([
    {
      name: 'owner_details',
      active: true,
      steps: 1,
    },
    {
      name: 'name_reservation',
      active: false,
      steps: 2,
    },
    {
      name: 'success',
      active: false,
      steps: 3,
    },
  ]);
  // const [activeTab, setActiveTab] = useState(navigationTabs[0]);
  const {name_reservation_active_step: activeTab} = useSelector((state: RootState) => state.nameReservation);

  return (
    <UserLayout>
      <main className="w-full p-6 rounded-md bg-white flex flex-col gap-5">
        <nav className="w-full flex items-center gap-3 my-4">
          {navigationTabs?.map((navigationTab, index) => {
            const isActive = navigationTab?.name === activeTab?.name;
            return (
              <Link
                to={'#'}
                key={index}
                className={`${
                  isActive && 'bg-primary text-white'
                } w-full flex items-center justify-center rounded-md text-center py-2`}
                onClick={(e) => {
                  e.preventDefault();
                  // dispatch(setNameReservationActiveTab(navigationTab.name));
                  // dispatch(setNameReservationActiveStep(navigationTab.name));
                  // setActiveTab(navigationTab);
                }}
              >
                {capitalizeString(navigationTab?.name)}
              </Link>
            );
          })}
        </nav>
        <menu className="flex items-center w-full gap-5 my-5">
          {/* OWNER DETAILS */}
          <OwnerDetails isOpen={activeTab?.name === 'owner_details'} />

          {/* NAME RESERVATION */}
          <NameReservationSearch
            isOpen={activeTab?.name === 'name_reservation'}
          />

          {/* NAME RESERVATION SUCCESS */}
          {activeTab?.name === 'success' && <NameReservationSuccess />}
        </menu>
      </main>
    </UserLayout>
  );
};

export default NameReservation;
