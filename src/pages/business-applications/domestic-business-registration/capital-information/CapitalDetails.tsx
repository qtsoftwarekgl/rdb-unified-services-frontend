import { FC, useEffect } from 'react';
import { AppDispatch, RootState } from '../../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  faCircleInfo,
  faEllipsisVertical,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from '../../../../states/features/businessRegistrationSlice';
import CapitalDetailsModal from './AssignShareDetails';
import Button from '../../../../components/inputs/Button';
import Loader from '../../../../components/Loader';
import { useForm } from 'react-hook-form';
import { businessId } from '@/types/models/business';
import {
  useLazyFetchShareDetailsQuery,
  useLazyFetchShareholdersQuery,
} from '@/states/api/businessRegApiSlice';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  setAssignSharesModal,
  setDeleteFounderModal,
  setFounderDetailsList,
  setSelectedFounderDetail,
} from '@/states/features/founderDetailSlice';
import { setShareDetailsList } from '@/states/features/shareDetailSlice';
import Table from '@/components/table/Table';
import { FounderDetail } from '@/types/models/personDetail';
import { capitalizeString } from '@/helpers/strings';
import { ColumnDef, Row } from '@tanstack/react-table';
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from '@/states/features/navigationFlowSlice';
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from '@/helpers/business.helpers';
import CustomPopover from '@/components/inputs/CustomPopover';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import DeleteBusinessFounder from './DeleteBusinessFounder';

interface CapitalDetailsProps {
  businessId: businessId;
  applicationStatus: string;
}

