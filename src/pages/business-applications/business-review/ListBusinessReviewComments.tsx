import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import { formatDate, removeArrayDuplicates } from '@/helpers/strings';
import {
  setDeleteBusinessReviewCommentModal,
  setListBusinessReviewCommentsModal,
  setSelectedBusinessReviewComment,
  setUpdateBusinessReviewCommentModal,
  updateBusinessReviewCommentStatusThunk,
} from '@/states/features/businessReviewCommentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BusinessReviewComment } from '@/types/models/businessReviewComment';
import {
  faCircleCheck,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ListBusinessReviewComments = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    listBusinessReviewCommentsModal,
    businessReviewCommentsList,
    updateBusinessReviewCommentIsLoading,
    updateBusinessReviewCommentIsSuccess,
  } = useSelector((state: RootState) => state.businessReviewComment);
  const { business } = useSelector((state: RootState) => state.business);
  const { selectedBusinessNavigationFlow } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const [reviewComments, setReviewComments] = useState(
    businessReviewCommentsList?.filter(
      (businessReviewComment) =>
        businessReviewComment?.navigationFlow?.id ===
        selectedBusinessNavigationFlow?.id
    )
  );

  useEffect(() => {
    setReviewComments(
      removeArrayDuplicates(
        businessReviewCommentsList?.filter(
          (businessReviewComment) =>
            businessReviewComment?.navigationFlow?.id ===
            selectedBusinessNavigationFlow?.id
        )
      ) as BusinessReviewComment[]
    );
  }, [businessReviewCommentsList, selectedBusinessNavigationFlow]);

  useEffect(() => {
    if (reviewComments?.length === 0) {
      dispatch(setListBusinessReviewCommentsModal(false));
    }
  }, [dispatch, reviewComments]);

  // HANDLE UPDATE BUSINESS REVIEW COMMENT STATUS SUCCESS
  useEffect(() => {
    if (updateBusinessReviewCommentIsSuccess && reviewComments?.length === 0) {
      dispatch(setListBusinessReviewCommentsModal(false));
    }
  }, [dispatch, reviewComments?.length, updateBusinessReviewCommentIsSuccess]);

  return (
    <Modal
      isOpen={listBusinessReviewCommentsModal}
      onClose={() => {
        dispatch(setListBusinessReviewCommentsModal(false));
      }}
      heading={`Review Comments for ${selectedBusinessNavigationFlow?.navigationFlowMass?.stepName}`}
      className="min-w-[40vw]"
    >
      {reviewComments?.map((reviewComment) => {
        return (
          <menu
            key={reviewComment?.id}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md shadow-sm"
          >
            <article className="w-full flex flex-col gap-3">
              <p className="text-[14px]">
                {reviewComment?.comment}{' '}
                <span className="text-[14px] font-medium text-green-700">
                  {reviewComment?.status === 'RESOLVED'
                    ? '(Marked as resolved)'
                    : ''}
                </span>
                <span className='text-[14px] font-medium text-red-700'>
                  {reviewComment?.status === 'REJECTED' ? '(Marked as rejected)' : ''}
                  </span>
              </p>
              <ul className="flex flex-col gap-2">
                <p className="text-secondary text-[13px]">
                  Created by: {reviewComment?.createdBy?.fullName}
                </p>
                <p className="text-secondary text-[13px]">
                  Date added: {formatDate(reviewComment?.createdAt)}
                </p>
              </ul>
            </article>
            <figure className="flex flex-col gap-2">
              {reviewComment?.status === 'UNRESOLVED' &&
                ['ACTION_REQUIRED'].includes(business?.applicationStatus) && (
                  <CustomTooltip label="Mark as resolved">
                    {updateBusinessReviewCommentIsLoading ? (
                      <Loader className="text-primary" />
                    ) : (
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(
                            updateBusinessReviewCommentStatusThunk({
                              id: reviewComment?.id,
                              status: 'RESOLVED',
                            })
                          );
                        }}
                        className="h-4 w-4 bg-primary text-white rounded-full p-2 cursor-pointer transition-all ease-in-out duration-300 hover:scale-[1.03]"
                        icon={faCircleCheck}
                      />
                    )}
                  </CustomTooltip>
                )}
              {reviewComment?.status === 'UNRESOLVED' &&
                ['IN_REVIEW'].includes(business?.applicationStatus) && (
                  <FontAwesomeIcon
                    className="h-4 w-4 bg-primary text-white rounded-full p-2 cursor-pointer transition-all ease-in-out duration-300 hover:scale-[1.03]"
                    icon={faPenToSquare}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setSelectedBusinessReviewComment(reviewComment));
                      dispatch(setListBusinessReviewCommentsModal(false));
                      dispatch(setUpdateBusinessReviewCommentModal(true));
                    }}
                  />
                )}
              {reviewComment?.status === 'UNRESOLVED' &&
                ['IN_REVIEW'].includes(business?.applicationStatus) && (
                  <FontAwesomeIcon
                    className="h-4 w-4 bg-red-600 text-white rounded-full p-2 cursor-pointer transition-all ease-in-out duration-300 hover:scale-[1.03]"
                    icon={faTrash}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setSelectedBusinessReviewComment(reviewComment));
                      dispatch(setListBusinessReviewCommentsModal(false));
                      dispatch(setDeleteBusinessReviewCommentModal(true));
                    }}
                  />
                )}
            </figure>
          </menu>
        );
      })}
    </Modal>
  );
};

export default ListBusinessReviewComments;
