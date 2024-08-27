import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import PreviewCard from "../../../../components/business-registration/PreviewCard";
import {
  removeForeignCompanyRegistrationTabs,
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import { capitalizeString } from "../../../../helpers/strings";
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
import { useLazyFetchBusinessPeopleQuery } from "@/states/api/foreignCompanyRegistrationApiSlice";
import { useLazyFetchBusinessAttachmentsQuery } from "@/states/api/businessRegApiSlice";
import BusinessPeopleAttachments from "../../domestic-business-registration/BusinessPeopleAttachments";
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from "@/helpers/business.helpers";
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from "@/states/features/navigationFlowSlice";
import ListBusinessReviewComments from "../../business-review/ListBusinessReviewComments";
import { setBusinessAttachments } from "@/states/features/businessSlice";
import moment from "moment";
import { ApplicationStatus } from "@/Enums/ApplicationStatus";
import BusinessPeople from "../../domestic-business-registration/management/BusinessPeople";

interface ForeignCompanyPreviewSubmissionProps {
  businessId: businessId;
  applicationStatus: string;
}

const ForeignCompanyPreviewSubmission = ({
  businessId,
  applicationStatus,
}: ForeignCompanyPreviewSubmissionProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const { businessReviewCommentsList } = useSelector(
    (state: RootState) => state.businessReviewComment
  );

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

  // GET BUSINESS DETAILS
  const [
    getBusinessDetails,
    { data: businessDetailsData, isLoading: businessIsLoading },
  ] = useLazyGetBusinessDetailsQuery();

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusinessAddress,
    { data: businessAddressData, isLoading: businessAddressIsLoading },
  ] = useLazyGetBusinessAddressQuery();

  // INITIALIZE FETCH BOARD MEMEBER QUERY
  const [
    fetchBoardMembers,
    { data: boardMemberData, isLoading: boardMemberIsLoading },
  ] = useLazyFetchBusinessPeopleQuery();

  // INITIALIZE FETCH BUSINESS ACTIVITIES QUERY
  const [
    fetchBusinessActivities,
    {
      data: businessActivitiesData,
      isLoading: businessActivitiesIsLoading,
      isSuccess: businessActivitiesIsSuccess,
    },
  ] = useLazyFetchBusinessActivitiesQuery();

  // INITIALIZE FETCH MANAGEMENT OR BOARD PEOPLE QUERY
  const [
    fetchManagementMember,
    { data: managementMemberData, isLoading: managementMemberIsLoading },
  ] = useLazyFetchBusinessPeopleQuery();

  // GET EMPLOYMENT INFO
  const [
    fetchEmploymentInfo,
    {
      data: employmentInfoData,
      isLoading: employmentInfoIsLoading,
      isSuccess: employmentInfoIsSuccess,
    },
  ] = useLazyGetEmploymentInfoQuery();

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

  // GET BUSINESS
  useEffect(() => {
    if (businessId) {
      getBusinessDetails({ id: businessId });
      getBusinessAddress({ businessId });
      fetchBusinessActivities({ businessId });
      fetchBoardMembers({ businessId, route: "board-member" });
      fetchManagementMember({
        businessId,
        route: "management",
      });
      fetchEmploymentInfo({ id: businessId });
      fetchBusinessAttachments({ businessId });

      // complete preview tab
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
    fetchBoardMembers,
    fetchBusinessActivities,
    fetchBusinessAttachments,
    fetchEmploymentInfo,
    fetchManagementMember,
    getBusinessAddress,
    getBusinessDetails,
  ]);

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
      dispatch(removeForeignCompanyRegistrationTabs());
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

  return (
    <section className="flex flex-col w-full h-full gap-6">
      {employmentInfoIsLoading ||
        businessAddressIsLoading ||
        businessIsLoading ||
        businessActivitiesIsLoading ||
        boardMemberIsLoading ||
        employmentInfoIsSuccess ||
        businessAttachmentsIsLoading ||
        (managementMemberIsLoading && (
          <figure className="h-[40vh] flex items-center justify-center">
            <Loader />
          </figure>
        ))}
      <PreviewCard
        header="Company Details"
        businessId={businessId}
        applicationStatus={applicationStatus}
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
                    <strong>
                      {capitalizeString(
                        String(
                          (
                            value as {
                              name: string;
                            }
                          )?.name
                        )
                      )}
                    </strong>
                  </p>
                );
              return (
                <li key={index}>
                  <p className="flex text-[14px] items-center gap-2">
                    {capitalizeString(key)}:{" "}
                    <strong>{capitalizeString(String(value))}</strong>
                  </p>
                </li>
              );
            }
          )
        ) : (
          <p>No data</p>
        )}
      </PreviewCard>
      {/* COMPANY ADDRESS */}
      <PreviewCard
        header="Company Address"
        businessId={businessId}
        applicationStatus={applicationStatus}
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
        {businessAddressData?.data &&
          Object?.entries(businessAddressData?.data)?.map(
            ([key, value], index: number) => {
              if (key === "id" || key === "location" || value === null)
                return null;
              return (
                <li key={index}>
                  <p className="flex text-[14px] items-center gap-2">
                    {capitalizeString(key)}: {capitalizeString(String(value))}
                  </p>
                </li>
              );
            }
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
      {/* BOARD OF DIRECTORS */}
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
        {boardMemberIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          <BusinessPeople
            businessPeopleList={boardMemberData?.data}
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
          "Senior Management"
        )}
      >
        {managementMemberIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          <BusinessPeople
            businessPeopleList={managementMemberData?.data}
            businessId={businessId}
          />
        )}
      </PreviewCard>
      {/* ATTACHMENTS */}
      <PreviewCard
        header="Attachments"
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
        businessId={businessId}
        applicationStatus={applicationStatus}
      >
        {businessAttachmentsData?.length > 0 && (
          <BusinessPeopleAttachments attachments={businessAttachmentsData} />
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
      >
        {employmentInfoIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          employmentInfoIsSuccess &&
          employmentInfoData?.data(
            <menu className="flex flex-col gap-2">
              <p>
                Working Start Time: {employmentInfoData?.data?.workingStartTime}
              </p>
              <p>
                Working End Time: {employmentInfoData?.data?.workingEndTime}
              </p>
              <p>
                Number Of Employees:{" "}
                {employmentInfoData?.data?.numberOfEmployees}
              </p>
              <p>
                Hiring Date:{" "}
                {new Date(
                  employmentInfoData?.data?.hiringDate
                ).toLocaleDateString()}
              </p>
              <p>
                Employment Declaration Date:{" "}
                {new Date(
                  employmentInfoData?.data?.employmentDeclarationDate
                ).toLocaleDateString()}
              </p>
              <p>
                Financial Year Start Date:{" "}
                {moment(
                  employmentInfoData?.data?.financialYearStartDate
                ).format("MMMM DD")}
              </p>
              <p>
                Financial Year End Date:{" "}
                {moment(employmentInfoData?.data?.financialYearEndDate)
                  .subtract(1, "day")
                  .format("MMMM DD")}
              </p>
            </menu>
          )
        )}
      </PreviewCard>
      {/* ATTACHMENTS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        header="Attachments"
        businessId={businessId}
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          "Attachments"
        )}
      >
        {businessAttachmentsIsLoading ? (
          <figure className="flex items-center gap-3 w-full min-h-[20vh]">
            <Loader className="text-primary" />
            Fetching business attachments...
          </figure>
        ) : (
          businessAttachmentsData?.data?.length > 0 && (
            <BusinessPeopleAttachments
              attachments={businessAttachmentsData.data}
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
              if (
                applicationStatus !== ApplicationStatus.IsAmending &&
                !Object?.values(navigationFlowMassList ?? {})
                  ?.flat()
                  ?.every((navigationStep) => {
                    return businessNavigationFlowsList?.find(
                      (businessStep) =>
                        businessStep?.navigationFlowMass?.stepName ===
                          navigationStep?.stepName && businessStep?.completed
                    );
                  })
              ) {
                toast.error("All steps must be completed before submission");
                return;
              }
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
      <ListBusinessReviewComments />
    </section>
  );
};

export default ForeignCompanyPreviewSubmission;
