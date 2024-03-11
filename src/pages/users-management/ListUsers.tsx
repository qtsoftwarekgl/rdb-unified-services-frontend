import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/inputs/Button";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../containers/AdminLayout";
import Table from "../../components/table/Table";
import { users } from "../../constants/Users";
import { capitalizeString, formatDate } from "../../helpers/Strings";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import AddUser from "./AddUser";
import ViewUser from "./ViewUser";

const ListUsers = () => {
  // COLUMNS
  const [openUserModal, setOpenUserModal] = useState(false);
  const [userToView, setUserToView] = useState(null);

  const columns = [
    {
      header: "No",
      id: "no",
      accessorKey: "no",
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }: { row: unknown }) => {
        return (
          <menu className="flex items-center justify-start gap-3">
            <figure className="overflow-hidden inline w-[2.7rem] h-[2.7rem] relative rounded-full">
              <img
                src={row?.original?.image}
                className="object-cover w-full h-full"
              />
            </figure>
            <p className="text-[13px]">{row?.original?.name}</p>
          </menu>
        );
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      filter: true,
    },
    {
      header: "Role",
      accessorKey: "role",
      filter: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      filter: true,
    },
    {
      header: "Date Added",
      accessorKey: "created_at",
    },
    {
      header: "",
      accessorKey: "actions",
      cell: ({ row }: { row: unknown }) => {
        return (
          <menu
            className="flex items-center gap-4"
            onClick={() => {
              setUserToView(row?.original);
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
          <Table
            data={users?.map((user, index) => {
              return {
                ...user,
                no: index + 1,
                name: `${user?.first_name} ${user?.last_name}`,
                role: capitalizeString(user?.role),
                status: capitalizeString(user?.status),
                created_at: formatDate(user?.created_at),
              };
            })}
            columns={columns}
          />
        </section>
        {/* Register User MODAL */}
        {openUserModal && (
          <AddUser
            openUserModal={openUserModal}
            setOpenUserModal={setOpenUserModal}
          />
        )}

        {/* View User Modal */}
        {userToView && (
          <ViewUser user={userToView} setUserToView={setUserToView} />
        )}
      </main>
    </AdminLayout>
  );
};

export default ListUsers;
