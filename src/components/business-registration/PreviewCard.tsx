import { faMessage, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faMessage as solidFaMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, ReactNode, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import {
  setAddReviewCommentsModal,
  setApplicationReviewComment,
  setUserApplications,
  setUserReviewStepCommentModal,
} from '../../states/features/userApplicationSlice';
import Button from '../inputs/Button';
import { RDBAdminEmailPattern } from '@/constants/Users';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {
  setApplicationReviewStepName,
  setApplicationReviewTabName,
} from '@/states/features/applicationReviewSlice';
import { ReviewComment } from '../applications-review/AddReviewComments';

interface PreviewCardProps {
  header: string;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (step: string) => UnknownAction;
  children: ReactNode;
  stepName: string;
  tabName: string;
  entry_id?: string | null;
  status: string;
}

const PreviewCard: FC<PreviewCardProps> = ({
  children,
  header,
  setActiveTab,
  setActiveStep,
  stepName,
  tabName,
  entry_id,
  status,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const [existingComments, setExistingComments] = useState<Array<object>>([]);
  const [showCommentActions, setShowCommentActions] = useState<boolean>(false);

  // CHECK IF CURRENT CARD HAS COMMENTS
  useEffect(() => {
    setExistingComments(
      applicationReviewComments.filter(
        (comment: ReviewComment) =>
          comment?.step.name === stepName &&
          comment?.tab.name === tabName &&
          comment?.entry_id === entry_id
      )
    );
  }, [applicationReviewComments, entry_id, stepName, tabName]);

  // ADD/UPDATE COMMENT
  const handleAddComment = () => {
    dispatch(setAddReviewCommentsModal(true));
    dispatch(setApplicationReviewStepName(stepName));
    dispatch(setApplicationReviewTabName(tabName));
    setShowCommentActions(false);
  };

  return (
    <section
      className={`flex flex-col w-full gap-3 p-4 rounded-md shadow-sm ${
        existingComments?.filter((comment) => !comment.checked)?.length > 0
          ? 'border-red-600 border-[1px]'
          : 'border-primary border-[.3px]'
      }`}
    >
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
        <menu className="flex items-center gap-4 relative">
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
          {RDBAdminEmailPattern.test(user?.email) && (
            <Button
              styled={false}
              value={
                <menu className="flex items-center gap-2">
                  <p className="text-[12px]">
                    {!existingComments?.length && 'Add comment'}
                    {existingComments?.length > 0 &&
                      `${existingComments?.length} comment`}
                  </p>
                  <FontAwesomeIcon
                    className="text-[12px]"
                    icon={existingComments?.length ? solidFaMessage : faMessage}
                  />
                </menu>
              }
              onClick={(e) => {
                e.preventDefault();
                existingComments?.length <= 0
                  ? handleAddComment()
                  : setShowCommentActions(!showCommentActions);
              }}
            />
          )}
          {showCommentActions && (
            <ul className="flex flex-col gap-1 bg-white rounded-sm shadow-md absolute top-8 w-full z-[10000]">
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setUserReviewStepCommentModal(true));
                  dispatch(
                    setApplicationReviewComment(
                      applicationReviewComments?.find(
                        (comment: ReviewComment) =>
                          comment?.step?.name === stepName
                      )
                    )
                  );
                  setShowCommentActions(false);
                }}
                className="p-1 px-2 text-[13px] hover:bg-primary hover:text-white"
              >
                View
              </Link>
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddComment();
                }}
                className="p-1 px-2 text-[13px] hover:bg-primary hover:text-white"
              >
                Update
              </Link>
            </ul>
          )}
        </menu>
      </menu>
      <section className="flex flex-col w-full gap-3 my-2">{children}</section>
      {RDBAdminEmailPattern.test(user?.email) && (
        <menu className="flex items-center w-full justify-center">
          <Button
            styled={false}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setActiveStep(stepName));
              dispatch(setActiveTab(tabName));
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
      {!RDBAdminEmailPattern.test(user?.email) &&
        existingComments?.filter((comment) => !comment.checked)?.length > 0 &&
        status === 'action_required' && (
          <menu className="flex items-center w-full justify-center">
            <Button
              styled={false}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setActiveStep(stepName));
                dispatch(setActiveTab(tabName));
              }}
              value={
                <menu className="flex items-center gap-2 hover:gap-3 transition-all duration-300 bg-red-600 p-1 px-2 rounded-md">
                  <p className="text-[13px] text-white">View comments</p>
                  <FontAwesomeIcon
                    className="text-[13px] text-white"
                    icon={faArrowRight}
                  />
                </menu>
              }
            />
          </menu>
        )}
    </section>
  );
};

export default PreviewCard;
