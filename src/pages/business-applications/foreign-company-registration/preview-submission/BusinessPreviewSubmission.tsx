import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import PreviewCard from "../../../../components/business-registration/PreviewCard";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import {
  capitalizeCamelCase,
  capitalizeString,
  formatDate,
} from "../../../../helpers/strings";
import Table from "../../../../components/table/Table";
import { countriesList } from "../../../../constants/countries";
import Button from "../../../../components/inputs/Button";
import { ErrorResponse, useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { BusinessActivity, businessId } from "@/types/models/business";
import {
  useLazyFetchBusinessActivitiesQuery,
  useLazyGetBusinessAddressQuery,
  useLazyGetBusinessDetailsQuery,
  useLazyGetEmploymentInfoQuery,
  useUpdateBusinessMutation,
} from "@/states/api/businessRegApiSlice";
import { toast } from "react-toastify";
import {
  setBusinessAddress,
  setBusinessDetails,
  setEmploymentInfo,
} from "@/states/features/businessSlice";
import { useLazyFetchManagementOrBoardMembersQuery } from "@/states/api/foreignCompanyRegistrationApiSlice";
import { setBoardOfDirectorsList } from "@/states/features/boardOfDirectorSlice";
import { setExecutiveManagersList } from "@/states/features/executiveManagerSlice";
import {
  setSelectedBusinessLinesList,
  setSelectedMainBusinessLine,
  setVatRegistred,
} from "@/states/features/businessActivitySlice";
import { useLazyFetchBusinessAttachmentsQuery } from "@/states/api/coreApiSlice";
import { setBusinessAttachments } from "@/states/features/businessPeopleSlice";
import BusinessPeopleAttachments from "../../domestic-business-registration/BusinessPeopleAttachments";

interface PreviewSubmissionProps {
  businessId: businessId;
  applicationStatus: string;
}

const PreviewSubmission = ({
  businessId,
  applicationStatus,
}: PreviewSubmissionProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessDetails, businessAddress } = useSelector(
    (state: RootState) => state.business
  );
  const { selectedBusinessLinesList, selectedMainBusinessLine, vatRegistred } =
    useSelector((state: RootState) => state.businessActivity);
  const { boardMemberList } = useSelector(
    (state: RootState) => state.boardOfDirector
  );
  const { executiveManagersList } = useSelector(
    (state: RootState) => state.executiveManager
  );
  const { employmentInfo } = useSelector((state: RootState) => state.business);
  const navigate = useNavigate();
  const { businessAttachments } = useSelector(
    (state: RootState) => state.businessPeople
  );

  // GET BUSINESS DETAILS
  const [
    getBusinessDetails,
    {
      data: businessDetailsData,
      isLoading: businessIsLoading,
      error: businessError,
      isError: businessIsError,
      isSuccess: businessIsSuccess,
    },
  ] = useLazyGetBusinessDetailsQuery();

  // GET BUSINESS DETAILS
  useEffect(() => {
    if (businessId) {
      getBusinessDetails({ id: businessId });
    }
  }, [businessId, getBusinessDetails]);

  // HANDLE BUSINESS DETAILS DATA RESPONSE
  useEffect(() => {
    if (businessIsError) {
      if ((businessError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occurred while fetching business details. Please try again later."
        );
      } else {
        toast.error((businessError as ErrorResponse)?.data?.message);
      }
    } else if (businessIsSuccess) {
      dispatch(setBusinessDetails(businessDetailsData?.data));
    }
  }, [
    businessDetailsData,
    businessError,
    businessIsError,
    businessIsSuccess,
    dispatch,
  ]);

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusinessAddress,
    {
      data: businessAddressData,
      error: businessAddressError,
      isLoading: businessAddressIsLoading,
      isError: businessAddressIsError,
      isSuccess: businessAddressIsSuccess,
    },
  ] = useLazyGetBusinessAddressQuery();

  // GET BUSINESS
  useEffect(() => {
    if (businessId) {
      getBusinessAddress({ id: businessId });
    }
  }, [getBusinessAddress, businessId]);

  // HANDLE GET BUSINESS RESPONSE
  useEffect(() => {
    if (businessAddressIsError) {
      if ((businessAddressError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching business data");
      } else {
        toast.error((businessAddressError as ErrorResponse)?.data?.message);
      }
    } else if (businessAddressIsSuccess) {
      dispatch(setBusinessAddress(businessAddressData?.data));
    }
  }, [
    businessAddressData,
    businessAddressError,
    businessAddressIsError,
    businessAddressIsSuccess,
    dispatch,
  ]);

  // INITIALIZE FETCH BUSINESS ACTIVITIES QUERY
  const [
    fetchBusinessActivities,
    {
      data: businessActivitiesData,
      isLoading: businessActivitiesIsLoading,
      isSuccess: businessActivitiesIsSuccess,
      isError: businessActivitiesIsError,
      error: businessActivitiesError,
    },
  ] = useLazyFetchBusinessActivitiesQuery();

  // FETCH BUSINESS ACTIVITIES
  useEffect(() => {
    fetchBusinessActivities({ businessId });
  }, [businessId, fetchBusinessActivities]);

  // HANDLE FETCH BUSINESS ACTIVITIES RESPONSE
  useEffect(() => {
    if (businessActivitiesIsError) {
      if ((businessActivitiesError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while fetching business activities. Please try again later."
        );
      }
    } else if (businessActivitiesIsSuccess) {
      dispatch(
        setSelectedBusinessLinesList(businessActivitiesData?.data?.businessLine)
      );
      dispatch(setVatRegistred(businessActivitiesData?.data?.vatregistered));
      if (
        selectedMainBusinessLine === undefined ||
        Object.keys(selectedMainBusinessLine).length === 0
      ) {
        dispatch(
          setSelectedMainBusinessLine(
            businessActivitiesData?.data?.businessLine?.find(
              (activity: BusinessActivity) =>
                activity.description ===
                businessActivitiesData?.data?.mainBusinessActivity
            )
          )
        );
      }
    }
  }, [
    businessActivitiesData,
    businessActivitiesError,
    businessActivitiesIsError,
    businessActivitiesIsSuccess,
    dispatch,
    selectedMainBusinessLine,
  ]);

  // INITIALIZE FETCH BOARD MEMEBER QUERY
  const [
    fetchBoardMembers,
    {
      data: boardMemberData,
      error: boardMemberError,
      isLoading: boardMemberIsLoading,
      isError: boardMemberIsError,
      isSuccess: boardMemberIsSuccess,
    },
  ] = useLazyFetchManagementOrBoardMembersQuery();

  // FETCH BOARD MEMBERS
  useEffect(() => {
    if (!businessId) return;
    fetchBoardMembers({ businessId, route: "board-member" });
  }, [fetchBoardMembers, businessId]);

  // HANDLE FETCH BOARD MEMBERS RESPONSE
  useEffect(() => {
    if (boardMemberIsError) {
      if ((boardMemberError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching board members");
      } else {
        toast.error((boardMemberError as ErrorResponse)?.data?.message);
      }
    } else if (boardMemberIsSuccess) {
      dispatch(setBoardOfDirectorsList(boardMemberData.data));
    }
  }, [
    boardMemberData,
    boardMemberError,
    boardMemberIsError,
    boardMemberIsSuccess,
    dispatch,
  ]);

  // INITIALIZE FETCH MANAGEMENT OR BOARD PEOPLE QUERY
  const [
    fetchManagementMember,
    {
      data: managementMemberData,
      error: managementMemberError,
      isLoading: managementMemberIsLoading,
      isError: managementMemberIsError,
      isSuccess: managementMemberIsSuccess,
    },
  ] = useLazyFetchManagementOrBoardMembersQuery();

  // FETCH MANAGEMENT PEOPLE
  useEffect(() => {
    if (!businessId) return;
    fetchManagementMember({
      businessId,
      route: "management",
    });
  }, [businessId, fetchManagementMember]);

  // HANDLE MANAGEMENT PEOPLE RESPONSE
  useEffect(() => {
    if (managementMemberIsError) {
      if ((managementMemberError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while fetching people. Please try again later"
        );
      } else {
        toast.error((managementMemberError as ErrorResponse).data?.message);
      }
    } else if (managementMemberIsSuccess) {
      dispatch(setExecutiveManagersList(managementMemberData?.data));
    }
  }, [
    dispatch,
    managementMemberData?.data,
    managementMemberError,
    managementMemberIsSuccess,
    managementMemberIsError,
  ]);

  // GET EMPLOYMENT INFO
  const [
    fetchEmploymentInfo,
    {
      data: employmentInfoData,
      isLoading: employmentInfoIsLoading,
      error: employmentInfoError,
      isSuccess: employmentInfoIsSuccess,
    },
  ] = useLazyGetEmploymentInfoQuery();

  // FETCH EMPLOYMENT INFO
  useEffect(() => {
    if (!businessId) return;
    fetchEmploymentInfo({ id: businessId });
  }, [businessId, fetchEmploymentInfo]);

  // HANDLE FETCH EMPLOYMENT INFO QUERY
  useEffect(() => {
    if (employmentInfoError) {
      if ((employmentInfoError as ErrorResponse)?.status === 500)
        toast.error(
          "An error occurred while fetching employment info. Please try again later."
        );
      else toast.error((employmentInfoError as ErrorResponse)?.data?.message);
    } else dispatch(setEmploymentInfo(employmentInfoData?.data));
  }, [dispatch, employmentInfoData?.data, employmentInfoError]);

  // INITIALIZE UPDATE BUSINESS MUTATION
  const [
    updateBusiness,
    {
      data: updateBusinessData,
      error: updateBusinessError,
      isLoading: updateBusinessIsLoading,
      isSuccess: updateBusinessIsSuccess,
      isError: updateBusinessIsError,
    },
  ] = useUpdateBusinessMutation();

  // HANDLE UPDATE BUSINESS RESPONSE
  useEffect(() => {
    if (updateBusinessIsError) {
      if ((updateBusinessError as ErrorResponse).status === 500) {
        toast.error("An error occurred while updating business");
      } else {
        toast.error(
          (updateBusinessError as ErrorResponse).data?.message ??
            "An error occurred while updating business"
        );
      }
    } else if (updateBusinessIsSuccess) {
      toast.success("Business updated successfully");
      dispatch(setForeignBusinessActiveStep("company_details"));
      dispatch(setForeignBusinessActiveTab("general_information"));
      navigate("/success", {
        state: { redirectUrl: "/services" },
      });
    }
  }, [
    dispatch,
    navigate,
    updateBusinessData,
    updateBusinessError,
    updateBusinessIsError,
    updateBusinessIsSuccess,
  ]);

  // INITIALIZE FETC BUSINESS ATTACHMENTS
  const [
    fetchBusinessAttachments,
    {
      data: businessAttachmentsData,
      isLoading: businessAttachmentsIsLoading,
      error: businessAttachmentsError,
      isSuccess: businessAttachmentsIsSuccess,
      isError: businessAttachmentsIsError,
    },
  ] = useLazyFetchBusinessAttachmentsQuery();

  // FETCH BUSINESS ATTACHMENTS
  useEffect(() => {
    if (businessId) {
      fetchBusinessAttachments({ businessId });
    }
  }, [businessId, fetchBusinessAttachments]);

  // HANDLE FETCH BUSINESS ATTACHMENTS RESPONSE
  useEffect(() => {
    if (businessAttachmentsIsError) {
      if ((businessAttachmentsError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occurred while fetching business attachments. Please try again later."
        );
      } else {
        toast.error((businessAttachmentsError as ErrorResponse)?.data?.message);
      }
    } else if (businessAttachmentsIsSuccess) {
      dispatch(setBusinessAttachments(businessAttachmentsData?.data));
    }
  }, [
    businessAttachmentsData,
    businessAttachmentsError,
    businessAttachmentsIsError,
    businessAttachmentsIsSuccess,
    dispatch,
  ]);

  // TABLE COLUMNS
  const managementColumns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Document Number (NID/Passport)",
      accessorKey: "documentNumber",
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

  return (
    <section className="flex flex-col w-full h-full gap-6">
      {employmentInfoIsLoading ||
        businessAddressIsLoading ||
        businessIsLoading ||
        businessActivitiesIsLoading ||
        boardMemberIsLoading ||
        employmentInfoIsSuccess ||
        (managementMemberIsLoading && (
          <figure className="h-[40vh] flex items-center justify-center">
            <Loader />
          </figure>
        ))}
      <PreviewCard
        header="Company Details"
        tabName="general_information"
        stepName="company_details"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
        businessId={businessId}
        status={applicationStatus}
      >
        {businessDetails &&
          Object?.entries(businessDetails)
            ?.filter(([key]) => key !== "step" && key !== "id")
            ?.map(([key, value], index: number) => {
              return (
                <p key={index} className="flex items-center gap-2">
                  <span className="">{capitalizeCamelCase(key)}:</span>{" "}
                  <span className="font-bold">
                    {String(value) && capitalizeString(String(value))}
                  </span>
                </p>
              );
            })}
      </PreviewCard>
      {/* COMPANY ADDRESS */}
      {businessAddress && (
        <PreviewCard
          header="Company Address"
          tabName="general_information"
          stepName="company_address"
          setActiveStep={setForeignBusinessActiveStep}
          setActiveTab={setForeignBusinessActiveTab}
          businessId={businessId}
          status={applicationStatus}
        >
          {Object?.entries(businessAddress)
            ?.filter(
              ([key]) => key !== "step" && key !== "id" && key !== "location"
            )
            ?.map(([key, value], index: number) => {
              return (
                <p key={index} className="flex items-center gap-2">
                  <span className="">{capitalizeCamelCase(key)}:</span>{" "}
                  <span className="font-bold">{String(value) ?? ""}</span>
                </p>
              );
            })}
        </PreviewCard>
      )}
      <PreviewCard
        header="Business Activities & VAT"
        tabName="general_information"
        stepName="business_activity_vat"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
        businessId={businessId}
        status={applicationStatus}
      >
        <p className="font-semibold">
          Register for VAT:{" "}
          <span className="font-normal">
            {capitalizeString(vatRegistred ? "yes" : "no")}
          </span>
        </p>
        <p className="font-semibold">
          Main business line:{" "}
          <span className="font-normal">
            {selectedMainBusinessLine.description}
          </span>
        </p>
        {/* <p className="font-semibold">
          Annual turnover:{" "}
          <span className="font-normal">
            {foreign_company_activities?.turnover
              ? String(capitalizeString(foreign_company_activities?.turnover))
              : "N/A"}
          </span>
        </p> */}
        <menu className="flex flex-col gap-3">
          <h3 className="font-semibold underline text-md">Business lines: </h3>
          <ul className="flex flex-col gap-2">
            {selectedBusinessLinesList?.map((line, index) => {
              return (
                <li key={index} className="flex items-center gap-1">
                  {line?.description}
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
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
        businessId={businessId}
        status={applicationStatus}
      >
        <Table
          rowClickHandler={undefined}
          showFilter={false}
          showPagination={false}
          columns={managementColumns}
          data={boardMemberList?.map((director) => {
            return {
              ...director,
              name: `${director?.firstName} ${director?.lastName}`,
              documentNumber: director?.personDocNo,
              position:
                director?.roleDescription &&
                capitalizeString(director?.roleDescription),
              country: countriesList?.find(
                (country) => country?.code === director?.nationality
              )?.name,
            };
          })}
        />
      </PreviewCard>
      {/* SENIOR MANAGEMENT */}
      <PreviewCard
        header="Executive Management"
        tabName="management"
        stepName="executive_management"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
        businessId={businessId}
        status={applicationStatus}
      >
        <Table
          rowClickHandler={undefined}
          showFilter={false}
          showPagination={false}
          columns={managementColumns}
          data={executiveManagersList?.map((director) => {
            return {
              ...director,
              name: `${director?.firstName} ${director?.lastName}`,
              documentNumber: director?.personDocNo,
              position:
                director?.roleDescription &&
                capitalizeString(director?.roleDescription),
              country: countriesList?.find(
                (country) => country?.code === director?.nationality
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
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
        businessId={businessId}
        status={applicationStatus}
      >
        <p>
          Company has employees:{" "}
          <span className="font-semibold">
            {employmentInfo?.numberOfEmployees > 0 ? "yes" : "no"}
          </span>
        </p>
        {employmentInfo?.numberOfEmployees > 0 && (
          <p>
            Number of employees:{" "}
            <span className="font-semibold">
              {employmentInfo?.numberOfEmployees}
            </span>
          </p>
        )}
        <p>
          <span>
            Financial year start date:{" "}
            <span className="font-semibold">
              {formatDate(employmentInfo?.financialYearStartDate) || "N/A"}
            </span>
          </span>
        </p>
        <p>
          <span>
            Financial year end date:{" "}
            <span className="font-semibold">
              {formatDate(employmentInfo?.financialYearEndDate) || "N/A"}
            </span>
          </span>
        </p>
      </PreviewCard>
      {/* BENEFICIAL OWNERS */}
      {/* ATTACHMENTS */}
      <PreviewCard
        header="Attachments"
        tabName="attachments"
        stepName="attachments"
        setActiveStep={setForeignBusinessActiveStep}
        setActiveTab={setForeignBusinessActiveTab}
        businessId={businessId}
        status={applicationStatus}
      >
        {businessAttachments?.length > 0 && (
          <BusinessPeopleAttachments attachments={businessAttachments} />
        )}
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
          onClick={(e) => {
            e.preventDefault();
            updateBusiness({ businessId, status: "SUBMITTED" });
          }}
          value={updateBusinessIsLoading ? <Loader /> : "Submit"}
          primary
        />
      </menu>
    </section>
  );
};

export default PreviewSubmission;