const CapitalDetails: FC<CapitalDetailsProps> = ({
  businessId,
  applicationStatus,
}) => {
  // REACT HOOK FORM
  const {
    clearErrors,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { shareDetailsList } = useSelector(
    (state: RootState) => state.shareDetail
  );
  const { founderDetailsList } = useSelector(
    (state: RootState) => state.founderDetail
  );
  const disableForm = ['IN_REVIEW', 'APPROVED'].includes(applicationStatus);
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // INITIALIZE FETCH FOUNDER DETAILS QUERY
  const [
    fetchShareholders,
    {
      data: shareholdersData,
      isLoading: shareholdersIsLoading,
      error: shareholdersError,
      isError: shareholdersIsError,
      isSuccess: shareholdersIsSuccess,
    },
  ] = useLazyFetchShareholdersQuery();

  // INITIALIZE FETCH SHARE DETAILS QUERY
  const [
    fetchShareDetails,
    {
      data: shareDetailsData,
      isLoading: shareDetailsIsLoading,
      error: shareDetailsError,
      isError: shareDetailsIsError,
      isSuccess: shareDetailsIsSuccess,
    },
  ] = useLazyFetchShareDetailsQuery();

  // GET BUSINESS SHARE DETAILS
  useEffect(() => {
    fetchShareDetails({ businessId });
  }, [businessId, fetchShareDetails]);

  // FETCH SHAREHOLDERS
  useEffect(() => {
    fetchShareholders({ businessId });
  }, [businessId, fetchShareholders]);

  // HANDLE FETCH SHAREHOLDERS RESPONSE
  useEffect(() => {
    if (shareholdersIsError) {
      if ((shareholdersError as ErrorResponse).status === 500) {
        toast.error('An error occurred while fetching shareholders');
      } else {
        toast.error(
          (shareholdersError as ErrorResponse).data?.message ??
            'An error occurred while fetching shareholders'
        );
      }
    } else if (shareholdersIsSuccess) {
      dispatch(setFounderDetailsList(shareholdersData?.data));
    }
  }, [
    dispatch,
    shareholdersData,
    shareholdersError,
    shareholdersIsError,
    shareholdersIsSuccess,
  ]);

  // HANDLE FETCH SHARE DETAILS RESPONSE
  useEffect(() => {
    if (shareDetailsIsError) {
      if ((shareDetailsError as ErrorResponse).status === 500) {
        toast.error('An error occurred while fetching share details');
      } else {
        toast.error(
          (shareDetailsError as ErrorResponse).data?.message ??
            'An error occurred while fetching share details'
        );
      }
    } else if (shareDetailsIsSuccess) {
      dispatch(setShareDetailsList(shareDetailsData?.data));
    }
  }, [
    dispatch,
    shareDetailsData?.data,
    shareDetailsError,
    shareDetailsIsError,
    shareDetailsIsSuccess,
  ]);

  // TABLE COLUMNS
  const founderDetailsColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Type',
      accessorKey: 'shareHolderType',
    },
    {
      header: 'Number of shares',
      accessorKey: 'shareQuantity',
    },
    {
      header: 'Total value',
      accessorKey: 'totalQuantity',
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<FounderDetail> }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="flex items-center gap-3">
                <CustomTooltip label="Click to view options">
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    className="text-primary cursor-pointer"
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <menu className="flex flex-col items-start gap-2">
              <Link
                to={'#'}
                className="flex items-center gap-2 text-[13px] hover:bg-slate-50 w-full rounded-md p-1 py-2"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setAssignSharesModal(true));
                  dispatch(setSelectedFounderDetail(row?.original));
                }}
              >
                <FontAwesomeIcon
                  className={`cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]`}
                  icon={disableForm ? faCircleInfo : faPenToSquare}
                />
                Assign shares
              </Link>
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedFounderDetail(row?.original));
                  dispatch(setDeleteFounderModal(true));
                }}
                className="flex items-center gap-2 text-[13px] hover:bg-slate-50 w-full rounded-md p-1 py-2"
              >
                <FontAwesomeIcon
                  className={`${
                    disableForm
                      ? 'text-secondary cursor-default'
                      : 'text-red-600 cursor-pointer'
                  } font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]`}
                  icon={faTrash}
                  onClick={(e) => {
                    e.preventDefault();
                    if (disableForm) return;
                    clearErrors('total_shares');
                  }}
                />
                Delete
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <section className="flex flex-col w-full gap-6">
      {shareholdersIsLoading && (
        <figure className="min-h-[40vh] flex items-center w-full justify-center">
          <Loader />
        </figure>
      )}
      <CapitalDetailsModal
        applicationStatus={applicationStatus}
        businessId={businessId}
      />
      <section className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg uppercase text-[16px]">
          Overall capital details
        </h1>
        <Table
          showFilter={false}
          showPagination={false}
          data={founderDetailsList?.map(
            (founder: FounderDetail, index: number) => {
              return {
                ...founder,
                no: index + 1,
                name: `${
                  founder?.personDetail?.firstName ||
                  founder?.personDetail?.organization?.organizationName ||
                  ''
                } ${founder?.personDetail?.middleName || ''} ${
                  founder?.personDetail?.lastName || ''
                }`,
                shareHolderType: capitalizeString(founder?.shareHolderType),
              };
            }
          )}
          columns={
            founderDetailsColumns as unknown as ColumnDef<FounderDetail>[]
          }
        />
        {shareDetailsIsLoading || shareDetailsIsLoading ? (
          <figure className="min-h-[40vh] flex items-center w-full justify-center">
            <Loader />
          </figure>
        ) : (
          <>
            {' '}
            <menu className="flex flex-col w-full gap-1">
              <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
                <h2>Total number of shares</h2>
                <p>
                  {shareDetailsList?.reduce(
                    (acc, curr) => acc + Number(curr?.shareQuantity),
                    0
                  )}
                </p>
              </ul>
              <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
                <h2>Total number of issued shares</h2>
                <p>
                  {founderDetailsList?.reduce(
                    (acc, curr) => acc + Number(curr?.shareQuantity),
                    0
                  )}
                </p>
              </ul>
              <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
                <h2>Unissued shares</h2>
                <p>
                  {shareDetailsList?.reduce(
                    (acc, curr) => acc + Number(curr?.remainingShares),
                    0
                  )}
                </p>
              </ul>
            </menu>
            <menu className="flex flex-col w-full gap-2">
              <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
                <h2>Total value of shares</h2>
                <p>
                  RWF{' '}
                  {shareDetailsList?.reduce(
                    (acc, curr) => acc + Number(curr?.totalAmount),
                    0
                  )}
                </p>
              </ul>
              <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
                <h2>Value of issued shares</h2>
                <p>
                  RWF{' '}
                  {founderDetailsList?.reduce(
                    (acc, curr) => acc + Number(curr?.totalQuantity),
                    0
                  )}
                </p>
              </ul>
              <ul className="w-full py-2 text-[14px] rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
                <h2 className="font-medium underline uppercase">
                  Remaning value of unissued shares
                </h2>
                <p className="underline">
                  RWF{' '}
                  {shareDetailsList?.reduce(
                    (acc, curr) => acc + Number(curr?.totalAmount),
                    0
                  ) -
                    founderDetailsList?.reduce(
                      (acc, curr) => acc + Number(curr?.totalQuantity),
                      0
                    )}
                </p>
              </ul>
            </menu>
          </>
        )}
      </section>
      {['IN_PROGRESS', 'IS_AMENDING', 'IN_PREVIEW', 'ACTION_REQUIRED'].includes(
        applicationStatus
      ) && (
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            disabled={disableForm}
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                createNavigationFlowThunk({
                  businessId,
                  massId: findNavigationFlowMassIdByStepName(
                    navigationFlowMassList,
                    'Shareholders'
                  ),
                  isActive: true,
                })
              );
            }}
          />
          {applicationStatus === 'IS_AMENDING' && (
            <Button
              disabled={disableForm || Object.keys(errors).length > 0}
              value={'Complete Amendment'}
            />
          )}
          {['IN_PREVIEW', 'ACTION_REQUIRED'].includes(applicationStatus) && (
            <Button
              value={'Save & Complete Review'}
              primary
              disabled={disableForm || Object.keys(errors).length > 0}
            />
          )}
          <Button
            value={'Save & Continue'}
            primary
            disabled={disableForm || Object.keys(errors).length > 0}
            onClick={(e) => {
              e.preventDefault();
              // CHECK FOR AN UNASSIGNED FOUNDER
              const unassignedFounder = founderDetailsList?.find(
                (founder) => !founder?.shareQuantity
              );

              if (unassignedFounder) {
                toast.error(
                  'Please assign shares to all shareholders before proceeding',
                  {
                    autoClose: 5000,
                  }
                );
                return;
              }
              dispatch(
                completeNavigationFlowThunk({
                  isCompleted: true,
                  navigationFlowId: findNavigationFlowByStepName(
                    businessNavigationFlowsList,
                    'Capital Details'
                  )?.id,
                })
              );
              dispatch(
                createNavigationFlowThunk({
                  businessId,
                  massId: findNavigationFlowMassIdByStepName(
                    navigationFlowMassList,
                    'Executive Management'
                  ),
                  isActive: true,
                })
              );
            }}
          />
        </menu>
      )}
      {[
        'IN_REVIEW',
        'APPROVED',
        'PENDING_APPROVAL',
        'PENDING_REJECTION',
      ].includes(applicationStatus) && (
        <menu className="flex items-center justify-between gap-3">
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setBusinessActiveStep('shareholders'));
            }}
          />
          <Button
            value="Next"
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setBusinessActiveStep('attachments'));
              dispatch(setBusinessActiveTab('attachments'));
            }}
          />
        </menu>
      )}
      <DeleteBusinessFounder />
    </section>
  );
};

export default CapitalDetails;
