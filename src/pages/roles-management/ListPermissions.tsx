import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { AppDispatch, RootState } from '../../states/store';
import {
  addToSelectedPermissions,
  removeFromSelectedPermissions,
  setListPermissionsModal,
  setPage,
  setPermissionsList,
  setSelectedPermissions,
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
import { ColumnDef, Row } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Button from '@/components/inputs/Button';

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
    selectedPermissions,
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
    if (listPermissionsModal) {
      fetchPermissions({
        page,
        size,
      });
    }
  }, [fetchPermissions, page, size, listPermissionsModal]);

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
  const permissionExtendedColumns = [
    {
      header: '',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Permission> }) => {
        const permissionSelected = selectedPermissions?.find(
          (permission) => permission.id === row?.original?.id
        );
        return (
          <main className="flex items-center gap-2">
            {!permissionSelected ? (
              <CustomTooltip label="Select permission">
                <FontAwesomeIcon
                  className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 px-[8.2px] text-[14px] flex items-center justify-center rounded-full bg-primary"
                  icon={faPlus}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(addToSelectedPermissions(row?.original));
                  }}
                />
              </CustomTooltip>
            ) : (
              <CustomTooltip label="Remove permission">
                <FontAwesomeIcon
                  icon={faMinus}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(removeFromSelectedPermissions(row?.original));
                  }}
                  className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 px-[8.2px] text-[14px] flex items-center justify-center rounded-full bg-red-600"
                />
              </CustomTooltip>
            )}
          </main>
        );
      },
    },
    ...permissionColumns,
  ];

  return (
    <Modal
      isOpen={listPermissionsModal}
      onClose={() => {
        dispatch(setListPermissionsModal(false));
      }}
      heading="Permissions List"
      className="!min-w-[65%]"
      mainClassName="!z-[100000]"
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
          data={permissionsList?.map((permission: Permission) => {
            return {
              ...permission,
            };
          })}
          columns={permissionExtendedColumns as ColumnDef<Permission>[]}
        />
      )}
      <menu className="flex items-center gap-3 justify-between">
        <Button
          value="Remove all"
          disabled={selectedPermissions?.length <= 0}
          danger
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedPermissions([]));
          }}
        />
        <Button
          value="Complete"
          primary
          onClick={(e) => {
            e.preventDefault();
            dispatch(setListPermissionsModal(false));
          }}
        />
      </menu>
    </Modal>
  );
};

export default ListPermissions;
