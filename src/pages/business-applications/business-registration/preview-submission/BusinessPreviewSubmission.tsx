import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import PreviewCard from "../../../../components/business-registration/PreviewCard";
import {
  business_registration_tabs_initial_state,
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setBusinessPersonDetailsModal,
  setBusinessRegistrationTabs,
} from "../../../../states/features/businessRegistrationSlice";
import { capitalizeString, formatDate } from "../../../../helpers/strings";
import Table from "../../../../components/table/Table";
import { countriesList } from "../../../../constants/countries";
import Button from "../../../../components/inputs/Button";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { setUserApplications } from "../../../../states/features/userApplicationSlice";
import { business_company_details } from "../general-information/CompanyDetails";
import { business_company_address } from "../general-information/CompanyAddress";
import { business_company_activities } from "../general-information/BusinessActivity";
import { business_board_of_directors } from "../management/BoardDirectors";
import { business_senior_management } from "../management/SeniorManagement";
import { business_employment_info } from "../management/EmploymentInfo";
import { business_share_details } from "../capital-information/ShareDetails";
import { business_shareholders } from "../capital-information/ShareHolders";
import { business_beneficial_owners } from "../beneficial-owners/BeneficialOwners";
import { business_company_attachments } from "../attachments/CompanyAttachments";
import { business_capital_details } from "../capital-information/CapitalDetails";
import moment from "moment";
import { provicesList } from "../../../../constants/provinces";
import { districtsList } from "../../../../constants/districts";
import { sectorsList } from "../../../../constants/sectors";
import { cellsList } from "../../../../constants/cells";
import { villagesList } from "../../../../constants/villages";
import ViewDocument from "../../../user-company-details/ViewDocument";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { previewUrl } from "../../../../constants/authentication";
import { setIsAmending } from "../../../../states/features/amendmentSlice";
import BusinessPersonDetails from "../BusinessPersonDetails";
import { ReviewComment } from "@/components/applications-review/AddReviewComments";
import { TabType } from "@/states/features/types";
import { RDBAdminEmailPattern } from "@/constants/Users";

interface business_application {
  entry_id: string;
  type: string;
  company_details: business_company_details;
  company_address: business_company_address;
  company_activities: business_company_activities;
  board_of_directors: business_board_of_directors[];
  senior_management: business_senior_management[];
  employment_info: business_employment_info;
  share_details: business_share_details;
  shareholders: business_shareholders[];
  capital_details: business_capital_details[];
  beneficial_owners: business_beneficial_owners[];
  company_attachments: business_company_attachments;
  status: string;
}

interface PreviewSubmissionProps {
  isOpen: boolean;
  business_application: business_application;
  status: string;
}

