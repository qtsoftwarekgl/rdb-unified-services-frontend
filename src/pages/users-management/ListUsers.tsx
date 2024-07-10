import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../containers/AdminLayout';
import Table from '../../components/table/Table';
import { faEye } from '@fortawesome/free-regular-svg-icons';
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
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { userColumns } from '@/constants/user.constants';
import { User } from '@/types/models/user';
import { capitalizeString, formatDate, getStatusBgColor } from '@/helpers/strings';

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
    ...userColumns,
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
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({
        row,
      }: {
        row: {
          original: null;
        };
      }) => {
        return (
          <menu
            className="flex items-center gap-4"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedUser(row?.original));
              dispatch(setViewUserDetailsModal(true));
            }}
          >
            <FontAwesomeIcon
              className="text-primary text-[20px] cursor-pointer ease-in-out duration-200 hover:scale-[1.02]"
              icon={faEye}
            />
          </menu>
        );
      },
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
              rowClickHandler={(row) => {
                dispatch(setSelectedUser(row));
                dispatch(setViewUserDetailsModal(true));
              }}
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
