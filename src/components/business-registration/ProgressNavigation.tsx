import { Link } from 'react-router-dom';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import { TabType } from '../../types/navigationTypes';
import { UnknownAction } from '@reduxjs/toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

interface Props {
  tabs: TabType[];
  setActiveTab: (tab: string) => UnknownAction;
}

const ProgressNavigation = ({ tabs, setActiveTab }: Props) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  return (
    <nav className="flex items-center gap-4 bg-white h-fit py-[5px] rounded-md shadow-sm w-full justify-evenly px-4">
      {tabs.map((tab: TabType, index: number, arr: Array<TabType>) => {
        return (
          <Link
            key={Number(index)}
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setActiveTab(tab?.name));
            }}
            className={`step rounded-none w-full h-full py-[6px] px-2 flex text-center items-center justify-center gap-4 cursor-pointer hover:bg-primary hover:!rounded-md hover:text-white ${
              index < arr.length - 1 && 'border-r border-gray-500'
            } ${tab?.active && 'bg-primary text-white !rounded-md'} ${tab?.completed && '!rounded-md !border-none'}`}
          >
            <h1 className="text-[14px] tab-name flex items-center gap-2">
              {tab?.completed && (
                <FontAwesomeIcon
                  className="text-primary size-4"
                  icon={faCircleCheck}
                />
              )}{' '}
              {tab?.label}
            </h1>
          </Link>
        );
      })}
    </nav>
  );
};

export default ProgressNavigation;
