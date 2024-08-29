import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode, useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../states/store";
import { useDispatch, useSelector } from "react-redux";
import Button from "../inputs/Button";
import { RDBAdminEmailPattern } from "@/constants/Users";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ErrorResponse, Link } from "react-router-dom";
import { businessId } from "@/types/models/business";
import { UUID } from "crypto";
import { useCreateNavigationFlowMutation } from "@/states/api/businessRegApiSlice";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { ApplicationStatus } from "@/Enums/ApplicationStatus";
import { faComments, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  setBusinessNavigationFlowsList,
  setSelectedNavigationFlow,
} from "@/states/features/navigationFlowSlice";
import {
  fetchBusinessReviewCommentsThunk,
  setListBusinessReviewCommentsModal,
} from "@/states/features/businessReviewCommentSlice";
import { findNavigationFlowById } from "@/helpers/business.helpers";
import CustomTooltip from "../inputs/CustomTooltip";
import { removeArrayDuplicates } from "@/helpers/strings";
import { BusinessReviewComment } from "@/types/models/businessReviewComment";

interface PreviewCardProps {
  header: string;
  children: ReactNode;
  businessId?: businessId;
  applicationStatus?: string;
  navigationFlowMassId?: UUID;
  navigationFlowId?: UUID;
  action?: boolean;
}

