import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../states/store";
import PreviewCard from "../../../components/business-registration/PreviewCard";
import {
  setForeignBeneficialOwners,
  setForeignBoardDirectors,
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
  setForeignCompanyActivities,
  setForeignCompanyAddress,
  setForeignCompanyAttachments,
  setForeignCompanyDetails,
  setForeignCompanySubActivities,
  setForeignEmploymentInfo,
  setForeignSeniorManagement,
  setForeignBusinessRegistrationTabs,
  foreign_business_registration_tabs_initial_state,
} from "../../../states/features/foreignBranchRegistrationSlice";
import { capitalizeString } from "../../../helpers/Strings";
import Table from "../../../components/table/Table";
import { countriesList } from "../../../constants/countries";
import Button from "../../../components/inputs/Button";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import { setUserApplications } from "../../../states/features/userApplicationSlice";

interface PreviewSubmissionProps {
  entry_id: string | null;
  current_application: any;
}

const PreviewSubmission = ({
  entry_id,
  current_application,
}: PreviewSubmissionProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const foreign_company_details = current_application?.foreign_company_details;
  const foreign_company_address = current_application?.foreign_company_address;
  const foreign_company_activities =
    current_application?.foreign_company_activities;
  const foreign_board_of_directors =
    current_application?.foreign_board_of_directors;
  const foreign_senior_management =
    current_application?.foreign_senior_management;
  const foreign_employment_info = current_application?.foreign_employment_info;
  const foreign_beneficial_owners =
    current_application?.foreign_beneficial_owners;
  const foreign_company_attachments =
    current_application?.foreign_company_attachments?.attachments;

  // NAVIGATION
  const navigate = useNavigate();

  // TABLE COLUMNS
  const managementColumns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Phone number",
      accessorKey: "phone",
    },
    {
      header: "Position",
      accessorKey: "position",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
  ];

  const beneficialOwnersColumns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Phone number",
      accessorKey: "phone",
    },
    {
      header: "Control type",
      accessorKey: "control_type",
    },
    {
      header: "Ownership type",
      accessorKey: "ownership_type",
    },
  ];

  return (
    <section className="flex flex-col w-full h-full gap-6 overflow-y-scroll">
      {/* COMPANY DETAILS */}
      {foreign_company_details && (
        <PreviewCard
          header="Company Details"
          tabName="foreign_general_information"
          stepName="foreign_company_details"
          setActiveStep={setForeignBusinessActiveStep}
          setActiveTab={setForeignBusinessActiveTab}
        >
          {Object?.entries(foreign_company_details)
            ?.filter(([key]) => key !== "step")
            ?.map(([key, value], index: number) => {
              return (
                <p key={index} className="flex items-center gap-1">
                  <span className="font-semibold">
                    {capitalizeString(key)}:
                  </span>{" "}
                  {String(value) && capitalizeString(String(value))}
                </p>
              );
            })}
        </PreviewCard>
      )}

      {/* COMPANY ADDRESS */}
      {foreign_company_address && (
        <PreviewCard
          header="Company Address"
          tabName="foreign_company_address"
          stepName="foreign_company_address"
          setActiveStep={setForeignBusinessActiveStep}
          setActiveTab={setForeignBusinessActiveTab}
        >
          {Object?.entries(foreign_company_address)
            ?.filter(([key]) => key !== "step")
            ?.map(([key, value], index: number) => {
              return (
                <p key={index} className="flex items-center gap-1">
                  <span className="font-semibold">
                    {capitalizeString(key)}:
                  </span>{" "}
                  {String(value)}
                </p>
              );
            })}
        </PreviewCard>
      )}

      {/* COMPANY ACTIVITIES */}
      <PreviewCard
        header="Business Activities & VAT"
        tabName="foreign_general_information"
        stepName="foreign_business_activity_vat"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
      >
        <p className="font-semibold">
          Register for VAT:{" "}
          <span className="font-normal">
            {foreign_company_activities?.vat &&
              capitalizeString(foreign_company_activities?.vat)}
          </span>
        </p>
        <p className="font-semibold">
          Annual turnover:{" "}
          <span className="font-normal">
            {foreign_company_activities?.turnover
              ? String(capitalizeString(foreign_company_activities?.turnover))
              : "N/A"}
          </span>
        </p>
        <menu className="flex flex-col gap-3">
          <h3 className="font-semibold underline text-md">Business lines: </h3>
          <ul className="flex flex-col gap-2">
            {foreign_company_activities?.business_lines?.map((line, index) => {
              return (
                <li key={index} className="flex items-center gap-1">
                  {line?.name}
                </li>
              );
            })}
          </ul>
        </menu>
      </PreviewCard>

      {/* BOARD OF DIRECTORS */}
      <PreviewCard
        header="Board of Directors"
        tabName="foreign_management"
        stepName="foreign_board_of_directors"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          tableTitle="Board of directors"
          columns={managementColumns}
          data={foreign_board_of_directors?.map((director) => {
            return {
              ...director,
              name: `${director?.first_name} ${director?.last_name}`,
              phone: director?.phone,
              position:
                director?.position && capitalizeString(director?.position),
              country: countriesList?.find(
                (country) => country?.code === director?.country
              )?.name,
            };
          })}
        />
      </PreviewCard>

      {/* SENIOR MANAGEMENT */}
      <PreviewCard
        header="Senior Management"
        tabName="foreign_management"
        stepName="foreign_senior_management"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          tableTitle="Senior Management"
          columns={managementColumns}
          data={foreign_senior_management?.map((director) => {
            return {
              ...director,
              name: `${director?.first_name} ${director?.last_name}`,
              phone: director?.phone,
              position:
                director?.position && capitalizeString(director?.position),
              country: countriesList?.find(
                (country) => country?.code === director?.country
              )?.name,
            };
          })}
        />
      </PreviewCard>

      {/* EMPLOYMENT INFO */}
      <PreviewCard
        header="Employment Information"
        tabName="foreign_management"
        stepName="foreign_employment_info"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
      >
        <p className="font-semibold">
          Company has employees:{" "}
          <span className="font-normal">
            {foreign_employment_info?.has_employees &&
              capitalizeString(foreign_employment_info?.has_employees)}
          </span>
        </p>
        {foreign_employment_info?.has_employees !== "no" && (
          <p className="font-semibold">
            Number of employees:{" "}
            <span className="font-normal">
              {foreign_employment_info?.number_of_employees}
            </span>
          </p>
        )}
        <p>
          <span className="font-semibold">
            Account reference date:{" "}
            <span className="font-normal">
              {foreign_employment_info?.reference_date || "N/A"}
            </span>
          </span>
        </p>
      </PreviewCard>

      {/* BENEFICIAL OWNERS */}
      <PreviewCard
        header="Beneficial Owners"
        tabName="foreign_beneficial_owners"
        stepName="foreign_beneficial_owners"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
      >
        <Table
          data={foreign_beneficial_owners?.map((owner) => {
            return {
              ...owner,
              name: owner?.company_name
                ? owner?.company_name
                : `${owner?.first_name} ${owner?.last_name}`,
              phone: owner?.phone || owner?.company_phone,
              control_type: capitalizeString(owner?.control_type),
              ownership_type: capitalizeString(owner?.ownership_type),
            };
          })}
          columns={beneficialOwnersColumns}
          tableTitle="Beneficial owners"
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      {/* ATTACHMENTS */}
      <PreviewCard
        header="Attachments"
        tabName="foreign_attachments"
        stepName="foreign_attachments"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
      >
        <section className="flex flex-col gap-5">
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Board of directors
            </h3>
            {foreign_board_of_directors?.map((director, index) => {
              if (director?.attachment) {
                return (
                  <p
                    key={index}
                    className="flex items-center justify-between w-full gap-6 font-normal"
                  >
                    {director?.first_name || ""} {director?.last_name || ""}:{" "}
                    <span className="font-semibold">
                      {director?.attachment}
                    </span>
                  </p>
                );
              }
            })}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Senior management
            </h3>
            {foreign_senior_management?.map((senior, index) => {
              if (senior?.attachment) {
                return (
                  <p
                    key={index}
                    className="flex items-center justify-between w-full gap-6 font-normal"
                  >
                    {senior?.first_name || ""} {senior?.last_name || ""}:{" "}
                    <span className="font-semibold">{senior?.attachment}</span>
                  </p>
                );
              }
            })}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Beneficial owners
            </h3>
            {foreign_beneficial_owners?.map((beneficial_owner, index) => {
              if (beneficial_owner?.attachment) {
                if (beneficial_owner?.beneficial_type === "person") {
                  return (
                    <p
                      key={index}
                      className="flex items-center justify-between w-full gap-6 font-normal"
                    >
                      {beneficial_owner?.first_name || ""}{" "}
                      {beneficial_owner?.last_name || ""}:{" "}
                      <span className="font-semibold">
                        {beneficial_owner?.attachment}
                      </span>
                    </p>
                  );
                } else {
                  return (
                    <p
                      key={index}
                      className="flex items-center justify-between w-full gap-6 font-normal"
                    >
                      {beneficial_owner?.company_name || ""}:{" "}
                      <span className="font-semibold">
                        {beneficial_owner?.attachment}
                      </span>
                    </p>
                  );
                }
              }
            })}
          </menu>
        </section>
      </PreviewCard>
      <menu
        className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
      >
        <Button
          value="Back"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setForeignBusinessActiveStep("foreign_attachments"));
            dispatch(setForeignBusinessActiveTab("foreign_attachments"));
          }}
        />
        <Button
          value={isLoading ? <Loader /> : "Submit"}
          primary
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              dispatch(
                setUserApplications({
                  entry_id,
                  status: "submitted",
                })
              );
              dispatch(setForeignCompanyDetails(null));
              dispatch(setForeignCompanyAddress(null));
              dispatch(setForeignCompanyActivities(null));
              dispatch(setForeignBoardDirectors([]));
              dispatch(setForeignSeniorManagement([]));
              dispatch(setForeignEmploymentInfo(null));
              dispatch(setForeignBeneficialOwners([]));
              dispatch(setForeignCompanyAttachments([]));
              dispatch(
                setForeignBusinessCompletedStep("foreign_preview_submission")
              );
              dispatch(
                setForeignBusinessActiveTab("foreign_general_information")
              );
              dispatch(setForeignBusinessActiveStep("foreign_company_details"));
              dispatch(setForeignCompanySubActivities([]));
              dispatch(
                setForeignBusinessRegistrationTabs(
                  foreign_business_registration_tabs_initial_state
                )
              );
              navigate("/success", {
                state: { redirectUrl: "/user-applications" },
              });
            }, 1000);
          }}
        />
      </menu>
    </section>
  );
};

export default PreviewSubmission;
