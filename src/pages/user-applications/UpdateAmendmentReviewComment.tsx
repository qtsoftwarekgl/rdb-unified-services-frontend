import Button from '@/components/inputs/Button';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import { useUpdateAmendmentReviewCommentStatusMutation } from '@/states/api/businessRegApiSlice';
import {
    setSelectedAmendmentReviewComment,
  setUpdateAmendmentReviewCommentModal,
  updateAmendmentReviewComment,
} from '@/states/features/businessAmendmentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateAmendmentReviewComment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateAmendmentReviewCommentModal, selectedAmendmentReviewComment } =
    useSelector((state: RootState) => state.businessAmendment);

    // INITIALIZE UPDATE REVIEW COMMENT STATUS MUTATION
    const [updateAmendmentReviewCommentStatus, {
        isLoading: isUpdatingAmendmentReviewCommentStatus,
        isSuccess: isAmendmentReviewCommentStatusUpdated,
        isError: isAmendmentReviewCommentStatusUpdateError,
        error: amendmentReviewCommentStatusUpdateError,
        reset: resetUpdateAmendmentReviewCommentStatus,
        data: updatedAmendmentReviewCommentStatusData,
    }] = useUpdateAmendmentReviewCommentStatusMutation();

    // HANDLE UPDATE REVIEW COMMENT STATUS RESPONSE
    useEffect(() => {
      if (isAmendmentReviewCommentStatusUpdated) {
        toast.success('Amendment Review Comment Status Updated Successfully');
        dispatch(
          updateAmendmentReviewComment(
            updatedAmendmentReviewCommentStatusData?.data
          )
        );
        dispatch(setSelectedAmendmentReviewComment(undefined));
        resetUpdateAmendmentReviewCommentStatus();
        dispatch(setUpdateAmendmentReviewCommentModal(false));
      }
      if (isAmendmentReviewCommentStatusUpdateError) {
        const errorResponse =
          (amendmentReviewCommentStatusUpdateError as ErrorResponse)?.data
            ?.message ||
          'An error occurred while updating Amendment Review Comment Status';
        toast.error(errorResponse);
      }
      return () => {
        resetUpdateAmendmentReviewCommentStatus();
      };
    }, [
      isAmendmentReviewCommentStatusUpdated,
      isAmendmentReviewCommentStatusUpdateError,
      updatedAmendmentReviewCommentStatusData,
      amendmentReviewCommentStatusUpdateError,
      resetUpdateAmendmentReviewCommentStatus,
      dispatch,
    ]);

    return (
      <Modal
        isOpen={updateAmendmentReviewCommentModal}
        onClose={() => {
          dispatch(setUpdateAmendmentReviewCommentModal(false));
        }}
        heading={`Update Amendment Review Comment`}
      >
        Make sure you have attended to the comments before resolving the review.
        This action cannot be undone.
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button value={'Cancel'} onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedAmendmentReviewComment(undefined));
            dispatch(setUpdateAmendmentReviewCommentModal(false));
          }} />
          <Button
            className="!bg-green-600 !text-white hover:!bg-green-600 !border-none"
            value={
              isUpdatingAmendmentReviewCommentStatus ? <Loader /> : 'Resolve'
            }
            onClick={(e) => {
              e.preventDefault();
              updateAmendmentReviewCommentStatus({
                id: selectedAmendmentReviewComment?.id,
                status: 'RESOLVED',
              });
            }}
          />
        </menu>
      </Modal>
    );
};

export default UpdateAmendmentReviewComment;
