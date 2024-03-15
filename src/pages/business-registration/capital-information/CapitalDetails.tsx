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
  setShareHolders,
} from '../../../states/features/businessRegistrationSlice';
import CapitalDetailsModal from './CapitalDetailsModal';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';

interface CapitalDetailsProps {
  isOpen: boolean;
}

const CapitalDetails: FC<CapitalDetailsProps> = ({ isOpen }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openShareDetails, setOpenShareDetails] = useState<boolean>(false);
  const [shareholderShareDetails, setShareholderShareDetails] = useState(null);
  const { share_details, shareholders, capital_details } = useSelector(
    (state: RootState) => state.businessRegistration
  );

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
                setOpenShareDetails(true);
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
                      (shareholder, index: number) =>
                        index !== row?.original?.no
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
            };
          })
        )
      );
    }
  }, [dispatch, shareholders]);

  if (!isOpen) return null;

  return (
    <section className="w-full flex flex-col gap-6">
      <Table
        tableTitle="Shareholders"
        data={capital_details?.map((shareholder: unknown, index) => {
          return {
            ...shareholder,
            no: index,
            name: shareholder?.first_name
              ? `${shareholder?.first_name} ${shareholder?.last_name}`
              : shareholder?.company_name,
            type: capitalizeString(shareholder?.shareholder_type),
            total_shares: shareholder?.shares?.total_shares || 0,
            total_value: `RWF ${shareholder?.shares?.total_value || 0}`,
          };
        })}
        columns={columns}
        showFilter={false}
        showPagination={false}
      />
      <CapitalDetailsModal
        isOpen={openShareDetails}
        onClose={() => setOpenShareDetails(false)}
        shareholder={shareholderShareDetails}
      />
      <section className="flex flex-col gap-4">
        <h1 className="font-semibold text-lg uppercase text-[16px]">
          Overall capital details
        </h1>
        <menu className="flex flex-col gap-2 w-full">
          <ul className="w-full py-2 rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Total number of company shares</h2>
            <p>{share_details?.total_shares}</p>
          </ul>
          <ul className="w-full py-2 rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Total share capital of the company</h2>
            <p>{share_details?.company_capital}</p>
          </ul>
          <ul className="w-full py-2 rounded-md hover:shadow-sm flex items-center gap-3 justify-between">
            <h2>Total remaining shares</h2>
            <p>
              {String(
                Number(share_details?.total_shares) -
                  capital_details.reduce(
                    (acc, curr) =>
                      Number(acc) + Number(curr?.shares?.total_shares),
                    0
                  ),
                0
              )}
            </p>
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
              dispatch(setBusinessCompletedStep('capital_details'));
              dispatch(setBusinessActiveStep('beneficial_owners'));
              dispatch(setBusinessActiveTab('beneficial_owners'));
            }, 1000);
          }}
        />
      </menu>
    </section>
  );
};

export default CapitalDetails;
