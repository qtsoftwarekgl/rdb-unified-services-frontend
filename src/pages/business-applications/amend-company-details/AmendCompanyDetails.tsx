import UserLayout from '../../../containers/UserLayout';
import { capitalizeString, formatDate } from '../../../helpers/strings';
import { useSelector } from 'react-redux';
import { RootState } from '../../../states/store';
import {
  useLazyFetchBusinessesQuery,
  useUpdateBusinessMutation,
} from '@/states/api/businessRegApiSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setBusinessesList,
  setBusinessPage,
  setBusinessSize,
  setBusinessTotalElements,
  setBusinessTotalPages,
} from '@/states/features/businessSlice';
import { toast } from 'react-toastify';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import Table from '@/components/table/Table';
import { businessColumns } from '@/constants/business.constants';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Business } from '@/types/models/business';
import CustomPopover from '@/components/inputs/CustomPopover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import Loader from '@/components/Loader';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

const AmendCompanyDetails = () => {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { businessesList, page, size, totalElements, totalPages } = useSelector(
    (state: RootState) => state.business
  );
  const [servicePath, setServicePath] = useState<string>('');

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
      applicationStatus: 'APPROVED',
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
    if (updateBusinessIsSuccess) {
      toast.success('Starting amendment...');
      navigate(`${servicePath}?businessId=${updateBusinessData?.data?.id}`);
    } else if (updateBusinessIsError) {
      setServicePath('');
      toast.error(
        (updateBusinessError as ErrorResponse)?.data?.message ||
          'An error occurred while updating business'
      );
    }
  }, [
    updateBusinessIsSuccess,
    updateBusinessIsError,
    updateBusinessData,
    updateBusinessError,
    servicePath,
    navigate,
  ]);

  // BUSINESSAMENDMENT COLUMNS
  const businessAmendmentColumns = [
    ...businessColumns,
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: Row<Business>) => {
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
                  setServicePath(row?.original?.service?.path);
                  updateBusiness({
                    businessId: row?.original?.id,
                    applicationStatus: 'IS_AMENDING',
                  });
                }}
                to={'#'}
              >
                <FontAwesomeIcon
                  className="text-primary"
                  icon={faPenToSquare}
                />{' '}
                {updateBusinessIsLoading ? (
                  <Loader className="text-primary" />
                ) : (
                  'Start amendment'
                )}
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <main className="bg-white flex flex-col gap-5 w-full p-6 rounded-md">
        {businessesIsFetching ? (
          <figure className="w-full min-h-[40vh] flex items-center justify-center">
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
            columns={businessAmendmentColumns as ColumnDef<Business>[]}
          />
        )}
      </main>
    </UserLayout>
  );
};

export default AmendCompanyDetails;
