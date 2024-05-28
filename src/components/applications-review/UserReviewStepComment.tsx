import { useDispatch, useSelector } from 'react-redux';
import Modal from '../Modal';
import { AppDispatch, RootState } from '@/states/store';
import {
  setApplicationReviewComments,
  setUserReviewStepCommentModal,
  updateReviewComment,
  updateUserReviewComment,
} from '@/states/features/userApplicationSlice';
import { formatDate } from '@/helpers/strings';
import Button from '../inputs/Button';
import { useState } from 'react';
import Loader from '../Loader';
import { ReviewComment } from './AddReviewComments';
import { RDBAdminEmailPattern } from '@/constants/Users';

const UserReviewStepComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    userReviewStepCommentModal,
    applicationReviewComment,
    applicationReviewComments,
  } = useSelector((state: RootState) => state.userApplication);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Modal
      isOpen={userReviewStepCommentModal}
      onClose={() => {
        dispatch(setUserReviewStepCommentModal(false));
      }}
    >
      <menu className="flex flex-col gap-2">
        <h1
          className={`font-medium uppercase text-primary text-md ${
            applicationReviewComment?.checked && '!text-green-600'
          }`}
        >
          Comment{' '}
          {applicationReviewComment?.checked ? '(Resolved)' : '(Unresolved)'}:
        </h1>
        <p className="text-[14px]">{applicationReviewComment?.comment}</p>
        <p className="text-[12px] text-secondary">
          Date added: {formatDate(applicationReviewComment?.createdAt)}
        </p>
      </menu>
      <menu className={`w-full flex items-center gap-3 justify-between`}>
        <Button
          value={'Cancel'}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setUserReviewStepCommentModal(false));
          }}
        />
        {!applicationReviewComment?.checked && (
          <Button
            value={isLoading ? <Loader /> : 'Mark as resolved'}
            primary
            onClick={(e) => {
              e.preventDefault();
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                dispatch(
                  updateReviewComment({
                    ...applicationReviewComment,
                    checked: true,
                  })
                );
                dispatch(
                  updateUserReviewComment({
                    ...applicationReviewComment,
                    checked: true,
                  })
                );
              }, 1000);
              dispatch(setUserReviewStepCommentModal(false));
            }}
          />
        )}
        {applicationReviewComment?.checked &&
          RDBAdminEmailPattern.test(user?.email) && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  dispatch(
                    setApplicationReviewComments(
                      applicationReviewComments?.filter(
                        (comment: ReviewComment) =>
                          comment?.step?.name ===
                            applicationReviewComment?.step?.name &&
                          comment !== applicationReviewComment
                      )
                    )
                  );
                }, 1000);
                dispatch(setUserReviewStepCommentModal(false));
              }}
              primary
              className="!bg-green-600 hover:!bg-green-600 !border-none"
              value={isLoading ? <Loader color="white" /> : 'Approve'}
            />
          )}
      </menu>
    </Modal>
  );
};

export default UserReviewStepComment;