const PreviewSubmission: FC<PreviewSubmissionProps> = ({
  isOpen,
  business_application,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [attachmentPreview, setAttachmentPreview] = useState<string>("");
  const [businessPersonDetails, setBusinessPersonDetails] = useState<
    business_beneficial_owners | business_shareholders | null
  >(null);
  const { applicationReviewComments } = useSelector(
    (state: RootState) => state.userApplication
  );

  // UNRESOLVED COMMENTS
  const unresolvedApplicationComments = applicationReviewComments.filter(
      (comment: ReviewComment) =>
        comment?.entry_id === business_application?.entry_id &&
        !comment?.checked
    ).length;

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
      {(business_application?.company_details ||
        business_application?.status === 'in_review') && (
        <PreviewCard
          entry_id={business_application?.entry_id}
          header="Company Details"
          tabName="general_information"
          stepName="company_details"
          setActiveStep={setBusinessActiveStep}
          setActiveTab={setBusinessActiveTab}
        >
          {business_application?.company_details &&
            Object?.entries(business_application?.company_details)
              ?.filter(([key]) => key !== 'step')
              ?.map(([key, value], index: number) => {
                return (
                  <p key={index} className="flex items-center gap-2">
                    <span className="">{capitalizeString(key)}:</span>{' '}
                    <span className="font-bold">
                      {String(value) && capitalizeString(String(value))}
                    </span>
                  </p>
                );
              })}
        </PreviewCard>
      )}

      {/* COMPANY ADDRESS */}
      {business_application?.company_address && (
        <PreviewCard
          entry_id={business_application?.entry_id}
          header="Company Address"
          tabName="general_information"
          stepName="company_address"
          setActiveStep={setBusinessActiveStep}
          setActiveTab={setBusinessActiveTab}
        >
          {Object?.entries(business_application?.company_address)
            ?.filter(([key]) => key !== 'step')
            ?.map(([key, value], index: number) => {
              return (
                <p key={index} className="flex items-center gap-2">
                  <span className="">{capitalizeString(key)}:</span>{' '}
                  <span className="font-bold">
                    {String(
                      provicesList.find((province) => province.code === value)
                        ?.name ||
                        districtsList.find(
                          (district) => district.code === value
                        )?.name ||
                        sectorsList.find((sector) => sector.code === value)
                          ?.name ||
                        cellsList.find((cell) => cell.code === value)?.name ||
                        villagesList.find((village) => village.code === value)
                          ?.name ||
                        value
                    ) ?? ''}
                  </span>
                </p>
              );
            })}
        </PreviewCard>
      )}

      {/* COMPANY ACTIVITIES */}
      <PreviewCard
        entry_id={business_application?.entry_id}
        header="Business Activities & VAT"
        tabName="general_information"
        stepName="business_activity_vat"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Register for VAT:{' '}
          <span className="font-normal">
            {business_application?.company_activities?.vat &&
              capitalizeString(business_application?.company_activities?.vat)}
          </span>
        </p>
        <p className="font-semibold">
          Annual turnover:{' '}
          <span className="font-normal">
            {business_application?.company_activities?.turnover
              ? capitalizeString(
                  String(business_application?.company_activities?.turnover)
                )
              : 'N/A'}
          </span>
        </p>
        <menu className="flex flex-col gap-3">
          <h3 className="font-semibold underline text-md">Business lines: </h3>
          <ul className="flex flex-col gap-2">
            {business_application?.company_activities?.business_lines?.map(
              (line, index) => {
                return (
                  <li key={index} className="flex items-center gap-1">
                    {line?.name}
                  </li>
                );
              }
            )}
          </ul>
        </menu>
      </PreviewCard>

      {/* BOARD OF DIRECTORS */}
      <PreviewCard
        entry_id={business_application?.entry_id}
        header="Board of Directors"
        tabName="management"
        stepName="board_of_directors"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(true));
            setBusinessPersonDetails(row?.original);
          }}
          columns={managementColumns}
          data={
            business_application?.board_of_directors?.length > 0
              ? business_application?.board_of_directors?.map((director) => {
                  return {
                    ...director,
                    name: `${director?.first_name || ''} ${
                      director?.last_name || ''
                    }`,
                    phone: director?.phone,
                    position:
                      director?.position &&
                      capitalizeString(director?.position),
                    country: countriesList?.find(
                      (country) => country?.code === director?.country
                    )?.name,
                  };
                })
              : []
          }
        />
      </PreviewCard>

      {/* SENIOR MANAGEMENT */}
      <PreviewCard
        entry_id={business_application?.entry_id}
        header="Senior Management"
        tabName="management"
        stepName="senior_management"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(true));
            setBusinessPersonDetails(row?.original);
          }}
          columns={managementColumns}
          data={
            business_application?.senior_management?.length > 0
              ? business_application?.senior_management?.map((director) => {
                  return {
                    ...director,
                    name: `${director?.first_name || ''} ${
                      director?.last_name || ''
                    }`,
                    phone: director?.phone,
                    position:
                      director?.position &&
                      capitalizeString(director?.position),
                    country: countriesList?.find(
                      (country) => country?.code === director?.country
                    )?.name,
                  };
                })
              : []
          }
        />
      </PreviewCard>

      {/* EMPLOYMENT INFO */}
      <PreviewCard
        entry_id={business_application?.entry_id}
        header="Employment Information"
        tabName="management"
        stepName="employment_info"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Company has employees:{' '}
          <span className="font-normal">
            {business_application?.employment_info?.has_employees &&
              capitalizeString(
                business_application?.employment_info?.has_employees
              )}
          </span>
        </p>
        {business_application?.employment_info?.has_employees !== 'no' && (
          <p className="font-semibold">
            Number of employees:{' '}
            <span className="font-normal">
              {business_application?.employment_info?.number_of_employees}
            </span>
          </p>
        )}
        <p>
          <span className="font-semibold">
            Account reference date:{' '}
            <span className="font-normal">
              {formatDate(
                business_application?.employment_info?.reference_date
              ) || 'N/A'}
            </span>
          </span>
        </p>
      </PreviewCard>

      {/* SHARE DETAILS */}
      <PreviewCard
        entry_id={business_application?.entry_id}
        header="Share Details"
        tabName="capital_information"
        stepName="share_details"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Total business capital:{' '}
          <span className="font-normal">
            RWF {business_application?.share_details?.company_capital}
          </span>
        </p>
        <p className="font-semibold">
          Total assignable shares:{' '}
          <span className="font-normal">
            {business_application?.share_details?.total_shares}
          </span>
        </p>
        <p className="font-semibold">
          Total assignable shares' values:{' '}
          <span className="font-normal">
            RWF {business_application?.share_details?.total_value}
          </span>
        </p>
        <p className="font-semibold">
          Remaining capital:{' '}
          <span className="font-normal">
            RWF{' '}
            {Number(business_application?.share_details?.company_capital) -
              Number(business_application?.share_details?.total_value)}
          </span>
        </p>
      </PreviewCard>

      {/* SHAREHOLDERS */}
      <PreviewCard
        entry_id={business_application?.entry_id}
        header="Shareholders"
        tabName="capital_information"
        stepName="shareholders"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          data={
            business_application?.shareholders?.length > 0
              ? business_application?.shareholders?.map((shareholder) => {
                  return {
                    ...shareholder,
                    name: shareholder?.company_name
                      ? shareholder?.company_name
                      : `${shareholder?.first_name || ''} ${
                          shareholder?.last_name || ''
                        }`,
                    type:
                      shareholder?.type && capitalizeString(shareholder?.type),
                    phone: shareholder?.phone || shareholder?.company_phone,
                    country: countriesList?.find(
                      (country) =>
                        country?.code ===
                        (shareholder?.country ||
                          shareholder?.incorporation_country)
                    )?.name,
                  };
                })
              : []
          }
          columns={shareholdersColumns}
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(true));
            setBusinessPersonDetails(row?.original);
          }}
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      {/* CAPITAL DETAILS */}
      <PreviewCard
        entry_id={business_application?.entry_id}
        header="Capital Details"
        tabName="capital_information"
        stepName="capital_details"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(row?.original));
            setBusinessPersonDetails(row?.original);
          }}
          data={
            business_application?.capital_details?.length > 0
              ? business_application?.capital_details?.map((shareholder) => {
                  return {
                    ...shareholder,
                    name: shareholder?.company_name
                      ? shareholder?.company_name
                      : `${shareholder?.first_name || ''} ${
                          shareholder?.last_name || ''
                        }`,
                    type:
                      shareholder?.type && capitalizeString(shareholder?.type),
                    phone: shareholder?.phone || shareholder?.company_phone,
                    country: countriesList?.find(
                      (country) =>
                        country?.code ===
                        (shareholder?.country ||
                          shareholder?.incorporation_country)
                    )?.name,
                    total_shares: shareholder?.shares?.total_shares,
                    total_value: `RWF ${shareholder?.shares?.total_value}`,
                  };
                })
              : []
          }
          columns={capitalDetailsColumns}
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      {/* BENEFICIAL OWNERS */}
      <PreviewCard
        entry_id={business_application?.entry_id}
        header="Beneficial Owners"
        tabName="beneficial_owners"
        stepName="beneficial_owners"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          data={
            business_application?.beneficial_owners?.length > 0
              ? business_application?.beneficial_owners?.map((owner) => {
                  return {
                    ...owner,
                    name: owner?.company_name
                      ? owner?.company_name
                      : `${owner?.first_name || ''} ${owner?.last_name || ''}`,
                    phone: owner?.phone || owner?.company_phone,
                    control_type: capitalizeString(owner?.control_type),
                    ownership_type: capitalizeString(owner?.ownership_type),
                  };
                })
              : []
          }
          columns={beneficialOwnersColumns}
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(true));
            setBusinessPersonDetails(row?.original);
          }}
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      {/* ATTACHMENTS */}
      <PreviewCard
        entry_id={business_application?.entry_id}
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
            {business_application?.board_of_directors?.map(
              (director, index) => {
                if (director?.attachment?.name) {
                  return (
                    <p
                      key={index}
                      className="flex items-center justify-between w-full gap-6 font-normal"
                    >
                      {director?.first_name || ''} {director?.last_name || ''}:{' '}
                      <span className="flex items-center justify-end gap-2 font-semibold">
                        {director?.attachment?.name}
                        <FontAwesomeIcon
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachmentPreview(previewUrl);
                          }}
                          icon={faEye}
                          className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                        />
                      </span>
                    </p>
                  );
                }
              }
            )}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Senior management
            </h3>
            {business_application?.senior_management?.map((senior, index) => {
              if (senior?.attachment?.name) {
                return (
                  <p
                    key={index}
                    className="flex items-center justify-between w-full gap-6 font-normal"
                  >
                    {senior?.first_name || ''} {senior?.last_name || ''}:{' '}
                    <span className="flex items-center justify-end gap-2 font-semibold">
                      {senior?.attachment?.name}
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          setAttachmentPreview(previewUrl);
                        }}
                        icon={faEye}
                        className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      />
                    </span>
                  </p>
                );
              }
            })}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">Shareholders</h3>
            {business_application?.shareholders?.map(
              (shareholder: business_shareholders, index) => {
                if (shareholder?.attachment?.name) {
                  if (shareholder?.type === 'person') {
                    return (
                      <p
                        key={index}
                        className="flex items-center justify-between w-full gap-6 font-normal"
                      >
                        {shareholder?.first_name || ''}{' '}
                        {shareholder?.last_name || ''}:{' '}
                        <span className="flex items-center justify-end gap-2 font-semibold">
                          {shareholder?.attachment?.name}
                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentPreview(previewUrl);
                            }}
                            icon={faEye}
                            className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          />
                        </span>
                      </p>
                    );
                  } else {
                    return (
                      <p
                        key={index}
                        className="flex items-center justify-between w-full gap-6 font-normal"
                      >
                        {shareholder?.company_name || ''}:{' '}
                        <span className="flex items-center justify-end gap-2 font-semibold">
                          {shareholder?.attachment?.name}
                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentPreview(previewUrl);
                            }}
                            icon={faEye}
                            className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          />
                        </span>
                      </p>
                    );
                  }
                }
              }
            )}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Beneficial owners
            </h3>
            {business_application?.beneficial_owners?.map(
              (beneficial_owner: business_beneficial_owners, index) => {
                if (beneficial_owner?.attachment?.name) {
                  if (beneficial_owner?.type === 'person') {
                    return (
                      <p
                        key={index}
                        className="cursor-pointer flex items-center justify-between w-full gap-6 font-normal"
                      >
                        {beneficial_owner?.first_name || ''}{' '}
                        {beneficial_owner?.last_name || ''}:{' '}
                        <span className="flex items-center justify-end gap-2 font-semibold">
                          {beneficial_owner?.attachment?.name}
                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentPreview(previewUrl);
                            }}
                            icon={faEye}
                            className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          />
                        </span>
                      </p>
                    );
                  } else {
                    return (
                      <p
                        key={index}
                        className="cursor-pointer flex items-center justify-between w-full gap-6 font-normal"
                      >
                        {beneficial_owner?.company_name || ''}:{' '}
                        <span className="flex items-center justify-end gap-2 font-semibold">
                          {beneficial_owner?.attachment?.name}
                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentPreview(previewUrl);
                            }}
                            icon={faEye}
                            className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          />
                        </span>
                      </p>
                    );
                  }
                }
              }
            )}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Company Attachments
            </h3>
            {business_application?.company_attachments &&
              Object.keys(business_application?.company_attachments)?.length >
                0 && (
                <menu className="flex flex-col gap-3">
                  <p className="flex items-center justify-between w-full gap-6 font-normal">
                    Articles of association:{' '}
                    <span className="flex items-center justify-end gap-3 font-semibold text-end">
                      {
                        business_application?.company_attachments
                          ?.articles_of_association?.name
                      }
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          setAttachmentPreview(previewUrl);
                        }}
                        icon={faEye}
                        className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      />
                    </span>
                  </p>
                  <p className="flex items-center justify-between w-full gap-6 font-normal">
                    Resolution:{' '}
                    <ul
                      className={`${
                        business_application?.company_attachments?.resolution
                          ?.name
                          ? 'flex'
                          : 'hidden'
                      } text-end flex items-center gap-3 justify-end font-semibold`}
                    >
                      {
                        business_application?.company_attachments?.resolution
                          ?.name
                      }
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          setAttachmentPreview(previewUrl);
                        }}
                        icon={faEye}
                        className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      />
                    </ul>
                  </p>
                  <p className="flex items-start justify-between w-full gap-6 font-normal">
                    Shareholder attachments:{' '}
                    <span className="font-semibold">
                      {business_application?.company_attachments
                        ?.shareholder_attachments &&
                        business_application?.company_attachments?.shareholder_attachments?.map(
                          (attachment, index) => {
                            return (
                              <ul
                                key={index}
                                className="flex items-center justify-end gap-3 font-semibold text-end"
                              >
                                {attachment?.name}
                                <FontAwesomeIcon
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setAttachmentPreview(previewUrl);
                                  }}
                                  icon={faEye}
                                  className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                />
                              </ul>
                            );
                          }
                        )}
                    </span>
                  </p>
                  <p className="flex items-start justify-between w-full gap-6 font-normal">
                    Others:{' '}
                    <span className="font-semibold">
                      {business_application?.company_attachments?.others &&
                        business_application?.company_attachments?.others?.map(
                          (attachment, index) => {
                            return (
                              <ul
                                key={index}
                                className="flex items-center justify-end gap-3 font-semibold text-end"
                              >
                                {attachment?.name}
                                <FontAwesomeIcon
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setAttachmentPreview(previewUrl);
                                  }}
                                  icon={faEye}
                                  className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                />
                              </ul>
                            );
                          }
                        )}
                    </span>
                  </p>
                </menu>
              )}
          </menu>
        </section>
      </PreviewCard>
      {(unresolvedApplicationComments > 0 &&
        !RDBAdminEmailPattern.test(user?.email)) && (
          <menu className="flex items-center justify-center w-full">
            <p className="text-[12px] text-red-600 text-center font-medium">
              You have unresolved comments. Please attend to them before
              submitting.
            </p>
          </menu>
        )}
      <menu
        className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
      >
        <Button
          value="Back"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setBusinessActiveStep('attachments'));
            dispatch(setBusinessActiveTab('attachments'));
          }}
        />
        <Button
          value={isLoading ? <Loader /> : 'Submit'}
          primary
          disabled={
            RDBAdminEmailPattern.test(user?.email) ||
            unresolvedApplicationComments > 0
          }
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              dispatch(
                setUserApplications({
                  entry_id,
                  type: 'business_registration',
                  company_details: business_application?.company_details,
                  company_address: business_application?.company_address,
                  company_activities: business_application?.company_activities,
                  board_of_directors: business_application?.board_of_directors,
                  senior_management: business_application?.senior_management,
                  employment_info: business_application?.employment_info,
                  share_details: business_application?.share_details,
                  shareholders: business_application?.shareholders,
                  capital_details: business_application?.capital_details,
                  beneficial_owners: business_application?.beneficial_owners,
                  company_attachments:
                    business_application?.company_attachments,
                  path: `/business-registration/?entry_id=${entry_id}`,
                  status:
                    business_application?.status === 'action_required'
                      ? 're_submitted'
                      : 'submitted',
                  createdAt: moment().format(),
                  updateAt: moment().format(),
                })
              );
              dispatch(setBusinessCompletedStep('preview_submission'));
              dispatch(setBusinessActiveTab('general_information'));
              dispatch(setBusinessActiveStep('company_details'));
              dispatch(
                setBusinessRegistrationTabs(
                  business_registration_tabs_initial_state
                )
              );
              dispatch(setIsAmending(false));
              navigate('/success', {
                state: { redirectUrl: '/user-applications' },
              });
            }, 1000);
          }}
        />
      </menu>
      {attachmentPreview && (
        <ViewDocument
          documentUrl={attachmentPreview}
          setDocumentUrl={setAttachmentPreview}
        />
      )}
      <BusinessPersonDetails personDetails={businessPersonDetails} />
    </section>
  );
};

export default PreviewSubmission;
