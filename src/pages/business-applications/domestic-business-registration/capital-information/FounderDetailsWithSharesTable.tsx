import CustomPopover from '@/components/inputs/CustomPopover';
import Table from '@/components/table/Table';
import { founderDetailsWithPercentagesColumns } from '@/constants/founders.constants';
import {
  setFounderWithSharesDetailsModal,
  setSelectedFounderDetailWithShares,
} from '@/states/features/founderDetailSlice';
import { AppDispatch } from '@/states/store';
import { FounderDetail } from '@/types/models/personDetail';
import { faFlag, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faCircleInfo, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ErrorResponse,
  Link,
  URLSearchParamsInit,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import FounderDetailsWithSharesDetails from './FounderDetailsWithSharesDetails';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import {
  setActiveBeneficialOwnerNavigationStep,
} from '@/states/features/beneficialOwnerSlice';
import { Button } from '@/components/ui/button';
import { useCreateBeneficialOwnerMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import queryString, { ParsedQuery } from 'query-string';
import Loader from '@/components/Loader';

interface FounderDetailsWithPercentagesProps {
  founderDetailsList: {
    founderDetail: FounderDetail;
    shareQuantityPercentage: number;
  }[];
  setAddNewBeneficialOwner?: (value: boolean) => void;
}

const FounderDetailsWithShares = ({
  founderDetailsList,
  setAddNewBeneficialOwner,
}: FounderDetailsWithPercentagesProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [
    founderDetailsWithPercentagesList,
    setFounderDetailsWithPercentagesList,
  ] = useState(
    founderDetailsList?.filter(
      (founderDetail) => founderDetail?.shareQuantityPercentage >= 98
    )
  );
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // NAVIGATION
  const { search } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // INITIALIZE CREATE BENEFICIAL OWNER MUTATION
  const [
    createBeneficialOwner,
    {
      data: createBeneficialOwnerData,
      error: createBeneficialOwnerError,
      isLoading: createBeneficialOwnerIsLoading,
      isSuccess: createBeneficialOwnerIsSuccess,
      reset: resetCreateBeneficialOwner,
      isError: createBeneficialOwnerIsError,
    },
  ] = useCreateBeneficialOwnerMutation();

  // HANDLE CREATE BENEFICIAL OWNER RESPONSE
  useEffect(() => {
    if (createBeneficialOwnerIsSuccess) {
      resetCreateBeneficialOwner();
      setSearchParams({
        ...searchParams,
        businessId: queryParams?.businessId,
        beneficialOwnerId: createBeneficialOwnerData?.data?.id,
      } as URLSearchParamsInit);
      setAddNewBeneficialOwner && setAddNewBeneficialOwner(true);
      dispatch(setActiveBeneficialOwnerNavigationStep('tin_ownership'));
    } else if (createBeneficialOwnerIsError) {
      resetCreateBeneficialOwner();
      const errorResponse =
        (createBeneficialOwnerError as ErrorResponse)?.data?.message ||
        'Failed to create beneficial owner';
      toast.error(errorResponse);
    }
  }, [
    createBeneficialOwnerData?.data?.id,
    createBeneficialOwnerError,
    createBeneficialOwnerIsError,
    createBeneficialOwnerIsSuccess,
    dispatch,
    navigate,
    queryParams,
    resetCreateBeneficialOwner,
    searchParams,
    setAddNewBeneficialOwner,
    setSearchParams,
  ]);

  useEffect(() => {
    setFounderDetailsWithPercentagesList(
      founderDetailsList?.filter(
        (founderDetail) => founderDetail?.shareQuantityPercentage >= 98
      )
    );
  }, [founderDetailsList]);

  // FOUNDER DETAILS WITH PERCENTAGES COLUMNS
  const founderDetailsWithPercentagesExtendedColumns = [
    ...founderDetailsWithPercentagesColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({
        row,
      }: {
        row: Row<{
          founderDetail: FounderDetail;
          shareQuantityPercentage: number;
        }>;
      }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="w-full flex items-center gap-2 justify-center cursor-pointer">
                <CustomTooltip label="Actions">
                  <FontAwesomeIcon
                    className="bg-slate-200 hover:bg-slate-300 p-1 px-4 rounded-md"
                    icon={faEllipsis}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <Link
              className="w-full flex items-center gap-2 text-[13px] text-center p-3 rounded-sm hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedFounderDetailWithShares(row?.original));
                dispatch(setFounderWithSharesDetailsModal(true));
              }}
              to={'#'}
            >
              <FontAwesomeIcon className="text-primary" icon={faCircleInfo} />
              View details
            </Link>
            <Link
              className="w-full flex items-center gap-2 text-[13px] text-center p-3 rounded-sm hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedFounderDetailWithShares(row?.original));
                createBeneficialOwner({
                  businessId: queryParams?.businessId,
                  founderDetailId: row?.original?.founderDetail?.id,
                  controlType: 'DIRECT',
                  beneficialOwnerType: 'REGULAR_MANAGEMENT',
                });
              }}
              to={'#'}
            >
              <FontAwesomeIcon className="text-primary" icon={faFlag} /> Report
              as beneficial owner
            </Link>
            <Link
              className="w-full flex items-center gap-2 text-[13px] text-center p-3 rounded-sm hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setSelectedFounderDetailWithShares({
                    shareQuantityPercentage:
                      row?.original?.shareQuantityPercentage,
                    founderDetail: {
                      id: row?.original?.founderDetail?.id,
                    },
                  })
                );
                createBeneficialOwner({
                  businessId: queryParams?.businessId,
                  founderId: row?.original?.founderDetail?.id,
                  controlType: 'INDIRECT',
                  beneficialOwnerType: 'REGULAR_MANAGEMENT',
                });
              }}
              to={'#'}
            >
              <FontAwesomeIcon className="text-primary" icon={faSquarePlus} />
              Add principal shares' owner
            </Link>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4 relative">
      {createBeneficialOwnerIsLoading && (
        <figure className="absolute top-0 bottom-0 right-0 z-[10000] bg-background h-full w-full flex items-center justify-center bg-opacity-50">
          <Loader className="text-primary" />
        </figure>
      )}
      <menu className="w-full flex items-center gap-3 justify-between">
        <h1 className="font-medium uppercase text-center w-full">
          Existing founders eligible to become beneficial owners
        </h1>
      </menu>
      {founderDetailsWithPercentagesList?.length > 0 ? (
        <Table
          data={founderDetailsWithPercentagesList}
          columns={
            founderDetailsWithPercentagesExtendedColumns as unknown as ColumnDef<{
              founderDetail: FounderDetail;
              shareQuantityPercentage: number;
            }>[]
          }
        />
      ) : (
        <section className="w-full flex flex-col gap-5 my-4">
          <h3 className="text-primary font-medium text-center w-full">
            There are no eligible shareholders. Click below to add beneficial
            owners who control the business via other means.
          </h3>
          <CustomPopover
            trigger={
              <Button
                variant={'outline'}
                className="text-primary font-normal w-[fit] mx-auto"
              >
                <FontAwesomeIcon icon={faSquarePlus} className="mr-2" />
                Add beneficial owner
              </Button>
            }
          >
            <menu className="w-full flex flex-col gap-3">
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-3 rounded-sm hover:bg-gray-100"
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  createBeneficialOwner({
                    businessId: queryParams?.businessId,
                    controlType: 'INDIRECT',
                    beneficialOwnerType: 'SENIOR_MANAGEMENT',
                  });
                }}
              >
                <FontAwesomeIcon className="text-primary" icon={faFlag} />
                Report a senior manager as the beneficial owner
              </Link>
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-3 rounded-sm hover:bg-gray-100"
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  createBeneficialOwner({
                    businessId: queryParams?.businessId,
                    controlType: 'INDIRECT',
                    beneficialOwnerType: 'REGULAR_MANAGEMENT',
                  });
                }}
              >
                <FontAwesomeIcon className="text-primary" icon={faSquarePlus} />
                Add a beneficial owner controlling by other means
              </Link>
            </menu>
          </CustomPopover>
        </section>
      )}
      <FounderDetailsWithSharesDetails />
    </section>
  );
};

export default FounderDetailsWithShares;
