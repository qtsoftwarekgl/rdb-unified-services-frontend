import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import Modal from '../Modal';
import { setUserReviewTabCommentsModal } from '../../states/features/userApplicationSlice';
import { TabType } from '../../types/navigationTypes';
import { FC } from 'react';
import { formatDate } from '../../helpers/strings';
import { ReviewComment } from './AddReviewComments';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from '@/states/features/businessRegistrationSlice';

interface UserReviewTabCommentsProps {
  active_tab: TabType;
}

const UserReviewTabComments: FC<UserReviewTabCommentsProps> = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { userReviewTabCommentsModal, userReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const active_tab =
    userReviewComments?.length > 0 ? userReviewComments[0]?.tab : null;

  return (
    <Modal
      isOpen={userReviewTabCommentsModal}
      onClose={() => {
        dispatch(setUserReviewTabCommentsModal(false));
      }}
    >
      <section className="flex w-full flex-col gap-6 mt-6 max-h-[70vh] overflow-y-scroll pr-4">
        <h1 className="text-lg font-semibold text-center uppercase text-primary">
          {active_tab?.label} Review Comments
        </h1>
        {userReviewComments.map((comment: ReviewComment, index: number) => {
          return (
            <menu
              key={index}
              className="flex items-center justify-between w-full gap-3 p-2 px-4 rounded-md hover:bg-slate-50 hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveTab(comment?.tab?.name));
                dispatch(setBusinessActiveStep(comment?.step?.name));
                dispatch(setUserReviewTabCommentsModal(false));
              }}
            >
              <ul className="flex flex-col gap-1">
                <h3 className="font-semibold uppercase text-primary text-sm">
                  {comment?.step?.label}
                </h3>
                <p className="text-[13px] font-normal">{comment.comment}</p>
                <p className="text-sm">{formatDate(comment.createdAt)}</p>
              </ul>
              <menu className="flex items-center gap2">
                {comment?.checked ? (
                  <p className="text-[12px] p-1 px-2 rounded-md bg-green-600 text-white">Resolved</p>
                ) : (
                  <p className="text-[12px] p-1 px-2 rounded-md bg-red-600 text-white">Pending</p>
                )}
              </menu>
            </menu>
          );
        })}
      </section>
    </Modal>
  );
};

export default UserReviewTabComments;
