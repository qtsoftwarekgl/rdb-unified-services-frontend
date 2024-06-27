import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch } from 'react-redux';
import { useLazyFetchBusinessesQuery } from '@/states/api/businessRegApiSlice';
import { useEffect } from 'react';
import {
  setBusinessTotalElements,
  setBusinessTotalPages,
  setBusinessesList,
} from '@/states/features/businessSlice';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Business } from '@/types/models/business';
import Button from '@/components/inputs/Button';
import Table from '@/components/table/Table';
import AdminLayout from '@/containers/AdminLayout';
import Loader from '@/components/Loader';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import { capitalizeString, formatDate } from '@/helpers/strings';

const ReviewRegistration = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessesList } = useSelector((state: RootState) => state.business);

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
  ] = useLazyFetchBusinessesQuery();

  // FETCH BUSINESSES
  useEffect(() => {
    fetchBusinesses({
      page: 1,
      size: 10,
      applicationStatus: 'SUBMITTED',
    });
  }, [fetchBusinesses]);

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
    {
      id: 'no',
      header: 'No',
      accessorKey: 'no',
    },
    {
      id: 'companyName',
      header: 'Company Name',
      accessorKey: 'companyName',
    },
    {
      id: 'companyType',
      header: 'Company Type',
      accessorKey: 'companyType',
    },
    {
      id: 'dateOfIncorporation',
      header: 'Date of Incorporation',
      accessorKey: 'dateOfIncorporation',
    },
    {
      id: 'applicationStatus',
      header: 'Status',
      accessorKey: 'applicationStatus',
    },
    {
      id: 'assignee',
      header: 'Assigned To',
      accessorKey: 'assignee',
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<Business> }) => {
        return (
          <Button
            styled={false}
            route={`/services/company-details/${row.original.id}`}
            value="Full info"
          />
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
