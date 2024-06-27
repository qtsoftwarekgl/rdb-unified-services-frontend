import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import { useDeleteBusinessAttachmentMutation } from '@/states/api/coreApiSlice';
import {
  removeBusinessAttachment,
  setDeleteBusinessAttachmentModal,
} from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteBusinessAttachment = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedBusinessAttachment, deleteBusiessAttachmentModal } =
    useSelector((state: RootState) => state.business);

  // INITIALIZE DELETE BUSINESS ATTACHMENT
  const [
    deleteBusinessAttachment,
    {
      isLoading: deleteBusinessAttachmentIsLoading,
      isSuccess: deleteBusinessAttachmentIsSuccess,
      isError: deleteBusinessAttachmentIsError,
      error: deleteBusinessAttachmentError,
    },
  ] = useDeleteBusinessAttachmentMutation();

  // HANDLE DELETE BUSINESS ATTACHMENT RESPONSE
  useEffect(() => {
    if (deleteBusinessAttachmentIsSuccess) {
      dispatch(removeBusinessAttachment(selectedBusinessAttachment));
      dispatch(setDeleteBusinessAttachmentModal(false));
    } else if (deleteBusinessAttachmentIsError) {
      const errorResponse =
        (deleteBusinessAttachmentError as ErrorResponse)?.data?.message ||
        'An error occurred while deleting business attachment. Refresh the page and try again.';
      toast.error(errorResponse);
    }
  }, [
    deleteBusinessAttachmentIsSuccess,
    deleteBusinessAttachmentIsError,
    deleteBusinessAttachmentError,
    dispatch,
    selectedBusinessAttachment,
  ]);

  return (
    <Modal
      isOpen={deleteBusiessAttachmentModal}
      onClose={() => {
        dispatch(setDeleteBusinessAttachmentModal(false));
      }}
    >
      <section className="w-full flex flex-col gap-3">
        <h1 className="text-red-600 uppercase font-medium">
          Delete "{selectedBusinessAttachment?.fileName}"
        </h1>
        <p>
          Are you sure you want to delete{' '}
          <span className="font-medium">
            "{selectedBusinessAttachment?.fileName}"
          </span>{' '}
          of{' '}
          <span className="font-medium">
            {selectedBusinessAttachment?.attachmentType}
          </span>
          ?
        </p>
        <p>This action cannot be undone!</p>
        <menu className="w-full flex items-center gap-3 justify-between mt-4">
          <Button
            value={'Cancel'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteBusinessAttachmentModal(false));
            }}
          />
          <Button
            danger
            value={deleteBusinessAttachmentIsLoading ? <Loader /> : 'Delete'}
            onClick={(e) => {
              e.preventDefault();
              deleteBusinessAttachment({ id: selectedBusinessAttachment?.id });
            }}
          />
        </menu>
      </section>
    </Modal>
  );
};

export default DeleteBusinessAttachment;
