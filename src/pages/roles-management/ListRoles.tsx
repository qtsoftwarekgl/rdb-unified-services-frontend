import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import AdminLayout from '../../containers/AdminLayout';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Table from '../../components/table/Table';
import { roles } from '../../constants/dashboard';
import { capitalizeString, formatDate } from '../../helpers/strings';
import AddRole from './AddRole';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAddRoleModal,
  setAssignRolesModal,
  setDeleteRoleModal,
  setEditRoleModal,
  setRole,
  setRolePermissionsModal,
  setRolesList,
} from '../../states/features/roleSlice';
import EditRole from './EditRole';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useEffect } from 'react';
import DeleteRole from './DeleteRole';
import ListRolePermissions from './ListRolePermissions';
import { Row } from '@tanstack/react-table';
import Select from '@/components/inputs/Select';
import AssignRoles from './AssignRoles';

const ListRoles = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { rolesList } = useSelector((state: RootState) => state.role);

  // UPDATE ROLES LIST IN STATE
  useEffect(() => {
    dispatch(setRolesList(roles));
  }, [dispatch]);

  // COLUMNS
  const columns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Role',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Permissions',
      accessorKey: 'permissions',
      cell: ({
        row,
      }: {
        row: {
          original: object;
        };
      }) => {
        return (
          <Button
            value="View permissions"
            className="!text-[13px] !bg-transparent"
            styled={false}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setRole(row?.original));
              dispatch(setRolePermissionsModal(true));
            }}
          />
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({
        row,
      }: {
        row: {
          original: {
            status: string;
          };
        };
      }) => {
        const status = row?.original?.status;
        return (
          <p
            className={`${
              status === 'active'
                ? 'bg-green-600'
                : status === 'Inactive'
                ? 'bg-red-600'
                : null
            } text-white text-center rounded-md text-[14px]`}
          >
            {capitalizeString(row?.original?.status)}
          </p>
        );
      },
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      header: 'Added By',
      accessorKey: 'user_name',
    },
    {
      id: 'date',
      header: 'Date Added',
      accessorKey: 'createdAt',
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({
        row,
      }: {
        row: {
          original: object;
        };
      }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                dispatch(setRole(row?.original));
                dispatch(setEditRoleModal(true));
              }}
              icon={faPenToSquare}
              className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full bg-primary"
            />
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                dispatch(setRole(row?.original));
                dispatch(setDeleteRoleModal(true));
              }}
              icon={faTrash}
              className="text-white cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full bg-red-600"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <main className="p-6 flex flex-col gap-6 w-full bg-white rounded-md">
        <menu className="flex items-center gap-2 justify-between">
          <h1 className="uppercase font-semibold text-primary text-[18px] w-[80%]">
            Roles list
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
                dispatch(setAddRoleModal(true));
              } else if (e === 'assign') {
                dispatch(setAssignRolesModal(true));
              }
            }}
          />
        </menu>
        <section>
          <Table
            showExport={false}
            rowClickHandler={(row) => {
              dispatch(setRole(row));
              dispatch(setEditRoleModal(true));
            }}
            data={rolesList?.map(
              (
                role: {
                  name: string;
                  status: string;
                  createdAt: string;
                },
                index
              ) => {
                return {
                  ...role,
                  no: index + 1,
                  createdAt: formatDate(role?.createdAt),
                  status: role?.status || 'active',
                };
              }
            )}
            columns={columns}
          />
        </section>
      </main>
      <AddRole />
      <EditRole />
      <DeleteRole />
      <ListRolePermissions />
      <AssignRoles />
    </AdminLayout>
  );
};

export default ListRoles;
