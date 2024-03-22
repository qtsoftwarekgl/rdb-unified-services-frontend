import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import Table from "../../components/table/Table";
import { RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatCompanyData } from "../../helpers/Strings";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from "../../states/features/businessRegistrationSlice";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from "../../states/features/enterpriseRegistrationSlice";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from "../../states/features/foreignBranchRegistrationSlice";

type Props = {
  title: string;
  description: string;
  notDataMessage: string;
  actionIcon: IconDefinition;
  handleClickAction: () => void;
};

const ApplicatinsList = ({
  title,
  description,
  actionIcon,
  notDataMessage,
  handleClickAction,
}: Props) => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Format company data

  // Sort by submission date
  const sortBySubmissionDate = (a, b) => {
    return (
      new Date(b?.submissionDate).getTime() -
      new Date(a?.submissionDate).getTime()
    );
  };

  const companies = user_applications
    .map(formatCompanyData)
    .sort(sortBySubmissionDate);

  // Render status cell
  const renderStatusCell = ({ row }) => {
    const statusColors = {
      verified: "bg-[#82ffa3] text-[#0d7b3e]",
      rejected: "bg-[#eac3c3] text-red-500",
      approved: "bg-[#e8ffef] text-[#409261]",
      "request for action": "bg-[#e4e4e4] text-[#6b6b6b]",
      submitted: "bg-[#e8ffef] text-black",
    };
    const statusColor = statusColors[row?.original?.status] || "";
    return (
      <span
        className={`px-3 py-1 rounded-full flex w-fit items-center ${statusColor}`}
      >
        <span className="w-[6px] h-[6px] rounded-full bg-current mr-2"></span>
        <span className="text-sm font-light">{row?.original?.status}</span>
      </span>
    );
  };

  const renderActionCell = ({ row }) => {
    return (
      <menu className="flex items-center gap-2">
        <FontAwesomeIcon
          onClick={(e) => {
            handleEditClick(e, row);
            handleClickAction();
          }}
          icon={actionIcon}
          className="text-primary cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
        />
      </menu>
    );
  };

  const columns = [
    { header: "Company Code", accessorKey: "reg_number" },
    { header: "Company/Enterprise Name", accessorKey: "company_name" },
    { header: "Company/Enterprise Type", accessorKey: "service_name" },
    {
      header: "Application Status",
      accessorKey: "status",
      cell: renderStatusCell,
    },
    { header: "Registration Date", accessorKey: "submission_date" },
    {
      header: "Action",
      accessorKey: "action",
      enableSorting: false,
      cell: renderActionCell,
    },
  ];

  const handleEditClick = (e, row) => {
    e.preventDefault();
    const company = user_applications?.find(
      (application) => application.entry_id === row?.original?.id
    );
    if (!company) return;

    if (company.type === "business_registration") {
      dispatch(setBusinessActiveTab("general_information"));
      dispatch(setBusinessActiveStep("company_details"));
    } else if (company.type === "enterprise") {
      dispatch(setEnterpriseActiveTab("enterprise_details"));
      dispatch(setEnterpriseActiveStep("enterprise_details"));
    } else if (company.type === "foreign_branch") {
      dispatch(setForeignBusinessActiveTab("foreign_general_information"));
      dispatch(setForeignBusinessActiveStep("foreign_company_details"));
    }

    navigate(row.original?.path);
  };

  return (
    <section className="flex flex-col gap-4">
      <menu className="px-8 py-3 text-white rounded-md max-sm:w-full w-72 bg-primary">
        {title}
      </menu>
      <section className="flex flex-col h-full gap-16 p-12 bg-white rounded-md shadow-sm">
        <h1 className="font-semibold text-center">{description}</h1>
        {companies.length > 0 ? (
          <Table
            columns={columns}
            data={companies}
            className="bg-white rounded-xl"
            showFilter={false}
            showPagination={false}
          />
        ) : (
          <span className="flex items-center justify-start w-full">
            <h1 className="uppercase text-primary">{notDataMessage}</h1>
          </span>
        )}
      </section>
    </section>
  );
};

export default ApplicatinsList;
