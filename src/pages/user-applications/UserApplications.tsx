import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "../../components/table/Table";
import UserLayout from "../../containers/UserLayout";
import Button from "../../components/inputs/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";
import { capitalizeString, formatCompanyData } from "../../helpers/strings";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from "../../states/features/businessRegistrationSlice";
import { useNavigate } from "react-router-dom";
import { ReviewComment } from "../../components/applications-review/AddReviewComments";
import { Row } from "@tanstack/react-table";
import { faEye, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { business_application } from "../business-applications/business-registration/preview-submission/BusinessPreviewSubmission";

const UserApplications = () => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const { applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registeredBusinesses = user_applications
    ?.filter((app: business_application) =>
      [
        'submitted',
        'approved',
        'rejected',
        'action_required',
        're_submitted',
      ].includes(app.status)
    )
    .map(formatCompanyData)
    .reverse();

  const colors = (status: string) => {
    const colorMap: { [key: string]: string } = {
      verified: "bg-[#82ffa3] text-[#0d7b3e]",
      rejected: "bg-[#eac3c3] text-red-500",
      approved: "bg-[#cfeaff] text-secondary",
      action_required: "bg-red-500 text-white",
      submitted: "bg-[#e8ffef] text-black",
      in_progress: "bg-[#f7f7f7] text-black",
    };
    return colorMap[status] || "";
  };

  const columns = [
    { header: 'Registration Number', accessorKey: 'reference_no' },
    { header: 'Company Name', accessorKey: 'company_name' },
    {
      header: 'Service Name',
      accessorKey: 'service_name',
      cell: ({
        row,
      }: {
        row: {
          original: {
            service_name: string;
          };
        };
      }) => (
        <span className="text-[13px]">
          {capitalizeString(row.original?.service_name) || 'N/A'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: renderStatusCell,
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    { header: 'Date Added', accessorKey: 'createdAt' },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'actions',
      enableSorting: false,
      cell: renderActionCell,
    },
  ];

  function renderStatusCell({ row }: {
    row: {
      original: {
        status: string;
      };
    };
  }) {
    return (
      <span
        className={`px-3 py-1 rounded-full flex w-fit items-center ${colors(
          row?.original?.status?.toLowerCase()
        )}`}
      >
        <span className="w-[6px] h-[6px] rounded-full bg-current mr-2"></span>
        <span className="text-[12px] font-light ">
          {capitalizeString(row?.original.status)}
        </span>
      </span>
    );
  }

  const hasComments = (applicationId: string) => {
    return applicationReviewComments.some(
      (comment: ReviewComment) =>
        comment?.entry_id === applicationId && !comment?.checked
    );
  };

  const handleEditClick = (row: {
    original: {
      path: string;
      entry_id: string;
    };
  }) => {
    dispatch(setBusinessActiveTab("preview_submission"));
    dispatch(setBusinessActiveStep("preview_submission"));
    navigate(row.original?.path);
  };

  function renderActionCell({
    row,
  }: {
    row: {
      original: {
        entry_id: string;
      };
    };
  }) {
    return (
      <menu className="flex items-start flex-col gap-2 w-full">
        <Button
          styled={false}
          value={
            <menu className="flex items-center gap-1 transition-all duration-300 bg-secondary p-1 px-2 rounded-md">
              <FontAwesomeIcon
                className="text-[12px] text-white"
                icon={faEye}
              />
              <p className="text-[12px] text-white">View details</p>
            </menu>
          }
          onClick={(e) => {
            e.preventDefault();
            navigate(`/company-details/${row?.original?.entry_id}`);
          }}
        />
        {hasComments(row?.original?.entry_id) && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleEditClick(
                row as {
                  original: {
                    path: string;
                    entry_id: string;
                  };
                }
              );
            }}
            value={
              <menu className="flex items-center gap-1 transition-all duration-300 bg-primary p-1 px-2 w-full rounded-md">
                <FontAwesomeIcon
                  className="text-[12px] text-white"
                  icon={faPenToSquare}
                />
                <p className="text-[12px] text-white">Make changes</p>
              </menu>
            }
            styled={false}
          />
        )}
      </menu>
    );
  }

  return (
    <UserLayout>
      <section className="flex flex-col w-full gap-6 p-8 bg-white rounded-md">
        <menu className="flex items-center justify-between w-full gap-3">
          <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
            My Applications List
          </h1>
          <Button
            primary
            route="/services"
            value={
              <menu className="flex text-[13px] items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                New application
              </menu>
            }
          />
        </menu>
        {user_applications?.length > 0 ? (
          <Table
            columns={columns}
            data={registeredBusinesses}
            rowClickHandler={(row: {
              original: {
                entry_id: string;
              }
            }) => {
              navigate(`/company-details/${row?.original?.entry_id}`);
            }}
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
