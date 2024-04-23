import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import AdminLayout from '../../containers/AdminLayout';
import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Table from '../../components/table/Table';
import { roles } from '../../constants/dashboard';
import { capitalizeString, formatDate } from '../../helpers/strings';
import AddRole from './AddRole';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAddRoleModal,
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

const ListRoles = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { rolesList } = useSelector((state: RootState) => state.role);

  // UPDATE ROLES LIST IN STATE
  useEffect(() => {
    dispatch(setRolesList(roles));
  }, [roles]);

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
      cell: ({ row }) => {
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
      cell: ({ row }) => {
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
        return value.includes(row.getValue(id))
      }
    },
    {
      header: 'Added By',
      accessorKey: 'user_name',
    },
    {
      id: 'date',
      header: 'Date Added',
      accessorKey: 'created_at',
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => {
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
          <h1 className="text-lg uppercase font-semibold">Roles list</h1>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setAddRoleModal(true));
            }}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCirclePlus} />
                Add Role
              </menu>
            }
          />
        </menu>
        <section>
          <Table
            showExport={false}
            rowClickHandler={(row) => {
              dispatch(setRole(row));
              dispatch(setEditRoleModal(true));
            }}
            data={rolesList?.map((role, index) => {
              return {
                ...role,
                no: index + 1,
                created_at: formatDate(role?.created_at),
                status: role?.status || 'active',
              };
            })}
            columns={columns}
          />
        </section>
      </main>
      <AddRole />
      <EditRole />
      <DeleteRole />
      <ListRolePermissions />
    </AdminLayout>
  );
};

export default ListRoles;
