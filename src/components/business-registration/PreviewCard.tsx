import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, ReactNode } from 'react';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';

interface PreviewCardProps {
  header: string;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (step: string) => UnknownAction;
  children: ReactNode;
  stepName: string;
  tabName: string;
}

const PreviewCard: FC<PreviewCardProps> = ({
  children,
  header,
  setActiveTab,
  setActiveStep,
  stepName,
  tabName,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  return (
    <section className="flex w-full flex-col gap-3">
      <menu className="w-full flex items-center gap-3 justify-between">
        <h2 className="uppercase text-lg text-primary font-semibold">{header}</h2>
        <FontAwesomeIcon
          icon={faPenToSquare}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setActiveStep(stepName));
            dispatch(setActiveTab(tabName));
          }}
          className='text-primary text-[18px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]'
        />
      </menu>
      <section className="w-full flex flex-col gap-3 my-2">{children}</section>
    </section>
  );
};

export default PreviewCard;
