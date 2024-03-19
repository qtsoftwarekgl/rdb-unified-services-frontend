import {
  faBars,
  faChevronCircleLeft,
  faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/inputs/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import {
  setAddReviewCommentsModal,
  setBusinessActiveStep,
  setBusinessActiveTab,
  setListCommentsModal,
} from '../../../states/features/businessRegistrationSlice';
import { Step, TabType } from '../../../states/features/types';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ReviewNavigation = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { business_active_step, business_registration_tabs } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const [showMenu, setShowMenu] = useState(false);

  // HANDLE STEPS NAVIGATION
  const handleNavigation = (direction: string) => {
    const steps = business_registration_tabs?.flatMap(
      (tab: TabType) => tab?.steps
    );
    const activeStepIndex = steps?.findIndex(
      (step: Step) => step?.name === business_active_step?.name
    );
    const nextStep = steps?.[activeStepIndex + 1];
    const prevStep = steps?.[activeStepIndex - 1];

    if (direction === 'next') {
      dispatch(setBusinessActiveStep(nextStep?.name));
      dispatch(setBusinessActiveTab(nextStep?.tab_name));
    } else if (direction === 'prev') {
      dispatch(setBusinessActiveStep(prevStep?.name));
      dispatch(setBusinessActiveTab(prevStep?.tab_name));
    }
  };

  return (
    <section className="left-[17vw] right-0 fixed bottom-4">
      <menu className="flex gap-3 items-center justify-center bg-white w-fit p-5 rounded-md shadow-md mx-auto relative">
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          onClick={(e) => {
            if (business_active_step?.name === 'company_details') {
              return;
            }
            e.preventDefault();
            handleNavigation('prev');
          }}
          className={`${
            business_active_step?.name === 'company_details'
              ? 'text-secondary !cursor-default hover:scale-[1]'
              : 'flex'
          } text-3xl text-primary ease-in-out duration-200 hover:scale-[1.02] cursor-pointer`}
        />
        <ul className="flex items-center gap-3">
          <Button
            value="Recommend for approval"
            primary={business_active_step?.name === 'preview_submission'}
            disabled={business_active_step?.name !== 'preview_submission'}
          />
          <Button value="Decline" danger />
          <Button
            value="Add comment"
            className="!bg-orange-700 !border-none hover:!bg-orange-700 !text-white !hover:!text-white !hover:!border-none"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setAddReviewCommentsModal(true));
            }}
          />
          <section className={`flex flex-col gap-2`}>
            <menu
              className={`${
                showMenu ? 'flex' : 'hidden'
              } flex-col gap-1 absolute bottom-[80px] right-2 bg-white shadow-md rounded-sm`}
            >
              <Link
                className="text-[14px] hover:bg-primary hover:text-white p-2"
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setListCommentsModal(true));
                }}
              >
                View comments
              </Link>
            </menu>
            <FontAwesomeIcon
              icon={faBars}
              className="p-2 cursor-pointer ease-in-out duration-200 hover:scale-[1.02] bg-primary text-white rounded-full"
              onClick={(e) => {
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
            />
          </section>
        </ul>
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          onClick={(e) => {
            if (business_active_step?.name === 'preview_submission') {
              return;
            }
            e.preventDefault();
            handleNavigation('next');
          }}
          className={`${
            business_active_step?.name === 'preview_submission'
              ? 'text-secondary !cursor-default hover:scale-[1]'
              : 'flex'
          } text-3xl text-primary ease-in-out duration-200 hover:scale-[1.02] cursor-pointer`}
        />
      </menu>
    </section>
  );
};

export default ReviewNavigation;
