import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Table from "@/components/table/Table";
import { permissionColumns } from "@/constants/permission.constants";
import { capitalizeString } from "@/helpers/strings";
import { useFetchPermissionsMutation } from "@/states/api/userManagementApiSlice";
import {
  setPage,
  setPermissionsList,
  setSize,
  setTotalElements,
  setTotalPages,
} from "@/states/features/permissionSlice";
import {
  setRolePermissionsModal,
  setSelectedRole,
} from "@/states/features/roleSlice";
import { AppDispatch, RootState } from "@/states/store";
import { Permission } from "@/types/models/permission";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";

const ListRolePermissions = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { rolePermissionsModal, selectedRole } = useSelector(
    (state: RootState) => state.role
  );
  const { permissionsList, totalElements, totalPages, page, size } =
    useSelector((state: RootState) => state.permission);

  // INITIALIZE FETCH PERMISSIONS QUERY
  const [
    fetchPermissions,
    {
      data: permissionsData,
      isLoading: permissionsIsFetching,
      error: permissionsError,
      isSuccess: permissionsIsSuccess,
      isError: permissionsIsError,
      reset: resetPermissions,
    },
  ] = useFetchPermissionsMutation();

  // FETCH PERMISSIONS
  useEffect(() => {
    if (selectedRole) {
      fetchPermissions({ roleId: selectedRole?.id, page, size });
    }
  }, [fetchPermissions, page, selectedRole, size]);

  // HANDLE FETCH PERMISSIONS RESPONSE
  useEffect(() => {
    if (permissionsIsSuccess) {
      dispatch(setPermissionsList(permissionsData?.data?.data));
      dispatch(setTotalElements(permissionsData?.data?.totalElements));
      dispatch(setTotalPages(permissionsData?.data?.totalPages));
    } else if (permissionsIsError) {
      const errorResponse =
        (permissionsError as ErrorResponse)?.data?.message ||
        "An error occurred while fetching permissions. Refresh and try again";
      toast.error(errorResponse);
    }
  }, [
    dispatch,
    permissionsData,
    permissionsError,
    permissionsIsError,
    permissionsIsSuccess,
  ]);

  // COLUMNS
  const permissionExtendedColumns = [...permissionColumns];

  return (
    <Modal
      isOpen={rolePermissionsModal}
      onClose={() => {
        dispatch(setRolePermissionsModal(false));
        dispatch(setSelectedRole(undefined));
        // invalidate permissions list
        dispatch(setPermissionsList([]));
        resetPermissions();
      }}
      heading={`Permissions for ${capitalizeString(selectedRole?.roleName)}`}
    >
      {permissionsIsFetching ? (
        <figure className="flex justify-center items-center w-full min-h-[30vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <Table
          setPage={setPage}
          setSize={setSize}
          page={page}
          size={size}
          totalElements={totalElements}
          totalPages={totalPages}
          data={permissionsList?.map(
            (permission: Permission, index: number) => {
              return {
                ...permission,
                no: index + page,
              };
            }
          )}
          columns={permissionExtendedColumns as ColumnDef<Permission>[]}
          showFilter={false}
        />
      )}
    </Modal>
  );
};

export default ListRolePermissions;
