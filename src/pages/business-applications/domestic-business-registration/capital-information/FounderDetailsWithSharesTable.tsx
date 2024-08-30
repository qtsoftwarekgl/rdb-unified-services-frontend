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
import { Link } from 'react-router-dom';
import FounderDetailsWithSharesDetails from './FounderDetailsWithSharesDetails';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import { setSelectedBeneficialOwner } from '@/states/features/beneficialOwnerSlice';
import { Button } from '@/components/ui/button';

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
      (founderDetail) => founderDetail?.shareQuantityPercentage >= 80
    )
  );

  useEffect(() => {
    setFounderDetailsWithPercentagesList(
      founderDetailsList?.filter(
        (founderDetail) => founderDetail?.shareQuantityPercentage >= 80
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
                dispatch(
                  setSelectedBeneficialOwner({
                    controlType: 'DIRECT',
                    beneficialOwnerType: 'REGULAR_MANAGEMENT',
                  })
                );
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
                dispatch(
                  setSelectedBeneficialOwner({
                    controlType: 'INDIRECT',
                    beneficialOwnerType: 'REGULAR_MANAGEMENT',
                  })
                );
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
    <section className="w-full flex flex-col gap-4">
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
                  dispatch(
                    setSelectedBeneficialOwner({
                      controlType: 'INDIRECT',
                      beneficialOwnerType: 'SENIOR_MANAGEMENT',
                    })
                  );
                  setAddNewBeneficialOwner && setAddNewBeneficialOwner(true);
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
                  dispatch(
                    setSelectedBeneficialOwner({
                      controlType: 'INDIRECT',
                      beneficialOwnerType: 'REGULAR_MANAGEMENT',
                      significantInfluence: 'OTHER',
                    })
                  );
                  setAddNewBeneficialOwner && setAddNewBeneficialOwner(true);
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
