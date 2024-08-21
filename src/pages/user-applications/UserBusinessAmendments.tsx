import Loader from '@/components/Loader';
import Table from '@/components/table/Table';
import TableToolbar from '@/components/table/TableToolbar';
import { businessAmendmentColumns } from '@/constants/businessAmendment.constants';
import UserLayout from '@/containers/UserLayout';
import { useLazyFetchUserBusinessAmendmentsQuery } from '@/states/api/businessRegApiSlice';
import { setUserBusinessAmendmentsList } from '@/states/features/businessAmendmentSlice';
import { AppDispatch, RootState } from '@/states/store';
import queryString, { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserBusinessAmendmentsFilter from './UserBusinessAmendmentsFilter';

const UserBusinessAmendments = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { userBusinessAmendmentsList } = useSelector(
    (state: RootState) => state.businessAmendment
  );
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );
  const [showCustomFilter, setShowCustomFilter] = useState<boolean>(false);

  // NAVIGATION
  const { search } = useLocation();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // INITIALIZE FETCH BUSINESS AMENDMENTS QUERY
  const [
    fetchUserBusinessAmendments,
    {
      isFetching: userBusinessAmendmentsIsFetching,
      isError: userBusinessAmendmentsIsError,
      error: userBusinessAmendmentsError,
      data: userBusinessAmendmentsData,
      isSuccess: userBusinessAmendmentsIsSuccess,
    },
  ] = useLazyFetchUserBusinessAmendmentsQuery();

  // FETCH BUSINESS AMENDMENTS
  useEffect(() => {
    if (queryParams?.businessId) {
      fetchUserBusinessAmendments({
        businessId: queryParams.businessId as string,
      });
    }
  }, [fetchUserBusinessAmendments, queryParams.businessId]);

  // HANDLE FETCH BUSINESS AMENDMENTS
  useEffect(() => {
    if (userBusinessAmendmentsIsSuccess) {
      dispatch(
        setUserBusinessAmendmentsList(userBusinessAmendmentsData?.data?.data)
      );
    } else if (userBusinessAmendmentsIsError) {
      const errorResponse =
        (userBusinessAmendmentsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching business amendments';
      toast.error(errorResponse);
    }
  }, [
    userBusinessAmendmentsIsSuccess,
    userBusinessAmendmentsData,
    dispatch,
    userBusinessAmendmentsIsError,
    userBusinessAmendmentsError,
  ]);

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4 bg-white p-6 rounded-md min-h-[85vh]">
        {userBusinessAmendmentsIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-5">
            <TableToolbar
              filterHandler={(e) => {
                e.preventDefault();
                setShowCustomFilter(!showCustomFilter);
              }}
            />
            {showCustomFilter && (
              <UserBusinessAmendmentsFilter
                onSelectAmendmentStatuses={(statuses) => {
                  console.log(statuses);
                }}
                onSelectAmendmentType={(amendmentType) => {
                  console.log(amendmentType);
                }}
              />
            )}
            <Table
              columns={businessAmendmentColumns}
              data={userBusinessAmendmentsList}
            />
          </section>
        )}
      </main>
    </UserLayout>
  );
};

export default UserBusinessAmendments;
