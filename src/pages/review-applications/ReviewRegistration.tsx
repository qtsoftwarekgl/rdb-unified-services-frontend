import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch } from 'react-redux';
import { useLazyFetchBackOfficeBusinessesQuery } from '@/states/api/businessRegApiSlice';
import { useEffect } from 'react';
import {
  setBusinessPage,
  setBusinessSize,
  setBusinessTotalElements,
  setBusinessTotalPages,
  setBusinessesList,
  updateBusinessThunk,
} from '@/states/features/businessSlice';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Business } from '@/types/models/business';
import Table from '@/components/table/Table';
import AdminLayout from '@/containers/AdminLayout';
import Loader from '@/components/Loader';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { capitalizeString, formatDate } from '@/helpers/strings';
import { businessColumns } from '@/constants/business.constants';
import CustomPopover from '@/components/inputs/CustomPopover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleInfo,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import CustomTooltip from '@/components/inputs/CustomTooltip';

const ReviewRegistration = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
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
      isLoading: businessesIsLoading,
      isSuccess: businessesIsSuccess,
      error: businessesError,
    },
  ] = useLazyFetchBackOfficeBusinessesQuery();

  // FETCH BUSINESSES
  useEffect(() => {
    fetchBusinesses({
      applicationStatus: 'SUBMITTED',
      page,
      size,
    });
  }, [fetchBusinesses, page, size]);

  // HANDLE FETCH BUSINESS RESPONSE
  useEffect(() => {
    if (businessesIsSuccess) {
      dispatch(setBusinessesList(businessesData?.data?.data));
      dispatch(setBusinessTotalElements(businessesData?.data?.totalElements));
      dispatch(setBusinessTotalPages(businessesData?.data?.totalPages));
    } else if (businessesIsError) {
      if ((businessesError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while fetching businesses');
      } else {
        toast.error((businessesError as ErrorResponse)?.data?.message);
      }
    }
  }, [
    businessesData,
    businessesError,
    businessesIsError,
    businessesIsSuccess,
    dispatch,
  ]);

  // TABLE COLUMNS
  const businessesColumns = [
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
                <CustomTooltip label="Click to view options">
                  <FontAwesomeIcon
                    className="text-primary text-md p-0 transition-all duration-300 hover:scale-[.98]"
                    icon={faEllipsisVertical}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <menu className="bg-white flex flex-col gap-1 p-0 rounded-md">
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(
                    navigate(
                      `${row?.original?.service?.path}?businessId=${row?.original?.id}`
                    )
                  );
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
                  dispatch(
                    updateBusinessThunk({
                      businessId: row?.original?.id,
                      applicationStatus: 'APPROVED',
                    })
                  );
                }}
                to={'#'}
              >
                <FontAwesomeIcon
                  className="text-primary"
                  icon={faCircleCheck}
                />{' '}
                Approve
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <section className="w-full flex flex-col gap-3 bg-white p-6 rounded-md">
        {businessesIsLoading ? (
          <figure className="w-full flex justify-center">
            <Loader />
          </figure>
        ) : (
          <Table
            page={page}
            size={size}
            totalElements={totalElements}
            totalPages={totalPages}
            setPage={setBusinessPage}
            setSize={setBusinessSize}
            columns={businessesColumns as ColumnDef<Business>[]}
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
    </AdminLayout>
  );
};

export default ReviewRegistration;
