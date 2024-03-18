import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "../../components/table/Table";
import { formatDate } from "../../helpers/Strings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../states/store";
import { setViewedCompany } from "../../states/features/userCompaniesSlice";
import { useNavigate } from "react-router";

const RegisteredBusinessesTable = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { foreign_user_applications } = useSelector(
    (state: RootState) => state.foreignBranchRegistration
  );
  const { user_applications } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const { registered_enterprises } = useSelector(
    (state: RootState) => state.enterpriseRegistration
  );

  let registeredBusinesses = user_applications?.length
    ? user_applications?.concat(
        foreign_user_applications,
        registered_enterprises
      )
    : [].concat(foreign_user_applications, registered_enterprises);

  registeredBusinesses = registeredBusinesses
    .map((business) => {
      return {
        ...business?.company_details,
        ...business?.foreign_company_details,
        ...business?.enterprise_details,
        company_name:
          business?.company_details?.name ||
          business?.enterprise_details?.name ||
          business?.foreign_company_details?.name,
        company_code:
          business?.company_code || Math.floor(Math.random() * 9000) + 1000,
        status: business?.status?.toLowerCase() || "submitted",
        id:
          business?.id ||
          business?.entry_id ||
          Math.floor(Math.random() * 9000) + 1000,
      };
    })
    .sort((a, b) => {
      return (
        new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
      );
    });

  localStorage.setItem(
    "registeredBusinesses",
    JSON.stringify(registeredBusinesses)
  );

  const colors = (status: string) => {
    if (status === "active") {
      return "bg-[#82ffa3] text-[#0d7b3e]";
    }
    if (status === "closed") {
      return "bg-[#eac3c3] text-red-500";
    }
    if (status === "approved") {
      return "bg-[#cfeaff] text-secondary";
    }
    if (status === "dormant") {
      return "bg-[#e4e4e4] text-[#6b6b6b]";
    }
    if (status === "pending") {
      return "bg-yellow-100 text-yellow-500";
    }
    if (status === "submitted") {
      return "bg-[#e8ffef] text-black";
    }
  };
  const colums = [
    {
      header: "Company Code",
      accessorKey: "company_code",
    },
    {
      header: "Company Name",
      accessorKey: "company_name",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return (
          <span
            className={`px-3 py-1 rounded-full flex w-fit items-center ${colors(
              row?.original?.status?.toLowerCase()
            )}`}
          >
            <span className=" w-[6px] h-[6px] rounded-full bg-current mr-2"></span>
            <span className="text-sm font-light ">{row?.original?.status}</span>
          </span>
        );
      },
    },
    {
      header: "Registered Date",
      accessorKey: "created_at",
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
                dispatch(setViewedCompany(row?.original));
                navigate(`/company-details/${row?.original?.id}`);
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
    <section className="mb-8">
      <h1 className=" text-tertiary w-fit">My Registered Companies</h1>
      <Table
        showFilter={false}
        showPagination={false}
        columns={colums}
        data={registeredBusinesses.map((business, index) => {
          return {
            ...business,
            no: index + 1,
            createdAt: formatDate(business?.createdAt),
          };
        })}
        className="bg-white rounded-2xl"
      />
    </section>
  );
};

export default RegisteredBusinessesTable;
