import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import AdminLayout from '../../containers/AdminLayout';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import Table from '../../components/table/Table';
import CreateRole from './CreateRole';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCreateRoleModal,
  setAssignRolesModal,
  setDisableRoleModal,
  setUpdateRoleModal,
  setRolesList,
  setTotalElements,
  setTotalPages,
  setPage,
  setSize,
  setSelectedRole,
  setRolePermissionsModal,
  setEnableRoleModal,
} from '../../states/features/roleSlice';
import UpdateRole from './UpdateRole';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useEffect } from 'react';
import DisableRole from './DisableRole';
import { ColumnDef, Row } from '@tanstack/react-table';
import Select from '@/components/inputs/Select';
import AssignRoles from './AssignRoles';
import { roleColumns } from '@/constants/roles.constants';
import { Role } from '@/types/models/role';
import { useLazyFetchRolesQuery } from '@/states/api/userManagementApiSlice';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { capitalizeString, getStatusBgColor } from '@/helpers/strings';
import ListPermissions from './ListPermissions';
import ListRolePermissions from './ListRolePermissions';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import EnableRole from './EnableRole';

const ListRoles = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { rolesList, page, size, totalElements, totalPages } = useSelector(
    (state: RootState) => state.role
  );

  // INITIALIZE FETCH ROLES QUERY
  const [
    fetchRoles,
    {
      data: rolesData,
      isFetching: rolesIsFetching,
      error: rolesError,
      isSuccess: rolesIsSuccess,
      isError: rolesIsError,
    },
  ] = useLazyFetchRolesQuery();

  // FETCH ROLES
  useEffect(() => {
    fetchRoles({
      page,
      size,
    });
  }, [fetchRoles, page, size]);

  // HANDLE FETCH ROLES RESPONSE
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

  // COLUMNS
  const roleExtendedColumns = [
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Role> }) => {
        return (
          <menu className="flex items-center gap-2">
            <CustomTooltip label="Edit role">
              <FontAwesomeIcon
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedRole(row?.original));
                  dispatch(setUpdateRoleModal(true));
                }}
                icon={faPenToSquare}
                className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full bg-primary"
              />
            </CustomTooltip>
            {row?.original?.state === 'ACTIVE' ? (
              <CustomTooltip label="Disable role">
                <FontAwesomeIcon
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setSelectedRole(row?.original));
                    dispatch(setDisableRoleModal(true));
                  }}
                  icon={faBan}
                  className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full bg-red-600"
                />
              </CustomTooltip>
            ) : (
              <CustomTooltip label="Enable role">
                <FontAwesomeIcon
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setSelectedRole(row?.original));
                    dispatch(setEnableRoleModal(true));
                  }}
                  icon={faCircleCheck}
                  className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full bg-green-600"
                />
              </CustomTooltip>
            )}
          </menu>
        );
      },
    },
    ...roleColumns,
    {
      header: 'State',
      accessorKey: 'state',
      id: 'state',
      cell: ({ row }: { row: Row<Role> }) => {
        return (
          <p
            className={`${getStatusBgColor(
              row?.original?.state
            )} text-center text-white text-[13px] rounded-md p-1`}
          >
            {capitalizeString(row?.original?.state)}
          </p>
        );
      },
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      header: 'Permissions',
      accessorKey: 'permissions',
      id: 'actions',
      cell: ({ row }: { row: Row<Role> }) => {
        return (
          <Button
            value="View permissions"
            className="!text-[13px] !bg-transparent"
            styled={false}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedRole(row?.original));
              dispatch(setRolePermissionsModal(true));
            }}
          />
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <main className="p-6 flex flex-col gap-4 w-full bg-white rounded-md">
        <menu className="flex items-center gap-2 justify-between">
          <h1 className="uppercase font-semibold text-primary text-xl w-[80%]">
            Roles Management
          </h1>
          <Select
            options={[
              { value: 'add', label: 'Add role' },
              { value: 'assign', label: 'Assign roles' },
            ]}
            placeholder="Actions"
            className="w-[25%] self-end"
            onChange={(e) => {
              if (e === 'add') {
                dispatch(setCreateRoleModal(true));
              } else if (e === 'assign') {
                dispatch(setAssignRolesModal(true));
              }
            }}
          />
        </menu>
        <section>
          {rolesIsFetching ? (
            <figure className="flex justify-center items-center min-h-[30vh]">
              <Loader className="text-primary" />
            </figure>
          ) : (
            <Table
              totalElements={totalElements}
              totalPages={totalPages}
              setPage={setPage}
              setSize={setSize}
              size={size}
              page={page}
              showExport={false}
              rowClickHandler={(row) => {
                dispatch(setSelectedRole(row));
                dispatch(setRolePermissionsModal(true));
              }}
              data={rolesList?.map((role: Role) => {
                return {
                  ...role,
                };
              })}
              columns={roleExtendedColumns as ColumnDef<Role>[]}
            />
          )}
        </section>
      </main>
      <CreateRole />
      <UpdateRole />
      <DisableRole />
      <AssignRoles />
      <ListPermissions />
      <ListRolePermissions />
      <EnableRole />
    </AdminLayout>
  );
};

export default ListRoles;
