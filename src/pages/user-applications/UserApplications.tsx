import {
  faCircleInfo,
  faEllipsisVertical,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '../../components/table/Table';
import UserLayout from '../../containers/UserLayout';
import Button from '../../components/inputs/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../states/store';
import { capitalizeString, formatDate } from '../../helpers/strings';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useLazyFetchBusinessesQuery } from '@/states/api/businessRegApiSlice';
import { useEffect } from 'react';
import {
  setBusinessesList,
  setBusinessPage,
  setBusinessSize,
  setBusinessTotalElements,
  setBusinessTotalPages,
} from '@/states/features/businessSlice';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { Business } from '@/types/models/business';
import CustomPopover from '@/components/inputs/CustomPopover';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { businessColumns } from '@/constants/business.constants';

const UserApplications = () => {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { businessesList, page, size, totalElements, totalPages } = useSelector(
    (state: RootState) => state.business
  );

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE FETCH BUSINESSES QUERY
  const [
    fetchBusinesses,
    {
      data: businessesData,
      isError: businessesIsError,
      isFetching: businessesIsFetching,
      isSuccess: businessesIsSuccess,
      error: businessesError,
    },
  ] = useLazyFetchBusinessesQuery();

  // FETCH BUSINESSES
  useEffect(() => {
    fetchBusinesses({
      page,
      size,
    });
  }, [fetchBusinesses, page, size]);

  // HANDLE FETCH BUSINESSES RESPONSE
  useEffect(() => {
    if (businessesIsSuccess) {
      dispatch(setBusinessesList(businessesData?.data?.data));
      dispatch(setBusinessTotalElements(businessesData?.data?.totalElements));
      dispatch(setBusinessTotalPages(businessesData?.data?.totalPages));
    } else if (businessesIsError) {
      toast.error(
        (businessesError as ErrorResponse)?.data?.message ||
          'An error occurred while fetching businesses'
      );
    }
  }, [
    businessesIsSuccess,
    businessesIsError,
    dispatch,
    businessesData?.data?.data,
    businessesData?.data?.totalElements,
    businessesData?.data?.totalPages,
    businessesError,
  ]);

  const userApplicationsColumns = [
    ...businessColumns,
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<Business> }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="flex items-center justify-center w-full gap-2 text-[12px] cursor-pointer">
                <FontAwesomeIcon
                  className="text-primary text-md p-0 transition-all duration-300 hover:scale-[.98]"
                  icon={faEllipsisVertical}
                />
              </menu>
            }
          >
            <menu className="bg-white flex flex-col gap-3 p-0 rounded-md">
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                }}
                to={'#'}
              >
                <FontAwesomeIcon className="text-primary" icon={faCircleInfo} />
                View details
              </Link>
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                }}
                to={'#'}
              >
                <FontAwesomeIcon
                  className="text-primary"
                  icon={faPenToSquare}
                />{' '}
                Start amendment
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <section className="flex flex-col w-full gap-6 p-8 bg-white rounded-md">
        <menu className="flex items-center justify-between w-full gap-3">
          <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
            My Applications List
          </h1>
          <Button
            primary
            route="/services"
            value={
              <menu className="flex text-[13px] items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                New application
              </menu>
            }
          />
        </menu>
        {businessesIsFetching ? (
          <figure className="w-full flex justify-center min-h-[30vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <Table
            totalElements={totalElements}
            totalPages={totalPages}
            page={page}
            size={size}
            setPage={setBusinessPage}
            setSize={setBusinessSize}
            columns={userApplicationsColumns as ColumnDef<Business>[]}
            data={businessesList?.map((business, index) => {
              return {
                ...business,
                no: index + 1,
                dateOfIncorporation: formatDate(
                  business?.createdAt
                ) as unknown as Date,
                companyType: capitalizeString(business?.companyType) || 'N/A',
                assignee: 'RDB Verifier',
                companyName: (
                  business?.companyName ||
                  business?.enterpriseName ||
                  business?.enterpriseBusinessName
                )?.toUpperCase(),
              };
            })}
          />
        )}
      </section>
    </UserLayout>
  );
};

export default UserApplications;
