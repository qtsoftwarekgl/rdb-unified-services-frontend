import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Table from '@/components/table/Table';
import { roleColumns } from '@/constants/roles.constants';
import {
  useAssignRolesMutation,
  useLazyFetchRolesQuery,
} from '@/states/api/userManagementApiSlice';
import {
  addSelectedRole,
  removeSelectedRole,
  setAssignRolesModal,
  setRolesList,
  setSelectedRoles,
  setTotalElements,
  setTotalPages,
} from '@/states/features/roleSlice';
import { setSelectedUser, updateUser } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Role } from '@/types/models/role';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const AssignRoles = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { assignRolesModal, selectedRoles, rolesList } = useSelector(
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
      toast.success(
        `Roles assigned to ${selectedUser?.firstName} successfully`
      );
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

  useEffect(() => {
    if (selectedUser) {
      dispatch(setSelectedRoles(selectedUser?.roles));
    }
  }, [dispatch, selectedUser]);

  const rolesExtendedColumns = [
    ...roleColumns,
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Role> }) => {
        const roleSelected = selectedRoles?.find(
          (role) => role?.id === row?.original?.id
        );
        return (
          <figure>
            {roleSelected ? (
              <CustomTooltip label={'Remove selection'}>
                <FontAwesomeIcon
                  icon={faMinus}
                  className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 px-[8.2px] text-[14px] flex items-center justify-center rounded-full bg-red-600"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(removeSelectedRole(row?.original));
                  }}
                />
              </CustomTooltip>
            ) : (
              <CustomTooltip label={'Select role'}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 px-[8.2px] text-[14px] flex items-center justify-center rounded-full bg-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(addSelectedRole(row?.original));
                  }}
                />
              </CustomTooltip>
            )}
          </figure>
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={assignRolesModal}
      onClose={() => {
        dispatch(setAssignRolesModal(false));
        dispatch(setSelectedUser(null));
        dispatch(setSelectedRoles([]));
        resetAssignRoles();
      }}
      heading={`Manage ${selectedUser?.fullName}'s roles`}
      className="!min-w-[50vw]"
    >
      <section className="w-full flex flex-col gap-4">
        {rolesIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[20vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-6">
            <Table data={rolesList} columns={rolesExtendedColumns} />
          </section>
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
