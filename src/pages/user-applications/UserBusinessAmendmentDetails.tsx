import Loader from '@/components/Loader';
import UserLayout from '@/containers/UserLayout';
import { useLazyFetchBusinessAmendmentsQuery } from '@/states/api/businessRegApiSlice';
import { setSelectedBusinessAmendment } from '@/states/features/businessAmendmentSlice';
import { AppDispatch } from '@/states/store';
import { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorResponse, useLocation } from 'react-router-dom';
import BusinessFounderAmendmentdetails from './BusinessFounderAmendDetails';
import CompanyAddressAmendmentDetails from './CompanyAddressAmendmentDetails';
import { toast } from 'react-toastify';

const UserBusinessAmendmentDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // NAVIGATION
  const { search } = useLocation();

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

  return (
    <UserLayout>
      <main className="w-full min-h-[85vh] bg-white p-6 rounded-md">
        {businessAmendmentsIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-4">
            {queryParams?.amendmentType === 'AMEND_ADD_BUSINESS_FOUNDER' && (
              <BusinessFounderAmendmentdetails />
            )}
            {queryParams?.amendmentType === 'AMEND_COMPANY_ADDRESS' && (
              <CompanyAddressAmendmentDetails />
            )}
          </section>
        )}
      </main>
    </UserLayout>
  );
};

export default UserBusinessAmendmentDetails;
