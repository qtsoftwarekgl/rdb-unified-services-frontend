import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import PreviewCard from "../../../../components/business-registration/PreviewCard";
import Button from "../../../../components/inputs/Button";
import { ErrorResponse, useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loader";
import ViewDocument from "../../../user-company-details/ViewDocument";
import { Address, BusinessActivity, businessId } from "@/types/models/business";
import {
  useLazyFetchBusinessActivitiesQuery,
  useLazyFetchBusinessAddressQuery,
  useLazyFetchBusinessDetailsQuery,
  useLazyFetchBusinessEmploymentInfoQuery,
  useLazyFetchBusinessPeopleQuery,
  useLazyFetchShareholdersQuery,
  useUpdateBusinessMutation,
} from "@/states/api/businessRegApiSlice";
import { capitalizeString } from "@/helpers/strings";
import BusinessPeople from "../management/BusinessPeople";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";
import { FounderDetail } from "@/types/models/personDetail";
import Table from "@/components/table/Table";
import { toast } from "react-toastify";
import BusinessPeopleAttachments from "../BusinessPeopleAttachments";
import { useLazyFetchBusinessAttachmentsQuery } from "@/states/api/businessRegApiSlice";
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from "@/helpers/business.helpers";
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from "@/states/features/navigationFlowSlice";
import { ApplicationStatus } from "@/Enums/ApplicationStatus";
import ListBusinessReviewComments from "../../business-review/ListBusinessReviewComments";

type PreviewSubmissionProps = {
  businessId: businessId;
  applicationStatus?: string;
};

const PreviewSubmission = ({
  applicationStatus,
  businessId,
}: PreviewSubmissionProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentPreview, setAttachmentPreview] = useState<string>("");
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const { businessReviewCommentsList } = useSelector(
    (state: RootState) => state.businessReviewComment
  );

  // NAVIGATION
  const navigate = useNavigate();

  // UPDATE NAVIGATION FLOW ON LOAD
  useEffect(() => {
    dispatch(
      completeNavigationFlowThunk({
        isCompleted: true,
        navigationFlowId: findNavigationFlowByStepName(
          businessNavigationFlowsList,
          "Preview & Submission"
        )?.id,
      })
    );
  }, [dispatch, businessId]);

  // INITIALIZE FETCHING COMPANY DETAILS QUERY
  const [
    fetchBusinessDetails,
    {
      data: businessDetailsData,
      isLoading: businessDetailsIsLoading,
      isSuccess: businessDetailsIsSuccess,
    },
  ] = useLazyFetchBusinessDetailsQuery();

  // INITIALIZE FETCHING BUSINESS ADDRESS QUERY
  const [
    fetchBusinessAddress,
    {
      data: businessAddressData,
      isLoading: businessAddressIsLoading,
      isSuccess: businessAddressIsSuccess,
    },
  ] = useLazyFetchBusinessAddressQuery();

  // INITIALIZE FETCH EXECUTIVE MANAGEMENT QUERY
  const [
    fetchExecutiveManagement,
    { data: executiveManagementData, isLoading: executiveManagementIsLoading },
  ] = useLazyFetchBusinessPeopleQuery();

  // INITIALIZE FETCH BOARD MEMBERS QUERY
  const [
    fetchBoardMembers,
    { data: boardMembersData, isLoading: boardMembersIsLoading },
  ] = useLazyFetchBusinessPeopleQuery();

  // FETCH BOARD MEMBERS
  useEffect(() => {
    if (businessId) {
      fetchBoardMembers({ businessId, route: "board-member" });
    }
  }, [businessId, fetchBoardMembers]);

  // INITIALIZE FETCH FOUNDER DETAILS QUERY
  const [
    fetchShareholders,
    { data: shareholdersData, isFetching: shareholderIsFetching },
  ] = useLazyFetchShareholdersQuery();

  // INITIALIZE FETCHING BUSINESS ACTIVITIES QUERY
  const [
    fetchBusinessActivities,
    {
      data: businessActivitiesData,
      isLoading: businessActivitiesIsLoading,
      isSuccess: businessActivitiesIsSuccess,
    },
  ] = useLazyFetchBusinessActivitiesQuery();

  // INITIALIZE FETCH BUSINESS ATTACHMENTS
  const [
    fetchBusinessAttachments,
    {
      data: businessAttachmentsData,
      isFetching: businessAttachmentsIsFetching,
    },
  ] = useLazyFetchBusinessAttachmentsQuery();

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

  // INITIALIZE FETCHING BUSINESS EMPLOYMENT INFO
  const [
    fetchBusinessEmploymentInfo,
    {
      data: businessEmploymentInfoData,
      isLoading: businessEmploymentInfoIsLoading,
      isSuccess: businessEmploymentInfoIsSuccess,
    },
  ] = useLazyFetchBusinessEmploymentInfoQuery();

  // FETCH ALL BUSINESS DATA
  useEffect(() => {
    if (businessId) {
      fetchBusinessEmploymentInfo({ businessId });
      fetchBusinessActivities({ businessId });
      fetchBusinessAddress({ businessId });
      fetchBusinessDetails({ businessId });
      fetchBoardMembers({ businessId, route: "board-member" });
      fetchExecutiveManagement({ businessId, route: "management" });
      fetchShareholders({ businessId });
      fetchBusinessAttachments({ businessId });

      // Complete preview tab
      dispatch(
        completeNavigationFlowThunk({
          isCompleted: true,
          navigationFlowId: findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Preview & Submission"
          )?.id,
        })
      );
    }
  }, [
    businessId,
    businessNavigationFlowsList,
    dispatch,
    fetchBoardMembers,
    fetchBusinessActivities,
    fetchBusinessAddress,
    fetchBusinessAttachments,
    fetchBusinessDetails,
    fetchBusinessEmploymentInfo,
    fetchExecutiveManagement,
    fetchShareholders,
  ]);

  // TABLE COLUMNS
  const founderDetailsColumns = [
    {
      header: "Document Number",
      accessorKey: "personDocNo",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Type",
      accessorKey: "shareHolderType",
    },
    {
      header: "Number of shares",
      accessorKey: "shareQuantity",
    },
    {
      header: "Total value",
      accessorKey: "totalQuantity",
    },
  ];

  return (
    <section className="flex flex-col w-full h-full gap-6 overflow-y-scroll">
      {/* COMPANY DETAILS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Company Details"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          "Company Details"
        )}
        navigationFlowId={
          findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Company Details"
          )?.id
        }
      >
        {businessDetailsIsLoading ||
        businessAddressIsLoading ||
        businessActivitiesIsLoading ||
        boardMembersIsLoading ||
        executiveManagementIsLoading ||
        businessEmploymentInfoIsLoading ||
        businessAttachmentsIsFetching ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessDetailsIsSuccess && (
            <menu className="flex flex-col gap-2">
              {businessDetailsData?.data ? (
                Object?.entries(businessDetailsData?.data)?.map(
                  ([key, value], index: number) => {
                    if (
                      value === null ||
                      [
                        "createdAt",
                        "updatedAt",
                        "isForeign",
                        "id",
                        "applicationStatus",
                      ].includes(key)
                    )
                      return null;
                    if (key === "service")
                      return (
                        <p>
                          {capitalizeString(key)}:{" "}
                          {capitalizeString(
                            String(
                              (
                                value as {
                                  name: string;
                                }
                              )?.name
                            )
                          )}
                        </p>
                      );
                    return (
                      <li key={index}>
                        <p className="flex text-[14px] items-center gap-2">
                          {capitalizeString(key)}:{" "}
                          {capitalizeString(String(value))}
                        </p>
                      </li>
                    );
                  }
                )
              ) : (
                <p>No data</p>
              )}
            </menu>
          )
        )}
      </PreviewCard>

      {/* COMPANY ADDRESS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Company Address"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          "Company Address"
        )}
        navigationFlowId={
          findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Company Address"
          )?.id
        }
      >
        {businessAddressIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessAddressIsSuccess && (
            <menu className="flex flex-col gap-2">
              {businessAddressData?.data ? (
                Object?.entries(businessAddressData?.data)?.map(
                  ([key, value], index: number) => {
                    if (key === "id" || value === null) return null;
                    if (key === "location")
                      return (
                        <ul key={index} className="flex flex-col gap-2">
                          {Object?.entries(value as Address)?.map(
                            ([key, value], index: number) => {
                              if (key === "id" || value === null) return null;
                              return (
                                <li key={index}>
                                  <p className="flex text-[14px] items-center gap-2">
                                    {capitalizeString(key)}:{" "}
                                    {capitalizeString(String(value))}
                                  </p>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      );
                    return (
                      <li key={index}>
                        <p className="flex text-[14px] items-center gap-2">
                          {capitalizeString(key)}:{" "}
                          {capitalizeString(String(value))}
                        </p>
                      </li>
                    );
                  }
                )
              ) : (
                <p>No data</p>
              )}
            </menu>
          )
        )}
      </PreviewCard>

      {/* BUSINESS ACTIVITIES & VAT */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Business Activities & VAT"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          "Business Activity & VAT"
        )}
        navigationFlowId={
          findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Business Activity & VAT"
          )?.id
        }
      >
        {businessActivitiesIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessActivitiesIsSuccess && (
            <menu className="flex flex-col gap-2">
              <p className="flex text-[14px] items-center gap-2">
                Main business activity:{" "}
                {capitalizeString(
                  businessActivitiesData?.data?.mainBusinessActivity
                )}
              </p>
              <ul className="flex flex-col gap-2">
                {businessActivitiesData?.data?.businessLine?.map(
                  (activity: BusinessActivity, index: number) => {
                    return (
                      <li key={index}>
                        <p className="flex text-[14px] items-center gap-2">
                          {activity?.code} -{" "}
                          {capitalizeString(activity?.description)}
                        </p>
                      </li>
                    );
                  }
                )}
              </ul>
            </menu>
          )
        )}
      </PreviewCard>

      {/*  BOARD OF DIRECTORS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Board of Directors"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          "Board of Directors"
        )}
        navigationFlowId={
          findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Board of Directors"
          )?.id
        }
      >
        {boardMembersIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          <BusinessPeople
            businessPeopleList={boardMembersData?.data}
            businessId={businessId}
          />
        )}
      </PreviewCard>

      {/*  EXECUTIVE MANAGEMENT */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Executive Management"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          "Executive Management"
        )}
        navigationFlowId={
          findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Executive Management"
          )?.id
        }
      >
        {executiveManagementIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          <BusinessPeople
            businessPeopleList={executiveManagementData?.data}
            businessId={businessId}
          />
        )}
      </PreviewCard>

      {/* EMPLOYMENT INFO */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Employment Information"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          "Employment Info"
        )}
        navigationFlowId={
          findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Employment Info"
          )?.id
        }
      >
        {businessEmploymentInfoIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessEmploymentInfoIsSuccess &&
          businessEmploymentInfoData?.data && (
            <menu className="flex flex-col gap-2">
              <p>
                Working Start Time:{" "}
                {businessEmploymentInfoData?.data?.workingStartTime}
              </p>
              <p>
                Working End Time:{" "}
                {businessEmploymentInfoData?.data?.workingEndTime}
              </p>
              <p>
                Number Of Employees:{" "}
                {businessEmploymentInfoData?.data?.numberOfEmployees}
              </p>
              <p>
                Hiring Date:{" "}
                {new Date(
                  businessEmploymentInfoData?.data?.hiringDate
                ).toLocaleDateString()}
              </p>
              <p>
                Employment Declaration Date:{" "}
                {new Date(
                  businessEmploymentInfoData?.data?.employmentDeclarationDate
                ).toLocaleDateString()}
              </p>
              <p>
                Financial Year Start Date:{" "}
                {moment(
                  businessEmploymentInfoData?.data?.financialYearStartDate
                ).format("MMMM DD")}
              </p>
              <p>
                Financial Year End Date:{" "}
                {moment(businessEmploymentInfoData?.data?.financialYearEndDate)
                  .subtract(1, "day")
                  .format("MMMM DD")}
              </p>
            </menu>
          )
        )}
      </PreviewCard>

      {/* SHAREHOLDERS */}
      {shareholderIsFetching ? (
        <figure className="flex items-center justify-center w-full h-full">
          <Loader />
        </figure>
      ) : (
        <PreviewCard
          applicationStatus={applicationStatus}
          businessId={businessId}
          header="Shareholders"
          navigationFlowMassId={findNavigationFlowMassIdByStepName(
            navigationFlowMassList,
            "Shareholders"
          )}
        >
          <Table
            showFilter={false}
            showPagination={false}
            data={shareholdersData?.data?.map((founder: FounderDetail) => {
              return {
                ...founder,
                name: `${
                  founder?.personDetail?.firstName ||
                  founder?.personDetail?.organization?.organizationName ||
                  ""
                } ${founder?.personDetail?.middleName || ""} ${
                  founder?.personDetail?.lastName || ""
                }`,
                shareHolderType: capitalizeString(founder?.shareHolderType),
                personDocNo: founder?.personDetail?.personDocNo || "-",
                phoneNumber:
                  founder?.personDetail?.phoneNumber ||
                  founder?.personDetail?.organization?.phone ||
                  "-",
              };
            })}
            columns={founderDetailsColumns as ColumnDef<FounderDetail>[]}
          />
        </PreviewCard>
      )}

      {/* ATTACHMENTS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        header="Attachments"
        businessId={businessId}
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          "Attachments"
        )}
        navigationFlowId={
          findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Attachments"
          )?.id
        }
      >
        {businessAttachmentsIsFetching ? (
          <figure className="flex items-center gap-3 w-full min-h-[20vh]">
            <Loader className="text-primary" />
            Fetching business attachments...
          </figure>
        ) : (
          businessAttachmentsData?.data?.length > 0 && (
            <BusinessPeopleAttachments
              attachments={businessAttachmentsData?.data}
            />
          )
        )}
      </PreviewCard>
      {[
        ApplicationStatus.Inprogress,
        ApplicationStatus.IsAmending,
        ApplicationStatus.Forcorrection,
      ].includes(String(applicationStatus) as ApplicationStatus) ? (
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                createNavigationFlowThunk({
                  businessId,
                  massId: findNavigationFlowMassIdByStepName(
                    navigationFlowMassList,
                    "Attachments"
                  ),
                  isActive: true,
                })
              );
            }}
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              updateBusiness({
                businessId,
                applicationStatus:
                  applicationStatus === ApplicationStatus.Inprogress
                    ? ApplicationStatus.Submitted
                    : ApplicationStatus.AmendmentSubmitted,
              });
            }}
            value={updateBusinessIsLoading ? <Loader /> : "Submit"}
            primary
          />
        </menu>
      ) : (
        ["ACTION_REQUIRED"].includes(String(applicationStatus)) && (
          <Button
            onClick={(e) => {
              e.preventDefault();
              updateBusiness({
                businessId,
                applicationStatus: "RESUBMITTED",
              });
            }}
            disabled={
              businessReviewCommentsList?.filter(
                (reviewComment) => reviewComment?.status === "UNRESOLVED"
              ).length > 0
            }
            value={updateBusinessIsLoading ? <Loader /> : "Submit again"}
            primary
          />
        )
      )}
      {attachmentPreview && (
        <ViewDocument
          documentUrl={attachmentPreview}
          setDocumentUrl={setAttachmentPreview}
        />
      )}
      <ListBusinessReviewComments />
    </section>
  );
};

export default PreviewSubmission;
