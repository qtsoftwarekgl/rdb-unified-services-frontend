import { Link } from 'react-router-dom';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import { TabType } from '../../states/features/types';
import { UnknownAction } from '@reduxjs/toolkit';

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
            onClickCapture={(e) => {
              e.preventDefault();
              dispatch(setActiveTab(tab?.name));
            }}
            className={`step w-full h-full py-[6px] flex text-center items-center justify-center gap-4 cursor-pointer hover:bg-primary hover:!rounded-md hover:text-white hover:bg-opacity-90 rounded-md ${
              tab?.active && 'bg-primary text-white !rounded-md'
            } ${
              index < arr.length - 1 && 'border-r border-gray-300 !rounded-none'
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
