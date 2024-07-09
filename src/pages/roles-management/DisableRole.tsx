import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import Modal from '../../components/Modal';
import {
  setDisableRoleModal,
  setSelectedRole,
  updateRole,
} from '../../states/features/roleSlice';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { capitalizeString } from '@/helpers/strings';
import { useDisableRoleMutation } from '@/states/api/userManagementApiSlice';
import { useEffect } from 'react';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Role } from '@/types/models/role';

const DisableRole = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { disableRoleModal, selectedRole } = useSelector(
    (state: RootState) => state.role
  );

  // INITIALIZE DISABLE ROLE MUTATION
  const [
    disableRole,
    {
      data: disableRoleData,
      isLoading: disableRoleIsLoading,
      error: disableRoleError,
      isSuccess: disableRoleIsSuccess,
      isError: disableRoleIsError,
    },
  ] = useDisableRoleMutation();

  // HANDLE DISABLE ROLE RESPONSE
  useEffect(() => {
    if (disableRoleIsSuccess) {
      dispatch(updateRole(disableRoleData?.data as Role));
      dispatch(setDisableRoleModal(false));
      dispatch(setSelectedRole(undefined));
    }
    if (disableRoleIsError) {
      const errorResponse =
        (disableRoleError as ErrorResponse)?.data?.message ||
        'An error occurred while disabling role. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    disableRoleIsSuccess,
    disableRoleIsError,
    dispatch,
    disableRoleData,
    selectedRole,
    disableRoleError,
  ]);

  return (
    <Modal
      isOpen={disableRoleModal}
      onClose={() => {
        dispatch(setDisableRoleModal(false));
      }}
      heading={`Disable ${capitalizeString(selectedRole?.roleName)}`}
      headingClassName="text-red-600"
    >
      <p className="w-full max-w-[50vw] text-[15px]">
        Are you sure you want to disable{' '}
        {capitalizeString(selectedRole?.roleName)}? All users who are currently
        using this role will be affected! You can also always re-enable it from
        this page.
      </p>

      <menu className="flex items-center gap-3 justify-between">
        <Button
          value="Cancel"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setDisableRoleModal(false));
            dispatch(setSelectedRole(undefined));
          }}
        />
        <Button
          value={disableRoleIsLoading ? <Loader /> : 'Delete'}
          primary
          danger
          onClick={(e) => {
            e.preventDefault();
            if (selectedRole) {
              disableRole({ id: selectedRole.id });
            }
          }}
        />
      </menu>
    </Modal>
  );
};

export default DisableRole;
