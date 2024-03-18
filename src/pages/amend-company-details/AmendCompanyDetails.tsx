import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../containers/UserLayout";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import Table from "../../components/table/Table";
import { RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import {
  setBeneficialOwners,
  setBoardDirectors,
  setBusinessActiveStep,
  setBusinessActiveTab,
  setCapitalDetails,
  setCompanyActivities,
  setCompanyAddress,
  setCompanyAttachments,
  setCompanyDetails,
  setEmploymentInfo,
  setSeniorManagement,
  setShareDetails,
  setShareHolders,
} from "../../states/features/businessRegistrationSlice";
import { useNavigate } from "react-router-dom";

const AmendCompanyDetails = () => {
  const { user_applications } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const companies = user_applications?.map((application) => {
    return {
      ...application.company_details,
      id: application.entry_id,
      company_code: application.company_code || "1231",
      application_status: application.status || "submitted",
      registration_date:
        application.created_at ||
        moment(Date.now() + 1000 * 60 * 60 * 24).format("MM/DD/YYYY"),
    };
  });

  const columns = [
    {
      header: "Company Code",
      accessorKey: "company_code",
    },
    {
      header: "Company/Enterprise Name",
      accessorKey: "name",
    },
    {
      header: "Company/Enterprise Type",
      accessorKey: "type",
    },
    {
      header: "Application Status",
      accessorKey: "application_status",
      cell: ({ row }) => {
        return (
          <span
            className={`px-3 py-1 rounded-full flex w-fit items-center ${colors(
              row?.original?.application_status.toLowerCase()
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
      header: "Registration Date",
      accessorKey: "registration_date",
    },
    {
      header: "Action",
      accessorKey: "action",
      enableSorting: false,
      cell: ({ row }: { row: unknown }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                const company = user_applications?.find(
                  (application) => application.entry_id === row?.original?.id
                );
                dispatch(setBusinessActiveTab("general_information"));
                dispatch(setBusinessActiveStep("company_details"));
                dispatch(setCompanyDetails(company?.company_details || {}));
                dispatch(setCompanyAddress(company?.company_address || {}));
                dispatch(
                  setCompanyActivities(company?.company_activities || {})
                );
                dispatch(setBeneficialOwners(company?.beneficial_owners || []));
                dispatch(setBoardDirectors(company?.board_of_directors || []));
                dispatch(setCapitalDetails(company?.capital_details || []));
                dispatch(
                  setCompanyAttachments(company?.company_attachments || [])
                );
                dispatch(setEmploymentInfo(company?.employment_info || {}));
                dispatch(setSeniorManagement(company?.senior_management || []));
                dispatch(setShareDetails(company?.share_details || {}));
                dispatch(setShareHolders(company?.shareholders || []));
                navigate(
                  `/business-registration?entry_id=${row?.original?.id}`
                );
              }}
              icon={faEdit}
              className="text-primary cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full"
            />
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
      return "bg-[#e8ffef] text-[#409261]";
    }
    if (status === "request for action") {
      return "bg-[#e4e4e4] text-[#6b6b6b]";
    }
    if (status === "submitted") {
      return "bg-[#e8ffef] text-black";
    }
  };

  // const companies = [
  //   {
  //     company_code: "1231",
  //     company_name: "ZXY LTD",
  //     company_type: "Domestic",
  //     application_status: "approved",
  //     registration_date: "5/27/2023",
  //   },
  //   {
  //     company_code: "1232",
  //     company_name: "RD",
  //     company_type: "Foreign",
  //     application_status: "approved",
  //     registration_date: "5/27/2023",
  //   },
  // ];

  return (
    <UserLayout>
      <section className="flex flex-col gap-4">
        <menu className="px-8 py-3 text-white rounded-md max-sm:w-full w-72 bg-primary">
          Amend Company Details
        </menu>
        <section className="flex flex-col h-full gap-16 p-12 bg-white rounded-md shadow-sm">
          <h1 className="font-semibold text-center">
            Choose Company To Amend Details
          </h1>
          <Table
            columns={columns}
            data={companies}
            className="bg-white rounded-xl"
            showFilter={false}
            showPagination={false}
          />
        </section>
      </section>
    </UserLayout>
  );
};

export default AmendCompanyDetails;
