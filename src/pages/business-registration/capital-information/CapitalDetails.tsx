import { FC, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '../../../components/table/Table';
import { capitalizeString } from '../../../helpers/Strings';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setCapitalDetails,
  setCapitalDetailsModal,
  setShareHolders,
} from '../../../states/features/businessRegistrationSlice';
import CapitalDetailsModal from './CapitalDetailsModal';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';
import { useForm } from 'react-hook-form';

export interface business_capital_details {
  no: number;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  shareholder_type?: string;
  shares: {
    total_shares?: number;
    total_value?: number;
  };
}

interface CapitalDetailsProps {
  isOpen: boolean;
  capital_details: business_capital_details[];
}

const CapitalDetails: FC<CapitalDetailsProps> = ({ isOpen, capital_details }) => {

  // REACT HOOK FORM
  const {
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shareholderShareDetails, setShareholderShareDetails] = useState(null);
  const { share_details, shareholders } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const [assignedShares, setAssignedShares] = useState<object>({
    number: 0,
    value: 0,
  });

  useEffect(() => {
    setAssignedShares({
      ...assignedShares,
      number: capital_details
        ?.filter(
          (shareholder) => shareholder?.shares?.total_shares !== undefined
        )
        ?.reduce(
          (acc, curr) => Number(acc) + Number(curr?.shares?.total_shares),
          0
        ),
      value: capital_details
        ?.filter(
          (shareholder) => shareholder?.shares?.total_value !== undefined
        )
        ?.reduce(
          (acc, curr) => Number(acc) + Number(curr?.shares?.total_value),
          0
        ),
    });
  }, [capital_details]);


  // TABLE COLUMNS
  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Number of shares',
      accessorKey: 'total_shares',
    },
    {
      header: 'Total value',
      accessorKey: 'total_value',
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
                setShareholderShareDetails(row?.original);
                dispatch(setCapitalDetailsModal(true));
              }}
            />
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setCapitalDetails(
                    capital_details?.filter(
                      (capital) => capital?.no !== row?.original?.no
                    )
                  )
                );
                dispatch(
                  setShareHolders(
                    shareholders?.filter(
                      (_, index: number) => index !== row?.original?.no
                    )
                  )
                );
              }}
            />
          </menu>
        );
      },
    },
  ];

  // SET CAPITAL DETAILS
  useEffect(() => {
    if (
      capital_details?.length <= 0 ||
      shareholders?.length > capital_details?.length
    ) {
      dispatch(
        setCapitalDetails(
          shareholders?.map((shareholder, index) => {
            return {
              ...shareholder,
              no: index,
              shares: {
                total_shares: 0,
              }
            };
          })
        )
      );
    }
  }, [dispatch, shareholders]);

  if (!isOpen) return null;

  return (
    <section className="w-full flex flex-col gap-6">
      <menu className="flex flex-col gap-2 w-full">
        <Table
          tableTitle="Shareholders"
          data={
            capital_details?.length > 0
              ? capital_details?.map((shareholder: unknown, index: number) => {
                  return {
                    ...shareholder,
                    no: index,
                    name: shareholder?.first_name
                      ? `${shareholder?.first_name || ''} ${
                          shareholder?.last_name || ''
                        }`
                      : shareholder?.company_name,
                    type: capitalizeString(shareholder?.shareholder_type),
                    total_shares: shareholder?.shares?.total_shares || 0,
                    total_value: `RWF ${shareholder?.shares?.total_value || 0}`,
                  };
                })
              : []
          }
          columns={columns}
          showFilter={false}
          showPagination={false}
        />
        {errors?.total_shares && (
          <p className="text-red-500 text-[13px] text-center">
            {String(errors?.total_shares?.message)}
          </p>
        )}
      </menu>
      <CapitalDetailsModal shareholder={shareholderShareDetails} />
      <section className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg uppercase text-[16px]">
          Overall capital details
        </h1>
        <menu className="flex flex-col gap-1 w-full">
          <ul className="w-full py-2 rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Total number of assignable shares</h2>
            <p>{share_details?.total_shares}</p>
          </ul>
          <ul className="w-full py-2 rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Total number of assigned shares</h2>
            <p>{assignedShares?.number}</p>
          </ul>
          <ul className="w-full py-2 rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Remaining number of assignable shares</h2>
            <p>
              {Number(share_details?.total_shares) -
                Number(assignedShares?.number)}
            </p>
          </ul>
        </menu>
        <menu className="flex flex-col gap-2 w-full">
          <ul className="w-full py-2 rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Value of assigned shares</h2>
            <p>RWF {assignedShares?.value}</p>
          </ul>
          <ul className="w-full py-2 rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Value of assignable shares</h2>
            <p>RWF {share_details?.total_value}</p>
          </ul>
        </menu>
      </section>
      <menu
        className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
      >
        <Button
          value="Back"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setBusinessActiveStep('shareholders'));
            dispatch(setBusinessActiveTab('capital_information'));
          }}
        />
        <Button
          value={isLoading ? <Loader /> : 'Continue'}
          primary
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              // CHECK FOR SHAREHOLDERS WITH 0 SHARES
              if (
                capital_details?.filter(
                  (shareholder) => shareholder?.shares?.total_shares === 0
                )?.length > 0
              ) {
                setError('total_shares', {
                  type: 'manual',
                  message:
                    'Some shareholders have 0 shares assigned. Update their shares or remove them from the list to continue.',
                });
                return;
              } else {
                clearErrors('total_shares');
                dispatch(setBusinessCompletedStep('capital_details'));
                dispatch(setBusinessActiveStep('beneficial_owners'));
                dispatch(setBusinessActiveTab('beneficial_owners'));
              }
            }, 1000);
          }}
        />
      </menu>
    </section>
  );
};

export default CapitalDetails;
