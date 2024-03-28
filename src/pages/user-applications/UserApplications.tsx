import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "../../components/table/Table";
import UserLayout from "../../containers/UserLayout";
import Button from "../../components/inputs/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";
import { formatCompanyData } from "../../helpers/strings";
import {
  business_registration_tabs_initial_state,
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessRegistrationTabs,
  setCompanySubActivities,
} from "../../states/features/businessRegistrationSlice";
import { useNavigate } from "react-router-dom";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { ReviewComment } from "../../components/applications-review/AddReviewComments";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from "../../states/features/enterpriseRegistrationSlice";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from "../../states/features/foreignBranchRegistrationSlice";

const UserApplications = () => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { application_review_comments } = useSelector(
    (state: RootState) => state.userApplication
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registeredBusinesses = user_applications
    .map(formatCompanyData)
    .sort(
      (a, b) =>
        new Date(b?.submissionDate).getTime() -
        new Date(a?.submissionDate).getTime()
    );

  const colors = (status: string) => {
    const colorMap = {
      verified: "bg-[#82ffa3] text-[#0d7b3e]",
      rejected: "bg-[#eac3c3] text-red-500",
      approved: "bg-[#cfeaff] text-secondary",
      "request for action": "bg-[#e4e4e4] text-[#6b6b6b]",
      submitted: "bg-[#e8ffef] text-black",
    };
    return colorMap[status] || "";
  };

  const columns = [
    { header: "Registration Number", accessorKey: "reg_number" },
    { header: "Company Name", accessorKey: "company_name" },
    { header: "Service Name", accessorKey: "service_name" },
    { header: "Status", accessorKey: "status", cell: renderStatusCell },
    { header: "Submission Date", accessorKey: "submission_date" },
    {
      header: "Action",
      accessorKey: "actions",
      enableSorting: false,
      cell: renderActionCell,
    },
  ];

  function renderStatusCell({ row }) {
    return (
      <span
        className={`px-3 py-1 rounded-full flex w-fit items-center ${colors(
          row?.original?.status?.toLowerCase()
        )}`}
      >
        <span className="w-[6px] h-[6px] rounded-full bg-current mr-2"></span>
        <span className="text-sm font-light ">{row?.original.status}</span>
      </span>
    );
  }

  const hasComments = (applicationId: string) => {
    return application_review_comments.some(
      (comment: ReviewComment) => comment?.entry_id === applicationId && !comment?.checked
    );
  };

  const handleEditClick = (row) => {
    if (row?.original?.service_name.toLowerCase() === "business_registration") {
      dispatch(setBusinessActiveTab("general_information"));
      dispatch(setBusinessActiveStep("company_details"));
    } else if (row?.original?.service_name.toLowerCase() === "enterprise") {
      dispatch(setEnterpriseActiveTab("enterprise_details"));
      dispatch(setEnterpriseActiveStep("enterprise_details"));
    } else if (row?.original?.service_name.toLowerCase() === "foreign_branch") {
      dispatch(setForeignBusinessActiveTab("foreign_general_information"));
      dispatch(setForeignBusinessActiveStep("foreign_company_details"));
    }

    navigate(row.original?.path);
  };

  function renderActionCell({ row }) {
    return (
      <menu className="flex items-center gap-2 cursor-pointer">
        <FontAwesomeIcon
          onClick={(e) => {
            e.preventDefault();
            navigate(`/company-details/${row?.original?.id}`);
          }}
          icon={faEye}
          className="text-primary"
        />
        {hasComments(row?.original?.id) && (
          <FontAwesomeIcon
            onClick={(e) => {
              e.preventDefault();
              handleEditClick(row);
            }}
            icon={faEdit}
            className="text-red-500 cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
          />
        )}
      </menu>
    );
  }

  return (
    <UserLayout>
      <section className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex items-center justify-between w-full gap-3">
          <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
            My Applications List
          </h1>
          <Button
            primary
            route="/business-registration/new"
            onClick={() => {
              dispatch(setCompanySubActivities([]));
              dispatch(
                setBusinessRegistrationTabs(
                  business_registration_tabs_initial_state
                )
              );
              dispatch(setBusinessActiveTab("general_information"));
              dispatch(setBusinessActiveStep("company_details"));
            }}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                New application
              </menu>
            }
          />
        </menu>
        {user_applications?.length > 0 ? (
          <Table
            showFilter={false}
            showPagination={false}
            columns={columns}
            data={registeredBusinesses}
            className="bg-white rounded-2xl"
          />
        ) : (
          <span className="flex items-center justify-start w-full">
            <h1 className="uppercase text-primary">
              You have no applications yet
            </h1>
          </span>
        )}
      </section>
    </UserLayout>
  );
};

export default UserApplications;
