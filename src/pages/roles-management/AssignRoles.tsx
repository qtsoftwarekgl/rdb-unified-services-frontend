import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import { capitalizeString } from '@/helpers/strings';
import {
  useAssignRolesMutation,
  useLazyFetchRolesQuery,
} from '@/states/api/userManagementApiSlice';
import {
  addSelectedRole,
  removeSelectedRole,
  setAssignRolesModal,
  setRolesList,
  setTotalElements,
  setTotalPages,
} from '@/states/features/roleSlice';
import { updateUser } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const AssignRoles = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { assignRolesModal, rolesList, selectedRoles } = useSelector(
    (state: RootState) => state.role
  );
  const { selectedUser } = useSelector((state: RootState) => state.user);

  // INITIALIZE FETCH ROLES QUERY
  const [
    fetchRoles,
    {
      data: rolesData,
      error: rolesError,
      isFetching: rolesIsFetching,
      isSuccess: rolesIsSuccess,
      isError: rolesIsError,
    },
  ] = useLazyFetchRolesQuery();

  // FETCH ROLES
  useEffect(() => {
    fetchRoles({ page: 1, size: 1000 });
  }, [fetchRoles]);

  // HANDLE ROLES QUERY RESPONSE
  useEffect(() => {
    if (rolesIsSuccess) {
      dispatch(setRolesList(rolesData?.data?.data));
      dispatch(setTotalElements(rolesData?.data?.totalElements));
      dispatch(setTotalPages(rolesData?.data?.totalPages));
    } else if (rolesIsError) {
      const errorResponse =
        (rolesError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching roles. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [rolesIsSuccess, rolesData, dispatch, rolesIsError, rolesError]);

  // INITIALIZE ASSIGN ROLES MUTATION
  const [
    assignRoles,
    {
      data: assignRolesData,
      error: assignRolesError,
      isLoading: assignRolesIsLoading,
      isSuccess: assignRolesIsSuccess,
      isError: assignRolesIsError,
      reset: resetAssignRoles,
    },
  ] = useAssignRolesMutation();

  // HANDLE ASSIGN ROLES MUTATION RESPONSE
  useEffect(() => {
    if (assignRolesIsSuccess) {
      toast.success('Roles assigned successfully');
      dispatch(updateUser({ ...selectedUser, roles: selectedRoles }));
      resetAssignRoles();
      dispatch(setAssignRolesModal(false));
    } else if (assignRolesIsError) {
      const errorResponse =
        (assignRolesError as ErrorResponse)?.data?.message ||
        'An error occurred while assigning roles. Please try again';
      toast.error(errorResponse);
    }
  }, [
    assignRolesIsSuccess,
    assignRolesData,
    dispatch,
    assignRolesIsError,
    assignRolesError,
    selectedUser,
    selectedRoles,
    resetAssignRoles,
  ]);

  return (
    <Modal
      isOpen={assignRolesModal}
      onClose={() => {
        dispatch(setAssignRolesModal(false));
        resetAssignRoles();
      }}
      heading={`Assign roles to ${selectedUser?.firstName}`}
    >
      <section className="w-full flex flex-col gap-4">
        {rolesIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[20vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <menu className="flex flex-col gap-2">
            {rolesList?.map((role) => {
              return (
                <label key={role?.id} className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    onChange={(e) => {
                      if (e) {
                        dispatch(addSelectedRole(role));
                      } else {
                        dispatch(removeSelectedRole(role));
                      }
                    }}
                  />
                  <p>{capitalizeString(role?.roleName)}</p>
                </label>
              );
            })}
          </menu>
        )}
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            value="Cancel"
            onClick={(e) => {
              e.preventDefault();
              resetAssignRoles();
              dispatch(setAssignRolesModal(false));
            }}
          />
          <Button
            value={assignRolesIsLoading ? <Loader /> : 'Complete'}
            primary
            onClick={(e) => {
              e.preventDefault();
              assignRoles({
                userId: selectedUser?.id,
                roleIds: selectedRoles?.map((role) => role?.id),
              });
            }}
          />
        </menu>
      </section>
    </Modal>
  );
};

export default AssignRoles;
