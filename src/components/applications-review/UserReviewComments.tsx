import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/store";
import Modal from "../Modal";
import {
  setUserReviewCommentsModal,
  updateReviewComment,
  updateUserReviewComment,
} from "../../states/features/userApplicationSlice";
import { TabType } from "../../states/features/types";
import { FC } from "react";
import { formatDate } from "../../helpers/strings";
import { ReviewComment } from "./AddReviewComments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";

interface UserReviewCommentsProps {
  active_tab: TabType;
}

const UserReviewComments: FC<UserReviewCommentsProps> = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { userReviewCommentsModal, user_review_comments } = useSelector(
    (state: RootState) => state.userApplication
  );
  const active_tab =
    user_review_comments?.length > 0 ? user_review_comments[0]?.tab : null;

  return (
    <Modal
      isOpen={userReviewCommentsModal}
      onClose={() => {
        dispatch(setUserReviewCommentsModal(false));
      }}
    >
      <section className="flex w-full flex-col gap-6 mt-6 max-h-[70vh] overflow-y-scroll pr-4">
        <h1 className="text-lg font-semibold text-center uppercase text-primary">
          {active_tab?.label} Review Comments
        </h1>
        {user_review_comments.map((comment: ReviewComment, index: number) => {
          return (
            <menu
              key={index}
              className="flex items-center justify-between w-full gap-3 p-2 px-4 rounded-md hover:bg-slate-50"
            >
              <ul className="flex flex-col gap-1">
                <h3 className="font-semibold uppercase text-primary">
                  {comment?.step?.label}
                </h3>
                <p className="text-[14px] font-normal">{comment.comment}</p>
                <p className="text-sm">{formatDate(comment.created_at)}</p>
              </ul>
              <menu className="flex items-center gap2">
                <FontAwesomeIcon
                  icon={comment?.checked ? faCircleCheck : faCheckDouble}
                  className="w-3 h-3 p-2 text-white transition-all duration-200 ease-in-out rounded-full cursor-pointer hover:scale-102 bg-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      updateReviewComment({ ...comment, checked: true })
                    );
                    dispatch(
                      updateUserReviewComment({ ...comment, checked: true })
                    );
                    dispatch(
                      updateReviewComment({ ...comment, checked: true })
                    );
                  }}
                />
              </menu>
            </menu>
          );
        })}
      </section>
    </Modal>
  );
};

export default UserReviewComments;