const PreviewCard: FC<PreviewCardProps> = ({
  children,
  header,
  navigationFlowMassId,
  businessId,
  applicationStatus,
  navigationFlowId,
  action = false,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const {
    businessReviewCommentsList,
    businessReviewCommentsIsFetching,
    businessReviewCommentsIsSuccess,
  } = useSelector((state: RootState) => state.businessReviewComment);
  const { businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const [reviewComments, setReviewComments] = useState<BusinessReviewComment[]>(
    removeArrayDuplicates(
      businessReviewCommentsList?.filter(
        (reviewComment) =>
          reviewComment?.navigationFlow?.id === navigationFlowId
      )
    ) as BusinessReviewComment[]
  );
  const [unresolvedReviewComments, setUnresolvedReviewComments] = useState(
    removeArrayDuplicates(
      businessReviewCommentsList?.filter(
        (reviewComment) =>
          reviewComment?.navigationFlow?.id === navigationFlowId &&
          reviewComment?.status === "UNRESOLVED"
      )
    ) as BusinessReviewComment[]
  );

  // INITIALIZE CREATE BUSINESS NAVIGATION FLOW
  const [
    createNavigationFlow,
    {
      data: createNavigationFlowData,
      error: createNavigationFlowError,
      isError: createNavigationFlowIsError,
      isSuccess: createNavigationFlowIsSuccess,
      isLoading: createNavigationFlowIsLoading,
      reset: resetCreateNavigationFlow,
    },
  ] = useCreateNavigationFlowMutation();

  // HANDLE CREATE BUSINESS NAVIGATION FLOW RESPONSE
  useEffect(() => {
    if (!action && createNavigationFlowIsError) {
      const errorResponse =
        (createNavigationFlowError as ErrorResponse)?.data?.message ||
        "An error occurred while creating business navigation flow. Refresh and try again";
      toast.error(errorResponse);
      resetCreateNavigationFlow();
    } else if (createNavigationFlowIsSuccess) {
      dispatch(setBusinessNavigationFlowsList(createNavigationFlowData?.data));
      resetCreateNavigationFlow();
    }
  }, [
    createNavigationFlowData?.data,
    createNavigationFlowError,
    createNavigationFlowIsError,
    createNavigationFlowIsSuccess,
    dispatch,
    resetCreateNavigationFlow,
  ]);

  // FETCH BUSINESS REVIEW COMMENTS
  useEffect(() => {
    if (!action && businessId && navigationFlowId) {
      dispatch(
        fetchBusinessReviewCommentsThunk({
          navigationFlowId,
          businessId,
        })
      );
    }
  }, [businessId, dispatch, navigationFlowId]);

  // UPDATE STEP COMMENTS
  useEffect(() => {
    setReviewComments(
      removeArrayDuplicates(
        businessReviewCommentsList?.filter(
          (reviewComment) =>
            reviewComment?.navigationFlow?.id === navigationFlowId
        )
      ) as BusinessReviewComment[]
    );
  }, [businessReviewCommentsList, navigationFlowId]);

  // UPDATE UNRESOLVED COMMENTS
  useEffect(() => {
    setUnresolvedReviewComments(
      removeArrayDuplicates(
        businessReviewCommentsList?.filter(
          (reviewComment) =>
            reviewComment?.navigationFlow?.id === navigationFlowId &&
            reviewComment?.status === "UNRESOLVED"
        )
      ) as BusinessReviewComment[]
    );
  }, [businessReviewCommentsList, navigationFlowId]);

  return (
    <section
      className={`flex flex-col w-full gap-3 p-4 rounded-md shadow-sm border-primary border-[.3px]`}
    >
      <menu className="flex items-center justify-between w-full gap-3">
        {
          <Link
            to={"#"}
            onClick={(e) => {
              e.preventDefault();
            }}
            className="text-lg font-semibold uppercase text-primary"
          >
            {header}
          </Link>
        }
        {!action && (
          <menu className="relative flex items-center gap-4">
            {createNavigationFlowIsLoading ? (
              <Loader className="text-primary" />
            ) : (
              [
                ApplicationStatus.Inprogress,
                ApplicationStatus.IsAmending,
                "ACTION_REQUIRED",
              ].includes(String(applicationStatus)) && (
                <CustomTooltip label="Click to update this step">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={(e) => {
                      e.preventDefault();
                      if (businessId && navigationFlowMassId) {
                        createNavigationFlow({
                          isActive: true,
                          massId: navigationFlowMassId,
                          businessId,
                        });
                      }
                    }}
                    className="text-primary mr-4 text-[18px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                  />
                </CustomTooltip>
              )
            )}
            {businessReviewCommentsIsFetching ? (
              <figure className="flex items-center gap-2 text-[12px]">
                <Loader className="text-primary" />
                Loading comments
              </figure>
            ) : (
              businessReviewCommentsIsSuccess &&
              reviewComments?.length > 0 && (
                <Link
                  to={"#"}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      setSelectedNavigationFlow(
                        findNavigationFlowById(
                          businessNavigationFlowsList,
                          navigationFlowId
                        )
                      )
                    );
                    dispatch(setListBusinessReviewCommentsModal(true));
                  }}
                  className="bg-white text-primary text-[12px] p-1 px-2 rounded-md transition-all ease-in-out duration-300 hover:scale-[1.01]"
                >
                  <menu className="flex items-center gap-2 text-[13px] relative p-1 rounded-full z-[10000]">
                    {reviewComments?.filter(
                      (comment) => comment?.status === "UNRESOLVED"
                    )?.length > 0 && (
                      <p
                        className={`absolute top-[-20px] right-0 text-red-600 font-bold`}
                      >
                        {unresolvedReviewComments?.length}
                      </p>
                    )}
                    <CustomTooltip
                      label={`${reviewComments?.length} Comment(s)`}
                    >
                      <FontAwesomeIcon
                        className="absolute top-[-5px] right-2"
                        icon={faComments}
                      />
                    </CustomTooltip>
                  </menu>
                </Link>
              )
            )}
          </menu>
        )}
      </menu>
      <section className="flex flex-col w-full gap-3 my-2">{children}</section>
      {RDBAdminEmailPattern.test(String(user?.email)) && (
        <menu className="flex items-center justify-center w-full">
          <Button
            styled={false}
            onClick={(e) => {
              e.preventDefault();
            }}
            value={
              <menu className="flex items-center gap-2 transition-all duration-300 hover:gap-3">
                <p className="text-[13px]">View details</p>
                <FontAwesomeIcon className="text-[13px]" icon={faArrowRight} />
              </menu>
            }
          />
        </menu>
      )}
    </section>
  );
};

export default PreviewCard;
