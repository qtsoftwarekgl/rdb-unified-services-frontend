import { FC, ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import { Step, TabType } from '../../types/navigationTypes';
import { ReviewComment } from '../applications-review/AddReviewComments';
import {
  setAddReviewCommentsModal,
  setApplicationReviewComment,
  setUserReviewStepCommentModal,
} from '@/states/features/userApplicationSlice';
import { RDBAdminEmailPattern } from '@/constants/Users';
import { faMessage } from '@fortawesome/free-regular-svg-icons';

interface TabProps {
  steps: Array<Step>;
  isOpen: boolean;
  children: ReactNode;
  setActiveStep: (step: string) => UnknownAction;
  active_tab?: TabType;
}

const Tab: FC<TabProps> = ({
  steps,
  isOpen,
  children,
  active_tab,
  setActiveStep,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { user } = useSelector((state: RootState) => state.user);

  // HANDLE RENDER
  useEffect(() => {
    if (isOpen && steps?.length > 0) {
      dispatch(
        setActiveStep(
          steps?.find(
            (step) =>
              step?.tab_name === active_tab?.name && step?.active === true
          )?.name ||
            steps?.find((step: Step) => !step?.completed)?.name ||
            steps[0]?.name
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isOpen]);
  const active_step = steps?.find((step) => step?.active);

  if (!isOpen) return null;

  // UNRESOLVED COMMENTS
  const stepUnresolvedComments = applicationReviewComments.filter(
    (comment: ReviewComment) =>
      comment?.step?.name === active_step?.name && !comment.checked
  )?.length;

  // RESOLVED COMMENTS
  const stepResolvedComments = applicationReviewComments.filter(
    (comment: ReviewComment) =>
      comment?.step?.name === active_step?.name && comment?.checked
  )?.length;

  return (
    <section className="flex items-start w-full p-6 bg-white rounded-md shadow-sm">
      <aside
        className={`${
          steps && steps?.length > 1 ? 'flex' : 'hidden'
        } flex-col gap-2 w-[20%] p-3 px-4 rounded-md`}
      >
        {steps?.map((step: Step, index: number, arr: Array<Step>) => {
          return (
            <Link
              to={'#'}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setActiveStep(step?.name));
              }}
              className="flex items-start w-full gap-4"
            >
              <figure className="flex flex-col gap-1 items-center max-w-[10%]">
                {step?.completed ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="py-[8px] px-[9px] text-white rounded-full bg-primary"
                  />
                ) : (
                  <p
                    className={`text-[15px] h-[30px] w-[30px] flex items-center justify-center rounded-full bg-white text-secondary font-semibold ${
                      step?.active && '!text-white !bg-primary'
                    }`}
                  >
                    {String(index + 1)}
                  </p>
                )}
                <hr
                  className={`border-l-[.5px] w-0 border-secondary h-8 ${
                    index === arr?.length - 1 && 'hidden'
                  }`}
                />
              </figure>
              <menu className="flex items-center justify-between gap-3">
                <h4 className="font-medium text-[15px] mt-[5px]">
                  {step?.label}
                </h4>
                {step?.active && (
                  <hr className="border-[1px] border-primary font-bold text-primary h-full min-h-[25px]" />
                )}
              </menu>
            </Link>
          );
        })}
      </aside>
      <menu
        className={`flex flex-col gap-3 h-full p-4 ${
          steps?.length <= 1 ? '!w-[90%] mx-auto' : 'w-[80%]'
        }`}
      >
        <menu className="relative flex items-center justify-between gap-3 w-full">
          <h1 className="min-w-[70%] w-full text-lg font-semibold text-center uppercase">
            {active_step?.label}
          </h1>
          {RDBAdminEmailPattern.test(user?.email) &&
            stepUnresolvedComments <= 0 &&
            stepResolvedComments <= 0 &&
            active_step?.name !== 'preview_submission' && (
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setAddReviewCommentsModal(true));
                }}
                className="flex items-center gap-2 p-0 transition-all ease-in-out hover:scale-[1.01] text-primary"
              >
                <p className="text-[13px]">Add comment</p>
                <FontAwesomeIcon className="text-[13px]" icon={faMessage} />
              </Link>
            )}
          {(stepUnresolvedComments > 0 || stepResolvedComments > 0) && (
            <menu className="flex relative flex-col gap-3 w-full px-2">
              {stepUnresolvedComments > 0 && (
                <Link
                  to={'#'}
                  onClick={(e) => {
                    e.preventDefault();
                      dispatch(setUserReviewStepCommentModal(true));
                      dispatch(
                        setApplicationReviewComment(
                          applicationReviewComments?.find(
                            (comment: ReviewComment) =>
                              comment?.step?.name === active_step?.name &&
                              !comment.checked
                          )
                        )
                      );
                  }}
                  className="bg-red-600 text-white rounded-md p-1 px-2 w-fit flex items-center gap-2 self-end"
                >
                  <p className="text-[12px]">
                    {stepUnresolvedComments} requested change. Click to view
                  </p>
                </Link>
              )}
              {stepResolvedComments > 0 && stepUnresolvedComments <= 0 && (
                <Link
                  to={'#'}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setUserReviewStepCommentModal(true));
                    dispatch(
                      setApplicationReviewComment(
                        applicationReviewComments?.find(
                          (comment: ReviewComment) =>
                            comment?.step?.name === active_step?.name &&
                            comment.checked
                        )
                      )
                    );
                  }}
                  className="text-[12px] p-1 px-2 rounded-md bg-green-600 text-white w-fit"
                >
                  {stepResolvedComments} comment resolved
                </Link>
              )}
            </menu>
          )}
        </menu>
        <section className="w-full p-4">{children}</section>
      </menu>
    </section>
  );
};

export default Tab;
