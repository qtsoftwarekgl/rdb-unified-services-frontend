import Loader from '@/components/Loader';
import UserLayout from '@/containers/UserLayout';
import {
  useLazyFetchAmendmentReviewCommentsQuery,
  useLazyFetchBusinessAmendmentsQuery,
  useUpdateBusinessAmendmentStatusMutation,
} from '@/states/api/businessRegApiSlice';
import {
  setAmendmentReviewCommentsList,
  setSelectedAmendmentReviewComment,
  setSelectedBusinessAmendment,
  setUpdateAmendmentReviewCommentModal,
  updateUserBusinessAmendment,
} from '@/states/features/businessAmendmentSlice';
import { AppDispatch, RootState } from '@/states/store';
import { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ErrorResponse,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import BusinessFounderAmendmentdetails from './BusinessFounderAmendDetails';
import CompanyAddressAmendmentDetails from './CompanyAddressAmendmentDetails';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { capitalizeString, formatDateTime } from '@/helpers/strings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BusinessAmendmentReviewComment } from '@/types/models/businessReviewComment';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import UpdateAmendmentReviewComment from './UpdateAmendmentReviewComment';
import Button from '@/components/inputs/Button';
import { updateBusinessThunk } from '@/states/features/businessSlice';

const UserBusinessAmendmentDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );
  const { selectedBusinessAmendment, amendmentReviewCommentsList } =
    useSelector((state: RootState) => state.businessAmendment);
    const { updateBusinessIsLoading, updateBusinessIsSuccess } = useSelector(
      (state: RootState) => state.business
    );

  // NAVIGATION
  const { search } = useLocation();
  const navigate = useNavigate();

  // PARSE QUERY PARAMS
  useState(() => {
    const parsedQuery = new URLSearchParams(search);
    setQueryParams(Object.fromEntries(parsedQuery));
  });

  // INITIALIZE FETCH BUSINESS AMENDMENTS QUERY
  const [
    fetchBusinessAmendmentsQuery,
    {
      isFetching: businessAmendmentsIsFetching,
      data: businessAmendmentsData,
      error: businessAmendmentsError,
      isError: businessAmendmentsIsError,
      isSuccess: businessAmendmentsIsSuccess,
    },
  ] = useLazyFetchBusinessAmendmentsQuery();

  // FETCH BUSINESS AMENDMENTS
  useEffect(() => {
    fetchBusinessAmendmentsQuery({
      searchKey: queryParams?.amendmentType,
      businessId: queryParams?.businessId,
    });
  }, [fetchBusinessAmendmentsQuery, queryParams]);

  // HANDLE FETCH BUSINESS AMENDMENTS RESPONSE
  useEffect(() => {
    if (businessAmendmentsIsSuccess && businessAmendmentsData) {
      if (businessAmendmentsData?.data?.data?.length > 0) {
        dispatch(
          setSelectedBusinessAmendment(businessAmendmentsData.data.data[0])
        );
      }
    } else if (businessAmendmentsIsError && businessAmendmentsError) {
      toast.error((businessAmendmentsError as ErrorResponse)?.data?.message);
    }
  }, [
    businessAmendmentsIsSuccess,
    businessAmendmentsData,
    businessAmendmentsIsError,
    businessAmendmentsError,
    dispatch,
  ]);

  // INITIALIZE FETCH AMENDMENT REVIEW COMMENTS QUERY
  const [
    fetchAmendmentReviewComments,
    {
      isFetching: amendmentReviewCommentsIsFetching,
      data: amendmentReviewCommentsData,
      error: amendmentReviewCommentsError,
      isError: amendmentReviewCommentsIsError,
      isSuccess: amendmentReviewCommentsIsSuccess,
    },
  ] = useLazyFetchAmendmentReviewCommentsQuery();

  // FETCH AMENDMENT REVIEW COMMENTS
  useEffect(() => {
    if (selectedBusinessAmendment) {
      fetchAmendmentReviewComments({
        amendmentDetailId: selectedBusinessAmendment?.id,
      });
    }
  }, [fetchAmendmentReviewComments, selectedBusinessAmendment]);

  // HANDLE FETCH AMENDMENT REVIEW COMMENTS RESPONSE
  useEffect(() => {
    if (amendmentReviewCommentsIsSuccess && amendmentReviewCommentsData) {
      dispatch(
        setAmendmentReviewCommentsList(amendmentReviewCommentsData?.data)
      );
    } else if (amendmentReviewCommentsIsError && amendmentReviewCommentsError) {
      toast.error(
        (amendmentReviewCommentsError as ErrorResponse)?.data?.message
      );
    }
  }, [
    amendmentReviewCommentsIsSuccess,
    amendmentReviewCommentsData,
    amendmentReviewCommentsIsError,
    amendmentReviewCommentsError,
    dispatch,
  ]);

  // INITIALIZE UPDATE BUSINESS AMENDMENT STATUS MUTATION
  const [updateBusinessAmendmentStatus, {
    isLoading: isUpdatingBusinessAmendmentStatus,
    isSuccess: isBusinessAmendmentStatusUpdated,
    isError: isBusinessAmendmentStatusUpdateError,
    error: businessAmendmentStatusUpdateError,
    reset: resetUpdateBusinessAmendmentStatus,
    data: updatedBusinessAmendmentStatusData,
  }] = useUpdateBusinessAmendmentStatusMutation();

  // HANDLE UPDATE BUSINESS AMENDMENT STATUS RESPONSE
  useEffect(() => {
    if (isBusinessAmendmentStatusUpdated) {
      toast.success('Business Amendment Status Updated Successfully');
      dispatch(
        setSelectedBusinessAmendment(updatedBusinessAmendmentStatusData?.data)
      );
      dispatch(
        updateUserBusinessAmendment(updatedBusinessAmendmentStatusData?.data)
      );
      dispatch(updateBusinessThunk({
        businessId: queryParams?.businessId,
        applicationStatus: 'IS_AMENDING',
      }))
      resetUpdateBusinessAmendmentStatus();
    }
    if (isBusinessAmendmentStatusUpdateError) {
      const errorResponse =
        (businessAmendmentStatusUpdateError as ErrorResponse)?.data?.message ||
        'An error occurred while updating Business Amendment Status';
      toast.error(errorResponse);
    }
    return () => {
      resetUpdateBusinessAmendmentStatus();
    };
  }, [
    isBusinessAmendmentStatusUpdated,
    isBusinessAmendmentStatusUpdateError,
    updatedBusinessAmendmentStatusData,
    businessAmendmentStatusUpdateError,
    resetUpdateBusinessAmendmentStatus,
    dispatch,
    navigate,
    queryParams?.businessId,
  ]);

  useEffect(() => {
    if (updateBusinessIsSuccess) {
      navigate(
        `${selectedBusinessAmendment?.business?.serviceId?.path}?businessId=${selectedBusinessAmendment?.business?.id}`
      );
    }
  }, [updateBusinessIsSuccess, navigate, queryParams, selectedBusinessAmendment?.business?.serviceId?.path, selectedBusinessAmendment?.business?.id]);

  return (
    <UserLayout>
      <main className="w-full min-h-[85vh] bg-white p-6 rounded-md">
        {businessAmendmentsIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-4 p-6">
            <section className="w-full flex flex-col gap-4 p-5">
              <h2 className="uppercase text-primary font-semibold text-lg">
                Company details
              </h2>
              <menu className="grid grid-cols-2 gap-5 w-full">
                <ul className="flex items-center gap-2">
                  <p>Application Reference ID: </p>
                  <p className="font-medium">
                    {
                      selectedBusinessAmendment?.business
                        ?.applicationReferenceId
                    }
                  </p>
                </ul>
                <ul className="flex items-center gap-2">
                  <p> Company name:</p>
                  <p className="font-medium">
                    {selectedBusinessAmendment?.business?.companyName ||
                      selectedBusinessAmendment?.business?.branchName ||
                      selectedBusinessAmendment?.business?.enterpriseName ||
                      selectedBusinessAmendment?.business
                        ?.enterpriseBusinessName}
                  </p>
                </ul>
                <ul className="flex items-center gap-2">
                  <p> Application status</p>
                  <p className="font-medium">
                    {capitalizeString(
                      selectedBusinessAmendment?.business?.applicationStatus
                    )}
                  </p>
                </ul>
                <ul className="flex items-center gap-2">
                  <p>Amendment type</p>
                  <p className="font-medium">
                    {capitalizeString(selectedBusinessAmendment?.amendmentType)}
                  </p>
                </ul>
                <ul className="flex items-center gap-2">
                  <p>Company code: </p>
                  <p className="font-medium">
                    {selectedBusinessAmendment?.business?.tin || 'N/A'}
                  </p>
                </ul>
                <ul className="flex items-center gap-2">
                  <p>Request date:</p>
                  <p className="font-medium">
                    {formatDateTime(selectedBusinessAmendment?.createdAt)}
                  </p>
                </ul>
              </menu>
            </section>
            {queryParams?.amendmentType === 'AMEND_ADD_BUSINESS_FOUNDER' && (
              <BusinessFounderAmendmentdetails />
            )}
            {queryParams?.amendmentType === 'AMEND_COMPANY_ADDRESS' && (
              <CompanyAddressAmendmentDetails />
            )}
          </section>
        )}
        <article className="w-full flex flex-col gap-5 px-5">
          {amendmentReviewCommentsIsFetching ? (
            <figure className="w-full flex items-center justify-center min-h-[30vh]">
              <Loader className="text-primary" />
            </figure>
          ) : (
            <menu className="w-full flex flex-col gap-4">
              <ul className="w-full flex items-center gap-3 justify-between">
                <h3 className="uppercase text-primary font-medium px-2">
                  Comment(s)
                </h3>
                <Link
                  to={'#'}
                  className="bg-primary text-white p-1 rounded-md transition-all ease-in-out duration-300 px-2 hover:scale-[1.01] text-[13px]"
                  onClick={(e) => {
                    e.preventDefault();
                    updateBusinessAmendmentStatus({
                      id: selectedBusinessAmendment?.id,
                      amendmentStatus: 'RESUBMITTED',
                    });
                  }}
                >
                  {updateBusinessIsLoading ? <Loader /> : 'Go to amendment'}
                </Link>
              </ul>
              <p className="px-2 font-bold my-3">
                Make sure to have attended to the comments before resolving the
                review.
              </p>
              {amendmentReviewCommentsList?.map((comment, index) => {
                return (
                  <AmendmentReviewComment
                    amendmentReviewComment={comment}
                    key={index}
                  />
                );
              })}
            </menu>
          )}
        </article>
        <menu className="w-full flex items-center gap-3 justify-between p-5 my-4">
          <Button
            value={'Cancel'}
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/user/amendments?businessId=${queryParams?.businessId}`
              );
            }}
          />
          <Button
            value={
              isUpdatingBusinessAmendmentStatus ? (
                <Loader />
              ) : (
                `Return for verification`
              )
            }
            primary
            disabled={
              !amendmentReviewCommentsList?.every((amendmentReviewComment) =>
                ['APPROVED', 'RESOLVED'].includes(
                  amendmentReviewComment?.status
                )
              )
            }
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/user/amendments?businessId=${queryParams?.businessId}`
              );
            }}
          />
        </menu>
      </main>
      <UpdateAmendmentReviewComment />
    </UserLayout>
  );
};

export const AmendmentReviewComment = ({
  amendmentReviewComment,
}: {
  amendmentReviewComment: BusinessAmendmentReviewComment;
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  return (
    <article className="w-full flex items-center gap-4 p-3 rounded-md shadow-md justify-between">
      <ul className="flex flex-col gap-2">
        <p>{amendmentReviewComment?.comment}</p>
        <p className="text-[13px]">{amendmentReviewComment?.status}</p>
      </ul>
      <menu className="flex items-center gap-2">
        <CustomTooltip
          label="Click to mark as resolved"
          labelClassName="bg-green-600"
        >
          <FontAwesomeIcon
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                setSelectedAmendmentReviewComment(amendmentReviewComment)
              );
              dispatch(setUpdateAmendmentReviewCommentModal(true));
            }}
            className="p-2 px-[8.1px] rounded-full transition-all ease-in-out duration-300 hover:scale-[1.01] shadow-md bg-green-700 text-white cursor-pointer"
            icon={faCircleCheck}
          />
        </CustomTooltip>
      </menu>
    </article>
  );
};

export default UserBusinessAmendmentDetails;
