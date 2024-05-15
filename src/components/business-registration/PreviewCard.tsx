import { faMessage, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, ReactNode } from 'react';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import { setAddReviewCommentsModal, setUserApplications } from '../../states/features/userApplicationSlice';
import Button from '../inputs/Button';
import { RDBAdminEmailPattern } from '@/constants/Users';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface PreviewCardProps {
  header: string;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (step: string) => UnknownAction;
  children: ReactNode;
  stepName: string;
  tabName: string;
  entry_id?: string | null;
}

const PreviewCard: FC<PreviewCardProps> = ({
  children,
  header,
  setActiveTab,
  setActiveStep,
  stepName,
  tabName,
  entry_id,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
      <menu className="flex items-center justify-between w-full gap-3">
        <Link
          to={'#'}
          onClick={(e) => {
            e.preventDefault();
          }}
          className="text-lg font-semibold uppercase text-primary"
        >
          {header}
        </Link>
        <menu className="flex items-center gap-4">
          {!RDBAdminEmailPattern.test(user?.email) && (
            <FontAwesomeIcon
              icon={faPenToSquare}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setActiveStep(stepName));
                dispatch(setActiveTab(tabName));
                dispatch(
                  setUserApplications({ entry_id, status: 'in_preview' })
                );
              }}
              className="text-primary text-[18px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
            />
          )}
          <Button
            styled={false}
            value={
              <menu className="flex items-center gap-2">
                <p className="text-[12px]">Add comment</p>
                <FontAwesomeIcon className="text-[12px]" icon={faMessage} />
              </menu>
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(setAddReviewCommentsModal(true));
            }}
          />
        </menu>
      </menu>
      <section className="flex flex-col w-full gap-3 my-2">{children}</section>
      {RDBAdminEmailPattern.test(user?.email) && (
        <menu className="flex items-center w-full justify-center">
          <Button
            styled={false}
            onClick={(e) => {
              e.preventDefault();
            
            }}
            value={
              <menu className="flex items-center gap-2 hover:gap-3 transition-all duration-300">
                <p className="text-[13px]">View details</p>
                <FontAwesomeIcon className="text-[13px]" icon={faArrowRight} />
              </menu>
            }
          />
        </menu>
      )}
    </section>
  );
};

export default PreviewCard;
