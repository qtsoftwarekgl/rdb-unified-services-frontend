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
import {
  ErrorResponse,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import UserBusinessAmendmentsFilter from './UserBusinessAmendmentsFilter';
import { Row } from '@tanstack/react-table';
import { BusinessAmendment } from '@/types/models/business';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faInfo } from '@fortawesome/free-solid-svg-icons';
import CustomPopover from '@/components/inputs/CustomPopover';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

const UserBusinessAmendmentsList = () => {
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
  const navigate = useNavigate();

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
  }, [fetchUserBusinessAmendments, navigate, queryParams.businessId]);

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

  // BUSINESS AMENDMENT EXTENDED COLUMNS
  const businessAmendmentExtendedColumns = [
    ...businessAmendmentColumns,
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }: { row: Row<BusinessAmendment> }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="items-center justify-center cursor-pointer w-full">
                <FontAwesomeIcon
                  className="text-primary"
                  icon={faEllipsisVertical}
                />
              </menu>
            }
          >
            <menu className="w-full flex flex-col gap-2">
              <Link
                to={'#'}
                className="flex items-center gap-2 p-2 py-1 rounded-md text-[13px] hover:bg-background"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `details?businessId=${row.original.business?.id}&amendmentType=${row.original.amendmentType}`
                  );
                }}
              >
                <FontAwesomeIcon
                  className="p-1 px-[8px] items-center rounded-full bg-primary text-white"
                  icon={faInfo}
                />
                View amendment
              </Link>
              <Link
                to={'#'}
                className="flex items-center gap-2 p-2 py-1 rounded-md text-[13px] hover:bg-red-700 hover:text-white"
              >
                <FontAwesomeIcon
                  className="p-1 px-[4.1px] rounded-full bg-red-700 text-white"
                  icon={faCircleXmark}
                />
                Withdraw
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4 bg-white p-6 rounded-md min-h-[85vh]">
        {userBusinessAmendmentsIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : userBusinessAmendmentsIsSuccess && (
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
              columns={businessAmendmentExtendedColumns}
              data={userBusinessAmendmentsList}
            />
          </section>
        )}
      </main>
    </UserLayout>
  );
};

export default UserBusinessAmendmentsList;
