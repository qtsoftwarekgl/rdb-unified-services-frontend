import { AppDispatch, RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import { formatDate } from "../../helpers/Strings";
import { ReviewComment } from "./AddReviewComments";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  setAddReviewCommentsModal,
  setApplicationReviewComments,
  setListReviewCommentsModal,
} from "../../states/features/userApplicationSlice";
import { FC } from "react";
import { UnknownAction } from "@reduxjs/toolkit";

interface ListReviewCommentsProps {
  entry_id: string | null;
  title: string;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (string: string) => UnknownAction;
}

const ListReviewComments: FC<ListReviewCommentsProps> = ({
  entry_id,
  title,
  setActiveTab,
  setActiveStep,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { listReviewCommentsModal, application_review_comments } = useSelector(
    (state: RootState) => state.userApplication
  );

  return (
    <Modal
      isOpen={listReviewCommentsModal}
      onClose={() => {
        dispatch(setListReviewCommentsModal(false));
      }}
    >
      <section className="flex w-full flex-col gap-6 mt-6 max-h-[70vh] overflow-y-scroll pr-4">
        <h1 className="text-lg font-semibold text-center uppercase text-primary">
          {title}
        </h1>
        {application_review_comments
          ?.filter((review: ReviewComment) => review?.entry_id === entry_id)
          ?.map((comment: ReviewComment, index: number) => {
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
                <ul className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="text-[15px] text-white bg-primary p-2 rounded-full cursor-pointer ease-in-out duration-150 hover:scale-[1.02]"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setActiveTab(comment?.tab?.name));
                      dispatch(setActiveStep(comment?.step?.name));
                      dispatch(setAddReviewCommentsModal(true));
                      dispatch(setListReviewCommentsModal(false));
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="p-[6.5px] px-2 text-[16px] rounded-full bg-red-600 text-white cursor-pointer ease-in-out duration-150 hover:scale-[1.02]"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        setApplicationReviewComments(
                          application_review_comments.filter(
                            (business_comment: ReviewComment) =>
                              business_comment !== comment
                          )
                        )
                      );
                    }}
                  />
                </ul>
              </menu>
            );
          })}
      </section>
    </Modal>
  );
};

export default ListReviewComments;
