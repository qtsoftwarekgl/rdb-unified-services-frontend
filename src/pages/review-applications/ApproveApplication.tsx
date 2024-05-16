import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import { formatDate } from '@/helpers/strings';
import {
  setApproveApplicationModal,
  setUserApplications,
} from '@/states/features/userApplicationSlice';
import { AppDispatch, RootState } from '@/states/store';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const ApproveApplication = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { approveApplicationModal, selectedApplication } = useSelector(
    (state: RootState) => state.userApplication
  );

  return (
    <Modal
      isOpen={approveApplicationModal}
      onClose={() => {
        dispatch(setApproveApplicationModal(false));
      }}
    >
      <h1 className="flex text-center font-semibold text-primary text-md uppercase w-full items-center">
        Approve{' '}
        {selectedApplication?.name?.toUpperCase() ||
          selectedApplication?.company_name?.toUpperCase()}{' '}
        application
      </h1>
      <menu className="my-4 flex flex-col gap-2 items-start">
        <p>Registration number: {selectedApplication?.registration_number}</p>
        <p>Name: {selectedApplication?.name}</p>
        <p>
          Expires at:{' '}
          {formatDate(
            String(moment(selectedApplication?.createdAt).add(3, 'M'))
          )}
        </p>

        <menu className="flex my-3 items-center w-full gap-3 justify-between">
          <Button
            value={'Cancel'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setApproveApplicationModal(false));
            }}
          />
          <Button
            value={'Approve'}
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                setUserApplications({
                  entry_id: selectedApplication?.entry_id,
                  status: 'approved',
                })
              );
              dispatch(setApproveApplicationModal(false));
            }}
          />
        </menu>
      </menu>
    </Modal>
  );
};

export default ApproveApplication;
