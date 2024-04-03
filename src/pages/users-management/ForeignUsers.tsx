import { useState } from "react";
import AdminLayout from "../../containers/AdminLayout";
import Table from "../../components/table/Table";
import { foreignApplications } from "../../constants/dashboard";
import UserCard from "./ForeignUserCard";
import Button from "../../components/inputs/Button";

const ForeignUsers = () => {
  const [userToView, setUserToView] = useState(null);

  const columns = [
    {
      header: "First Name",
      accessorKey: "first_name",
    },
    {
      header: "Last Name",
      accessorKey: "last_name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Application Status",
      accessorKey: "application_status",
      filter: true,
      cell: ({ row }) => {
        return (
          <span
            className={`px-3 py-1 rounded-full flex w-fit items-center ${colors(
              row?.original?.application_status?.toLowerCase()
            )}`}
          >
            <span className=" w-[6px] h-[6px] rounded-full bg-current mr-2"></span>
            <span className="text-sm font-light ">
              {row?.original?.application_status}
            </span>
          </span>
        );
      },
    },
    {
      header: "Date Applied",
      accessorKey: "created_at",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: unknown }) => {
        return (
          <menu
            className="flex items-center gap-4"
            onClick={() => {
              setUserToView(row?.original);
            }}
          >
            <Button styled={false}
          className="!bg-transparent" value={"View"} />
          </menu>
        );
      },
    },
  ];

  const colors = (status: string) => {
    if (status === "verified") {
      return "bg-[#82ffa3] text-[#0d7b3e]";
    }
    if (status === "rejected") {
      return "bg-[#eac3c3] text-red-500";
    }
    if (status === "approved") {
      return "bg-[#cfeaff] text-secondary";
    }
    if (status === "request for action") {
      return "bg-[#e4e4e4] text-[#6b6b6b]";
    }
    if (status === "submitted") {
      return "bg-[#e8ffef] text-black";
    }
  };

  return (
    <AdminLayout>
      <section className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex items-center justify-between w-full gap-3">
          <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
            Foreign Account Applications List
          </h1>
        </menu>
        <Table
          columns={columns}
          data={foreignApplications}
          showExport
          className="bg-white rounded-2xl"
          columnsToExport={columns
            ?.map((column) => column?.accessorKey)
            ?.filter((column) => column !== "action")}
          exportFIleName="Foreign Account Applications"
        />
        {userToView && (
          <UserCard user={userToView} setUserToView={setUserToView} />
        )}
      </section>
    </AdminLayout>
  );
};

export default ForeignUsers;
