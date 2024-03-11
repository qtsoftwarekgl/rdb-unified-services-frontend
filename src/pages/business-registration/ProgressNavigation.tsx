import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  RegistrationTab,
  setActiveTab,
} from '../../states/features/businessRegistrationSlice';

const ProgressNavigation = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { registration_tabs } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  return (
    <nav className="flex items-center gap-4 bg-white h-fit py-[5px] rounded-md shadow-sm w-full justify-evenly px-4">
      {registration_tabs.map((tab: RegistrationTab, index: number) => {
        return (
          <Link
            key={Number(index)}
            to={'#'}
            onClickCapture={(e) => {
              e.preventDefault();
              dispatch(setActiveTab(tab?.name));
            }}
            className={`step w-full h-full py-[6px] flex items-center justify-center gap-4 cursor-pointer hover:bg-primary hover:text-white hover:bg-opacity-90 rounded-md ${
              tab?.active && 'bg-primary text-white'
            }`}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <h1 className="text-[14px] tab-name">{tab?.label}</h1>
          </Link>
        );
      })}
    </nav>
  );
};

export default ProgressNavigation;
