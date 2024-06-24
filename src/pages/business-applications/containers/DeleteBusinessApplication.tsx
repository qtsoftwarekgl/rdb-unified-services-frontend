import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import { formatDate } from '@/helpers/strings';
import { useDeleteBusinessMutation } from '@/states/api/businessRegApiSlice';
import { setDeleteApplicationModal } from '@/states/features/businessRegistrationSlice';
import { setBusinessesList, setDeleteBusinessModal } from '@/states/features/businessSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteBusinessApplication = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteBusinessModal, selectedBusiness, businessesList } = useSelector(
    (state: RootState) => state.business
  );

  // INITIALIZE DELETE BUSINESS APPLICATION
  const [
    deleteBusiness,
    {
      data: deleteBusinessData,
      error: deleteBusinessError,
      isLoading: deleteBusinessIsLoading,
      isError: deleteBusinessIsError,
      isSuccess: deleteBusinessIsSuccess,
    },
  ] = useDeleteBusinessMutation();

  // HANDLE DELETE BUSINESS APPLICATION RESPONSE
  useEffect(() => {
    if (deleteBusinessIsError) {
      if ((deleteBusinessError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while deleting business application');
      } else {
        toast.error((deleteBusinessError as ErrorResponse)?.data?.message);
      }
    } else if (deleteBusinessIsSuccess) {
      toast.success('Business application deleted successfully');
      dispatch(setDeleteBusinessModal(false));
      dispatch(
        setBusinessesList(
          businessesList.filter((b) => b.id !== selectedBusiness.id)
        )
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deleteBusinessData,
    deleteBusinessError,
    deleteBusinessIsError,
    deleteBusinessIsSuccess,
    dispatch,
    selectedBusiness.id,
  ]);

  return (
    <Modal
      isOpen={deleteBusinessModal}
      onClose={() => {
        dispatch(setDeleteBusinessModal(false));
      }}
    >
      <h1 className="text-start text-red-600 uppercase font-semibold text-[16px]">
        Discard {selectedBusiness?.companyName || 'N/A'}
      </h1>
      <p className="max-w-[80%]">
        Are you sure you want to discard the following application?
      </p>
      <menu className="flex flex-col gap-3">
        <p>
          Name:{' '}
          <span className="uppercase">
            {selectedBusiness?.companyName || 'N/A'}
          </span>
        </p>
        <p>Date Started: {formatDate(selectedBusiness.createdAt)}</p>
      </menu>
      <p className="text-red-600 font-medium"> This action cannot be undone!</p>
      <menu className="flex items-center gap-3 justify-between">
        <Button
          value="Cancel"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setDeleteApplicationModal(false));
          }}
        />
        <Button
          value={deleteBusinessIsLoading ? <Loader color="white" /> : 'Confirm'}
          danger
          onClick={(e) => {
            e.preventDefault();
            deleteBusiness({ id: selectedBusiness.id });
          }}
        />
      </menu>
    </Modal>
  );
};

export default DeleteBusinessApplication;
