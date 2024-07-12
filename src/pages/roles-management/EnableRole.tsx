import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import Modal from '../../components/Modal';
import {
  setEnableRoleModal,
  setSelectedRole,
} from '../../states/features/roleSlice';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { capitalizeString } from '@/helpers/strings';
import { useEnableRoleMutation } from '@/states/api/userManagementApiSlice';
import { useEffect } from 'react';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const EnableRole = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { enableRoleModal, selectedRole } = useSelector(
    (state: RootState) => state.role
  );

  // INITIALIZE DISABLE ROLE MUTATION
  const [
    enableRole,
    {
      isLoading: enableRoleIsLoading,
      error: enableRoleError,
      isSuccess: enableRoleIsSuccess,
      isError: enableRoleIsError,
    },
  ] = useEnableRoleMutation();

  // HANDLE DISABLE ROLE RESPONSE
  useEffect(() => {
    if (enableRoleIsSuccess) {
      window.location.reload();
      dispatch(setEnableRoleModal(false));
      dispatch(setSelectedRole(undefined));
    }
    if (enableRoleIsError) {
      const errorResponse =
        (enableRoleError as ErrorResponse)?.data?.message ||
        'An error occurred while disabling role. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    enableRoleIsSuccess,
    enableRoleIsError,
    dispatch,
    selectedRole,
    enableRoleError,
  ]);

  return (
    <Modal
      isOpen={enableRoleModal}
      onClose={() => {
        dispatch(setEnableRoleModal(false));
      }}
      heading={`Enable ${capitalizeString(selectedRole?.roleName)}`}
      headingClassName="!text-green-700"
    >
      <p className="w-full max-w-[50vw] text-[15px]">
        Are you sure you want to enable{' '}
        {capitalizeString(selectedRole?.roleName)}? All users who are currently
        using this role will be affected!
      </p>

      <menu className="flex items-center gap-3 justify-between">
        <Button
          value="Cancel"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setEnableRoleModal(false));
            dispatch(setSelectedRole(undefined));
          }}
        />
        <Button
          value={enableRoleIsLoading ? <Loader /> : 'Enable'}
          primary
          className='!bg-green-700 !border-none'
          onClick={(e) => {
            e.preventDefault();
            if (selectedRole) {
              enableRole({ id: selectedRole.id });
            }
          }}
        />
      </menu>
    </Modal>
  );
};

export default EnableRole;
