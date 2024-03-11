import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { userApplications } from "../../constants/Dashboard";
import Table from "../../components/table/Table";
import UserLayout from "../../containers/UserLayout";

const UserApplications = () => {
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
  const colums = [
    {
      header: "Registration Number",
      accessorKey: "regNumber",
    },
    {
      header: "Service Name",
      accessorKey: "serviceName",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return (
          <span
            className={`px-3 py-1 rounded-full flex w-fit items-center ${colors(
              row?.original.status.toLowerCase()
            )}`}
          >
            <span className=" w-[6px] h-[6px] rounded-full bg-current mr-2"></span>
            <span className="text-sm font-light ">{row?.original.status}</span>
          </span>
        );
      },
    },
    {
      header: "Submission Date",
      accessorKey: "submitionDate",
    },
    {
      header: "Action",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2 cursor-pointer">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                console.log(row);
              }}
              icon={faEye}
              className="text-primary"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <section className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <h1 className="text-lg w-fit">My Applications List</h1>
        <Table
          showFilter={false}
          showPagination={false}
          columns={colums}
          data={userApplications.map((application, index) => {
            return {
              ...application,
              no: index + 1,
            };
          })}
          className="bg-white rounded-2xl"
        />
      </section>
    </UserLayout>
  );
};

export default UserApplications;
