import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import { useDeleteBusinessFounderMutation } from '@/states/api/businessRegApiSlice';
import { removeBoardMember } from '@/states/features/boardOfDirectorSlice';
import {
  setBusinessPerson,
  setSelectedBusinessPerson,
} from '@/states/features/businessPeopleSlice';
import { setBusinessPersonDetailsModal } from '@/states/features/businessRegistrationSlice';
import { removeExecutiveManager } from '@/states/features/executiveManagerSlice';
import {
  setDeleteFounderModal,
  setSelectedFounderDetail,
} from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteBusinessFounder = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteFounderModal, selectedFounderDetail } = useSelector(
    (state: RootState) => state.founderDetail
  );

  // INITIALIZE DELETE BUSINESS PERSON MUTATION
  const [
    deleteBusinessFounder,
    {
      isLoading: businessPersonIsLoading,
      isError: businessPersonIsError,
      error: businessPersonError,
      isSuccess: businessPersonIsSuccess,
      reset: businessPersonReset,
    },
  ] = useDeleteBusinessFounderMutation();

  // HANDLE DELETE BUSINESS PERSON RESPONSE
  useEffect(() => {
    if (businessPersonIsError) {
      const errorData =
        (businessPersonError as ErrorResponse)?.data?.message ||
        'An error occurred while deleting person. Refresh and try again';
      toast.error(errorData);
      businessPersonReset();
    } else if (businessPersonIsSuccess && selectedFounderDetail) {
      toast.success(
        `${
          selectedFounderDetail?.personDetail?.firstName ||
          selectedFounderDetail?.personDetail?.organization?.organizationName
        } removed successfully`
      );
      dispatch(removeExecutiveManager(selectedFounderDetail?.personDetail?.id));
      dispatch(removeBoardMember(selectedFounderDetail?.personDetail?.id));
      dispatch(setSelectedBusinessPerson(undefined));
      dispatch(setBusinessPerson(undefined));
      dispatch(setDeleteFounderModal(false));
      dispatch(setBusinessPersonDetailsModal(false));
      businessPersonReset();
    }
  }, [
    businessPersonError,
    businessPersonIsError,
    businessPersonIsSuccess,
    businessPersonReset,
    dispatch,
    selectedFounderDetail,
  ]);

  return (
    <Modal
      isOpen={deleteFounderModal}
      onClose={() => {
        dispatch(setDeleteFounderModal(false));
        dispatch(setSelectedFounderDetail(undefined));
      }}
      heading={`Delete ${
        selectedFounderDetail?.personDetail?.firstName ||
        selectedFounderDetail?.personDetail?.organization?.organizationName
      }
          ${selectedFounderDetail?.personDetail?.lastName || ''}`}
      headingClassName="text-red-600"
    >
      <section className="flex flex-col w-full gap-4">
        <p>
          Are you sure you want to delete{' '}
          {selectedFounderDetail?.personDetail?.firstName ||
            selectedFounderDetail?.personDetail?.organization
              ?.organizationName}{' '}
          {selectedFounderDetail?.personDetail?.lastName || ''}? This action
          cannot be undone!
        </p>
        <menu className="flex items-center justify-between w-full gap-3">
          <Button
            value={'Cancel'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteFounderModal(false));
              dispatch(setSelectedBusinessPerson(undefined));
            }}
          />
          <Button
            value={businessPersonIsLoading ? <Loader /> : 'Confirm'}
            danger
            onClick={(e) => {
              e.preventDefault();
              deleteBusinessFounder({ id: selectedFounderDetail?.id });
            }}
          />
        </menu>
      </section>
    </Modal>
  );
};

export default DeleteBusinessFounder;
