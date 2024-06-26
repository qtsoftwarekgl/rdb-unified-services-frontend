import {
  faBars,
  faChevronCircleLeft,
  faChevronCircleRight,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/inputs/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import { Step, TabType } from '../../../types/navigationTypes';
import { Link, useNavigate } from 'react-router-dom';
import { FC, useState } from 'react';
import { UnknownAction } from '@reduxjs/toolkit';
import {
  setAddReviewCommentsModal,
  setListReviewCommentsModal,
} from '../../../states/features/userApplicationSlice';
import { ReviewComment } from '../../../components/applications-review/AddReviewComments';
import Loader from '../../../components/Loader';
import moment from 'moment';

interface ExtraProps {
  propName: string;
  propValue: string;
}
interface ReviewNavigationProps {
  tabs: Array<TabType>;
  activeStep: Step;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (string: string) => UnknownAction;
  entryId: string | null;
  last_step: string;
  first_step: string;
  redirectUrl: string;
  setApplication: (object: object) => UnknownAction;
  extraProps?: ExtraProps;
}

const ReviewNavigation: FC<ReviewNavigationProps> = ({
  tabs,
  activeStep,
  setActiveTab,
  setActiveStep,
  entryId,
  last_step,
  first_step,
  setApplication,
  redirectUrl,
  extraProps = { propName: '', propValue: '' },
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState({
    complete_review: false,
    decline: false,
    recommend_approval: false,
    approve: false,
  });

  // This can be used when in set application there is extra props to be set based on the type of data you want to update
  const { propName, propValue } = extraProps;

  // NAVIGATION
  const navigate = useNavigate();

  // HANDLE STEPS NAVIGATION
  const handleNavigation = (direction: string) => {
    const steps = tabs?.flatMap((tab: TabType) => tab?.steps);
    const activeStepIndex = steps?.findIndex(
      (step: Step) => step?.name === activeStep?.name
    );
    const nextStep = steps?.[activeStepIndex + 1];
    const prevStep = steps?.[activeStepIndex - 1];

    if (direction === 'next') {
      dispatch(setActiveStep(nextStep?.name));
      dispatch(setActiveTab(nextStep?.tab_name));
    } else if (direction === 'prev') {
      dispatch(setActiveStep(prevStep?.name));
      dispatch(setActiveTab(prevStep?.tab_name));
    }
  };

  return (
    <section className="left-[17vw] right-0 w-fit mx-auto fixed bottom-4">
      <menu className="relative flex items-center justify-center gap-3 p-5 mx-auto bg-white rounded-md shadow-md w-fit">
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          onClick={(e) => {
            if (
              activeStep?.name.includes(first_step) ||
              activeStep?.name === first_step
            ) {
              return;
            }
            e.preventDefault();
            handleNavigation('prev');
          }}
          className={`${
            activeStep?.name.includes(first_step) ||
            activeStep?.name === first_step
              ? 'text-secondary !cursor-default hover:scale-[1]'
              : 'flex'
          } text-3xl text-primary ease-in-out duration-200 hover:scale-[1.02] cursor-pointer`}
        />
        <ul className="flex items-center gap-3">
          {applicationReviewComments?.filter(
            (comment: ReviewComment) => comment?.entryId === entryId
          )?.length > 0 ? (
            <Button
              value={
                isLoading?.complete_review ? <Loader /> : 'Request changes'
              }
              primary
              disabled={!activeStep?.name.includes(last_step)}
              onClick={(e) => {
                e.preventDefault();
                setIsLoading({ ...isLoading, complete_review: true });
                setTimeout(() => {
                  setIsLoading({ ...isLoading, complete_review: false });
                  dispatch(
                    setApplication({
                      entryId,
                      status: user?.email.includes('infoapprover@rdb')
                        ? 'approved'
                        : 'ACTION_REQUIRED',
                      [propName]: propValue,
                    })
                  );
                  navigate(redirectUrl);
                }, 1000);
              }}
            />
          ) : (
            <Button
              value={
                isLoading?.recommend_approval ? (
                  <Loader />
                ) : user?.email?.includes('infoverifier@rdb') ? (
                  'Recommend for approval'
                ) : (
                  'Approve'
                )
              }
              primary={activeStep?.name.includes(last_step)}
              disabled={
                !activeStep?.name.includes(last_step) ||
                applicationReviewComments?.filter(
                  (comment: ReviewComment) => comment?.entryId === entryId
                )?.length > 0
              }
              onClick={(e) => {
                e.preventDefault();
                setIsLoading({ ...isLoading, recommend_approval: true });
                setTimeout(() => {
                  setIsLoading({ ...isLoading, recommend_approval: false });
                  dispatch(
                    setApplication({
                      entryId,
                      status: user?.email?.includes('infoverifier@rdb')
                        ? 'PENDING_APPROVAL'
                        : 'approved',
                      updatedAt: moment().format(),
                    })
                  );
                  navigate(redirectUrl);
                }, 1000);
              }}
            />
          )}
          <Button
            value={isLoading?.decline ? <Loader color="red-600" /> : 'Decline'}
            danger
            onClick={(e) => {
              e.preventDefault();
              setIsLoading({ ...isLoading, decline: true });
              setTimeout(() => {
                setIsLoading({ ...isLoading, decline: false });
                dispatch(
                  setApplication({
                    entryId,
                    status: 'rejected',
                  })
                );
                navigate(redirectUrl);
              }, 1000);
            }}
          />
          {!activeStep?.name.includes(last_step) ? (
            <Button
              value="Add comment"
              className="!bg-orange-600 !border-none hover:!bg-orange-700 !text-white !hover:!text-white !hover:!border-none"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setAddReviewCommentsModal(true));
              }}
            />
          ) : (
            <Button
              className="!bg-orange-600 !border-none hover:!bg-orange-700 !text-white !hover:!text-white !hover:!border-none"
              value="View comments"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setListReviewCommentsModal(true));
                setShowMenu(false);
              }}
            />
          )}
          <section
            className={`${
              activeStep?.name.includes(last_step) && 'hidden'
            } flex flex-col gap-2`}
          >
            <menu
              className={`${
                showMenu ? 'flex' : 'hidden'
              } flex-col gap-1 absolute bottom-[80px] right-2 bg-background shadow-md rounded-sm`}
            >
              <Link
                className={`hover:bg-primary bg-white hover:text-white p-2`}
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setListReviewCommentsModal(true));
                  setShowMenu(false);
                }}
              >
                View comments
              </Link>
            </menu>
            <FontAwesomeIcon
              icon={showMenu ? faX : faBars}
              className={`${
                showMenu ? 'text-[13px] px-[9px]' : 'text-[14px]'
              } p-2 cursor-pointer ease-in-out duration-200 hover:scale-[1.02] bg-primary text-white rounded-full`}
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
            if (activeStep?.name.includes(last_step)) {
              return;
            }
            e.preventDefault();
            handleNavigation('next');
          }}
          className={`${
            activeStep?.name.includes(last_step)
              ? 'text-secondary !cursor-default hover:scale-[1]'
              : 'flex'
          } text-3xl text-primary ease-in-out duration-200 hover:scale-[1.02] cursor-pointer`}
        />
      </menu>
    </section>
  );
};

export default ReviewNavigation;
