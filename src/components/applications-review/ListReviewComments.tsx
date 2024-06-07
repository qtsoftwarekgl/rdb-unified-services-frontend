import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../Modal';
import { formatDate } from '../../helpers/strings';
import { ReviewComment } from './AddReviewComments';
import { faCircleCheck, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  setAddReviewCommentsModal,
  setApplicationReviewComments,
  setListReviewCommentsModal,
} from '../../states/features/userApplicationSlice';
import { FC } from 'react';
import { UnknownAction } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';

interface ListReviewCommentsProps {
  entryId: string | null;
  title: string;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (string: string) => UnknownAction;
}

const ListReviewComments: FC<ListReviewCommentsProps> = ({
  entryId,
  title,
  setActiveTab,
  setActiveStep,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { listReviewCommentsModal, applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );

  return (
    <Modal
      isOpen={listReviewCommentsModal}
      onClose={() => {
        dispatch(setListReviewCommentsModal(false));
      }}
    >
      <section className="flex w-full flex-col gap-6 max-h-[70vh] overflow-y-scroll">
        <h1 className="text-lg font-semibold text-center uppercase text-primary">
          {title}
        </h1>
        {applicationReviewComments
          ?.filter((review: ReviewComment) => review?.entryId === entryId)
          ?.map((comment: ReviewComment, index: number) => {
            return (
              <menu
                key={index}
                className={`flex items-center justify-between w-full gap-3 p-2 px-4 rounded-md hover:bg-slate-50`}
              >
                <ul
                  className={`flex flex-col gap-1 ${
                    comment?.checked && '!text-secondary'
                  }`}
                >
                  <h3
                    className={`font-semibold uppercase ${
                      comment?.checked ? 'text-secondary' : 'text-primary'
                    }`}
                  >
                    {comment?.step?.label}
                  </h3>
                  <p className="text-[14px] font-normal">{comment.comment}</p>
                  <p className="text-sm">{formatDate(comment.createdAt)}</p>
                </ul>
                <ul
                  className={`${
                    comment?.checked ? 'hidden' : 'flex'
                  } items-center gap-3`}
                >
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
                          applicationReviewComments.filter(
                            (business_comment: ReviewComment) =>
                              business_comment !== comment
                          )
                        )
                      );
                    }}
                  />
                </ul>
                <Link
                  to={'#'}
                  className={`${
                    comment?.checked ? 'flex' : 'hidden'
                  } items-center gap-2 text-[12px] text-white bg-green-600 p-1 px-2 rounded-md shadow-sm transition-all duration-150 ease-in-out hover:scale-[1.02]`}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      setApplicationReviewComments(
                        applicationReviewComments?.filter(
                          (business_comment: ReviewComment) =>
                            business_comment !== comment
                        )
                      )
                    );
                  }}
                >
                  Approve
                  <FontAwesomeIcon
                    className="text-[12px]"
                    icon={faCircleCheck}
                  />
                </Link>
              </menu>
            );
          })}
      </section>
    </Modal>
  );
};

export default ListReviewComments;
