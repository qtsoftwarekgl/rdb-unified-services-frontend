import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/store";
import PreviewCard from "../../../components/business-registration/PreviewCard";
import {
  setBeneficialOwners,
  setBoardDirectors,
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setCapitalDetails,
  setCompanyActivities,
  setCompanyAddress,
  setCompanyAttachments,
  setCompanyDetails,
  setCompanySubActivities,
  setEmploymentInfo,
  setSeniorManagement,
  setShareDetails,
  setShareHolders,
  business_registration_tabs_initial_state,
  setBusinessRegistrationTabs,
} from "../../../states/features/businessRegistrationSlice";
import { capitalizeString } from "../../../helpers/Strings";
import Table from "../../../components/table/Table";
import { countriesList } from "../../../constants/countries";
import Button from "../../../components/inputs/Button";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import moment from "moment";

interface PreviewSubmissionProps {
  isOpen: boolean;
}

const PreviewSubmission: FC<PreviewSubmissionProps> = ({ isOpen }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    company_details,
    company_address,
    company_activities,
    board_of_directors,
    senior_management,
    employment_info,
    share_details,
    shareholders,
    capital_details,
    beneficial_owners,
    company_attachments,
  } = useSelector((state: RootState) => state.businessRegistration);

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

  const shareholdersColumns = [
    {
      header: "Shareholder",
      accessorKey: "name",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Phone number",
      accessorKey: "phone",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
  ];

  const capitalDetailsColumns = [
    {
      header: "Shareholder",
      accessorKey: "name",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Phone number",
      accessorKey: "phone",
    },
    {
      header: "Total shares",
      accessorKey: "total_shares",
    },
    {
      header: "Total value",
      accessorKey: "total_value",
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

  // CATCH PROGRESS ID
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const entry_id = queryParams.get("entry_id");

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full h-full gap-6 overflow-y-scroll">
      {/* COMPANY DETAILS */}
      {company_details && (
        <PreviewCard
          header="Company Details"
          tabName="general_information"
          stepName="company_details"
          setActiveStep={setBusinessActiveStep}
          setActiveTab={setBusinessActiveTab}
        >
          {Object?.entries(company_details)
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
      {company_address && (
        <PreviewCard
          header="Company Address"
          tabName="company_address"
          stepName="company_address"
          setActiveStep={setBusinessActiveStep}
          setActiveTab={setBusinessActiveTab}
        >
          {Object?.entries(company_address)
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
        tabName="general_information"
        stepName="business_activity_vat"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Register for VAT:{" "}
          <span className="font-normal">
            {company_activities?.vat &&
              capitalizeString(company_activities?.vat)}
          </span>
        </p>
        <p className="font-semibold">
          Annual turnover:{" "}
          <span className="font-normal">
            {company_activities?.turnover
              ? String(capitalizeString(company_activities?.turnover))
              : "N/A"}
          </span>
        </p>
        <menu className="flex flex-col gap-3">
          <h3 className="font-semibold underline text-md">Business lines: </h3>
          <ul className="flex flex-col gap-2">
            {company_activities?.business_lines?.map((line, index) => {
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
        tabName="management"
        stepName="board_of_directors"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          tableTitle="Board of directors"
          columns={managementColumns}
          data={board_of_directors?.map((director) => {
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
        tabName="management"
        stepName="senior_management"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          tableTitle="Senior Management"
          columns={managementColumns}
          data={senior_management?.map((director) => {
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
        tabName="management"
        stepName="employment_info"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Company has employees:{" "}
          <span className="font-normal">
            {employment_info?.has_employees &&
              capitalizeString(employment_info?.has_employees)}
          </span>
        </p>
        {employment_info?.has_employees !== "no" && (
          <p className="font-semibold">
            Number of employees:{" "}
            <span className="font-normal">
              {employment_info?.number_of_employees}
            </span>
          </p>
        )}
        <p>
          <span className="font-semibold">
            Account reference date:{" "}
            <span className="font-normal">
              {employment_info?.reference_date || "N/A"}
            </span>
          </span>
        </p>
      </PreviewCard>

      {/* SHARE DETAILS */}
      <PreviewCard
        header="Share Details"
        tabName="capital_information"
        stepName="share_details"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Total business capital:{" "}
          <span className="font-normal">
            RWF {share_details?.company_capital}
          </span>
        </p>
        <p className="font-semibold">
          Total assignable shares:{" "}
          <span className="font-normal">{share_details?.total_shares}</span>
        </p>
        <p className="font-semibold">
          Total assignable shares' values:{" "}
          <span className="font-normal">RWF {share_details?.total_value}</span>
        </p>
        <p className="font-semibold">
          Remaining capital:{" "}
          <span className="font-normal">
            RWF{" "}
            {Number(share_details?.company_capital) -
              Number(share_details?.total_value)}
          </span>
        </p>
      </PreviewCard>

      {/* SHAREHOLDERS */}
      <PreviewCard
        header="Shareholders"
        tabName="capital_information"
        stepName="shareholders"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          data={shareholders?.map((shareholder) => {
            return {
              ...shareholder,
              name: shareholder?.company_name
                ? shareholder?.company_name
                : `${shareholder?.first_name} ${shareholder?.last_name}`,
              type:
                shareholder?.shareholder_type &&
                capitalizeString(shareholder?.shareholder_type),
              phone: shareholder?.phone || shareholder?.company_phone,
              country: countriesList?.find(
                (country) =>
                  country?.code ===
                  (shareholder?.country || shareholder?.incorporation_country)
              )?.name,
            };
          })}
          columns={shareholdersColumns}
          tableTitle="Shareholders"
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      {/* CAPITAL DETAILS */}
      <PreviewCard
        header="Capital Details"
        tabName="capital_information"
        stepName="capital_details"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          tableTitle="Capital Details"
          data={capital_details?.map((shareholder) => {
            return {
              ...shareholder,
              name: shareholder?.company_name
                ? shareholder?.company_name
                : `${shareholder?.first_name} ${shareholder?.last_name}`,
              type:
                shareholder?.shareholder_type &&
                capitalizeString(shareholder?.shareholder_type),
              phone: shareholder?.phone || shareholder?.company_phone,
              country: countriesList?.find(
                (country) =>
                  country?.code ===
                  (shareholder?.country || shareholder?.incorporation_country)
              )?.name,
              total_shares: shareholder?.shares?.total_shares,
              total_value: `RWF ${shareholder?.shares?.total_value}`,
            };
          })}
          columns={capitalDetailsColumns}
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      {/* BENEFICIAL OWNERS */}
      <PreviewCard
        header="Beneficial Owners"
        tabName="beneficial_owners"
        stepName="beneficial_owners"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          data={beneficial_owners?.map((owner) => {
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
        tabName="attachments"
        stepName="attachments"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <section className="flex flex-col gap-5">
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Board of directors
            </h3>
            {board_of_directors?.map((director, index) => {
              if (director?.attachment) {
                return (
                  <p
                    key={index}
                    className="flex items-center justify-between w-full gap-6 font-normal"
                  >
                    {director?.first_name} {director?.last_name}:{" "}
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
            {senior_management?.map((senior, index) => {
              if (senior?.attachment) {
                return (
                  <p
                    key={index}
                    className="flex items-center justify-between w-full gap-6 font-normal"
                  >
                    {senior?.first_name} {senior?.last_name}:{" "}
                    <span className="font-semibold">{senior?.attachment}</span>
                  </p>
                );
              }
            })}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">Shareholders</h3>
            {shareholders?.map((shareholder, index) => {
              if (shareholder?.attachment) {
                if (shareholder?.shareholder_type === "person") {
                  return (
                    <p
                      key={index}
                      className="flex items-center justify-between w-full gap-6 font-normal"
                    >
                      {shareholder?.first_name} {shareholder?.last_name}:{" "}
                      <span className="font-semibold">
                        {shareholder?.attachment}
                      </span>
                    </p>
                  );
                } else {
                  return (
                    <p
                      key={index}
                      className="flex items-center justify-between w-full gap-6 font-normal"
                    >
                      {shareholder?.company_name}:{" "}
                      <span className="font-semibold">
                        {shareholder?.attachment}
                      </span>
                    </p>
                  );
                }
              }
            })}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Beneficial owners
            </h3>
            {beneficial_owners?.map((beneficial_owner, index) => {
              if (beneficial_owner?.attachment) {
                if (beneficial_owner?.beneficial_type === "person") {
                  return (
                    <p
                      key={index}
                      className="flex items-center justify-between w-full gap-6 font-normal"
                    >
                      {beneficial_owner?.first_name}{" "}
                      {beneficial_owner?.last_name}:{" "}
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
                      {beneficial_owner?.company_name}:{" "}
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
            dispatch(setBusinessActiveStep("attachments"));
            dispatch(setBusinessActiveTab("attachments"));
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
                  type: "business_registration",
                  company_details,
                  company_address,
                  company_activities,
                  board_of_directors,
                  senior_management,
                  employment_info,
                  share_details,
                  shareholders,
                  capital_details,
                  beneficial_owners,
                  company_attachments,
                  path: `/business-registration/?entry_id=${entry_id}`,
                  created_at: moment(Date.now()).format("DD/MM/YYYY"),
                })
              );
              dispatch(setCompanyDetails(null));
              dispatch(setCompanyAddress(null));
              dispatch(setCompanyActivities(null));
              dispatch(setBoardDirectors([]));
              dispatch(setSeniorManagement([]));
              dispatch(setEmploymentInfo(null));
              dispatch(setShareDetails(null));
              dispatch(setShareHolders([]));
              dispatch(setCapitalDetails([]));
              dispatch(setBeneficialOwners([]));
              dispatch(setCompanyAttachments([]));
              dispatch(setBusinessCompletedStep("preview_submission"));
              dispatch(setBusinessActiveTab("general_information"));
              dispatch(setBusinessActiveStep("company_details"));
              dispatch(setCompanySubActivities([]));
              dispatch(
                setBusinessRegistrationTabs(
                  business_registration_tabs_initial_state
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
