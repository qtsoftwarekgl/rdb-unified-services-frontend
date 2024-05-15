import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import { setDeleteApplicationModal } from '@/states/features/businessRegistrationSlice';
import { deleteUserApplication } from '@/states/features/userApplicationSlice';
import { AppDispatch, RootState } from '@/states/store';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const DeleteBusinessApplication = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { deleteApplicationModal } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const { selectedApplication } = useSelector(
    (state: RootState) => state.userApplication
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal
      isOpen={deleteApplicationModal}
      onClose={() => {
        dispatch(setDeleteApplicationModal(false));
      }}
    >
      <h1 className="text-start text-red-600 uppercase font-semibold text-[16px]">
        Discard {selectedApplication?.company_details?.name || 'N/A'}
      </h1>
      <p className="max-w-[80%]">
        Are you sure you want to discard the following application?
      </p>
      <menu className="flex flex-col gap-3">
        <p>
          Name:{' '}
          <span className="uppercase">
            {selectedApplication?.company_details?.name || 'N/A'}
          </span>
        </p>
        <p>
          Date Started:{' '}
          {selectedApplication?.created_at
            ? moment().format('DD/MM/YYYY H:mm')
            : moment().format('DD/MM/YYYY H:mm')}
        </p>
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
          value={isLoading ? <Loader color="white" /> : 'Confirm'}
          danger
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              dispatch(deleteUserApplication(selectedApplication?.entry_id));
              dispatch(setDeleteApplicationModal(false));
            }, 1000);
          }}
        />
      </menu>
    </Modal>
  );
};

export default DeleteBusinessApplication;
