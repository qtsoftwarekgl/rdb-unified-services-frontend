import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import {
  faCircleInfo,
  faCirclePlus,
  faEllipsisVertical,
  faRightLeft,
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../containers/AdminLayout';
import Table from '../../components/table/Table';
import { useEffect, useState } from 'react';
import AddUser from './AddUser';
import ViewUserDetails from './ViewUserDetails';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useLazyFetchUsersQuery } from '@/states/api/userManagementApiSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  setPage,
  setSelectedUser,
  setSize,
  setTotalElements,
  setTotalPages,
  setUsersList,
  setViewUserDetailsModal,
} from '@/states/features/userSlice';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { userColumns } from '@/constants/user.constants';
import { User } from '@/types/models/user';
import {
  capitalizeString,
  formatDate,
  getStatusBgColor,
} from '@/helpers/strings';
import CustomPopover from '@/components/inputs/CustomPopover';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { setAssignRolesModal } from '@/states/features/roleSlice';

const ListUsers = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { usersList, page, size, totalElements, totalPages } = useSelector(
    (state: RootState) => state.user
  );

  // COLUMNS
  const [openUserModal, setOpenUserModal] = useState(false);

  // INIITIALIZE FETCH USERS QUERY
  const [
    fetchUsers,
    {
      data: usersData,
      error: usersError,
      isFetching: usersIsFetching,
      isSuccess: usersIsSuccess,
      isError: usersIsError,
    },
  ] = useLazyFetchUsersQuery();

  // FETCH USERS
  useEffect(() => {
    fetchUsers({
      page,
      size,
    });
  }, [fetchUsers, page, size]);

  // HANDLE USERS QUERY RESPONSE
  useEffect(() => {
    if (usersIsSuccess) {
      dispatch(setUsersList(usersData?.data?.data));
      dispatch(setTotalElements(usersData?.data?.totalElements));
      dispatch(setTotalPages(usersData?.data?.totalPages));
    } else if (usersIsError) {
      const errorResponse =
        (usersError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching users. Please try again.';
      toast.error(errorResponse);
    }
  }, [usersIsSuccess, usersData, dispatch, usersIsError, usersError]);

  const userExtendedColumns = [
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<User> }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="flex items-center justify-center w-full gap-2 text-[12px] cursor-pointer">
                <FontAwesomeIcon
                  className="text-primary text-md p-0 transition-all duration-300 hover:scale-[.98]"
                  icon={faEllipsisVertical}
                />
              </menu>
            }
          >
            <menu className="bg-white flex flex-col gap-1 p-0 rounded-md">
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedUser(row?.original));
                  dispatch(setViewUserDetailsModal(true));
                }}
                to={'#'}
              >
                <FontAwesomeIcon className="text-primary" icon={faCircleInfo} />
                View details
              </Link>
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                }}
                to={'#'}
              >
                <FontAwesomeIcon
                  className="text-primary"
                  icon={faPenToSquare}
                />{' '}
                Edit
              </Link>
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm  hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedUser(row?.original));
                  dispatch(setAssignRolesModal(true));
                }}
                to={'#'}
              >
                <FontAwesomeIcon className="text-primary" icon={faRightLeft} />
                Manage roles
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
    ...userColumns,
    {
      header: 'Roles',
      accessorKey: 'roles',
      cell: ({ row }: { row: Row<User> }) => {
        return (
          <Link
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedUser(row?.original));
              dispatch(setAssignRolesModal(true));
            }}
            className="flex items-center gap-2"
          >
            <p className="text-primary text-[13px]">View roles</p>
          </Link>
        );
      },
    },
    {
      header: 'State',
      accessorKey: 'state',
      id: 'state',
      cell: ({ row }: { row: Row<User> }) => {
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
      header: 'Date added',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: Row<User> }) =>
        formatDate(row?.original?.createdAt),
    },
    {
      header: 'Last updated',
      accessorKey: 'updatedAt',
      cell: ({ row }: { row: Row<User> }) =>
        formatDate(row?.original?.updatedAt),
    },
  ];

  return (
    <AdminLayout>
      <main className="flex flex-col w-full gap-6 p-6 bg-white rounded-md">
        <menu className="flex items-center justify-between w-full gap-6">
          <h1 className="text-lg font-semibold uppercase">Users List</h1>
          <Button
            primary
            onClick={() => setOpenUserModal(true)}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCirclePlus} />
                New User
              </menu>
            }
          />
        </menu>
        <section className="p-2">
          {usersIsFetching ? (
            <figure className="flex items-center justify-center w-full min-h-[40vh]">
              <Loader className="text-primary" />
            </figure>
          ) : (
            <Table
              totalElements={totalElements}
              totalPages={totalPages}
              page={page}
              size={size}
              setPage={setPage}
              setSize={setSize}
              data={usersList
                ?.filter((user) => user?.firstName !== null)
                ?.map((user: User, index: number) => {
                  return {
                    ...user,
                    no: index + 1,
                  };
                })}
              columns={userExtendedColumns as ColumnDef<User>[]}
            />
          )}
        </section>
        {/* Register User MODAL */}
        {openUserModal && (
          <AddUser
            openUserModal={openUserModal}
            setOpenUserModal={setOpenUserModal}
          />
        )}

        <ViewUserDetails />
      </main>
    </AdminLayout>
  );
};

export default ListUsers;
