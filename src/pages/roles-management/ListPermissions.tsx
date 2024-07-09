import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { AppDispatch, RootState } from '../../states/store';
import {
  setListPermissionsModal,
  setPage,
  setPermissionsList,
  setSize,
  setTotalElements,
  setTotalPages,
} from '../../states/features/permissionSlice';
import Table from '../../components/table/Table';
import { permissionColumns } from '@/constants/permission.constants';
import { useLazyFetchPermissionsQuery } from '@/states/api/userManagementApiSlice';
import { useEffect } from 'react';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { Permission } from '@/types/models/permission';
import { ColumnDef } from '@tanstack/react-table';

const ListPermissions = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    listPermissionsModal,
    page,
    size,
    permissionsList,
    totalElements,
    totalPages,
  } = useSelector((state: RootState) => state.permission);

  // INITIALIZE FETCH PERMISSIONS QUERY
  const [
    fetchPermissions,
    {
      data: permissionsData,
      isFetching: permissionsIsFetching,
      error: permissionsError,
      isSuccess: permissionsIsSuccess,
      isError: permissionsIsError,
    },
  ] = useLazyFetchPermissionsQuery();

  // FETCH PERMISSIONS
  useEffect(() => {
    fetchPermissions({
      page,
      size,
    });
  }, [fetchPermissions, page, size]);

  // HANDLE PERMISSIONS RESPONSE
  useEffect(() => {
    if (permissionsIsSuccess) {
      dispatch(setPermissionsList(permissionsData?.data?.data));
      dispatch(setTotalPages(permissionsData?.data?.totalPages));
      dispatch(setTotalElements(permissionsData?.data?.totalElements));
    }
    if (permissionsIsError) {
      toast.error(
        (permissionsError as ErrorResponse)?.data?.message ||
          'An error occurred while fetching permissions. Refresh and try again'
      );
    }
  }, [
    permissionsIsSuccess,
    permissionsIsError,
    permissionsError,
    dispatch,
    permissionsData?.data?.data,
    permissionsData?.data?.totalPages,
    permissionsData?.data?.totalElements,
  ]);

  // COLUMNS
  const permissionExtendedColumns = [...permissionColumns];

  return (
    <Modal
      isOpen={listPermissionsModal}
      onClose={() => {
        dispatch(setListPermissionsModal(false));
      }}
      heading="Permissions List"
    >
      {permissionsIsFetching ? (
        <figure className="w-full flex items-center justify-center min-h-[40vh]">
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

export default ListPermissions;
