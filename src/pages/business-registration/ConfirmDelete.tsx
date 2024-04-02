import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { AppDispatch, RootState } from '../../states/store';
import { setConfirmDeleteModal } from '../../states/features/businessRegistrationSlice';
import { UnknownAction } from '@reduxjs/toolkit';
import { FC } from 'react';
import Button from '../../components/inputs/Button';

interface ConfirmDeleteProps {
  deleteAction: UnknownAction | undefined;
  data: unknown
}

const ConfirmDelete: FC<ConfirmDeleteProps> = ({ deleteAction, data }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { confirmDeleteModal } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  return (
    <Modal
      isOpen={confirmDeleteModal}
      onClose={() => {
        dispatch(setConfirmDeleteModal(false));
      }}
    >
      <section className="flex flex-col gap-4 w-full">
        <h1>
          Are you sure you want to delete {data?.first_name}{' '}
          {data?.last_name || ''}
        </h1>
        <menu className="flex items-center gap-3 justify-between">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setConfirmDeleteModal(false));
            }}
          />
          <Button value="Delete" danger onClick={deleteAction} />
        </menu>
      </section>
    </Modal>
  );
};

export default ConfirmDelete;
