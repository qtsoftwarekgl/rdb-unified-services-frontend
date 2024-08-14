import CustomPopover from '@/components/inputs/CustomPopover';
import Table from '@/components/table/Table';
import { founderDetailsWithPercentagesColumns } from '@/constants/founders.constants';
import {
  setFounderWithSharesDetailsModal,
  setSelectedFounderDetailWithShares,
} from '@/states/features/founderDetailSlice';
import { AppDispatch } from '@/states/store';
import { FounderDetail } from '@/types/models/personDetail';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleInfo,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import FounderDetailsWithSharesDetails from './FounderDetailsWithSharesDetails';

interface FounderDetailsWithPercentagesProps {
  founderDetailsList: {
    founderDetail: FounderDetail;
    shareQuantityPercentage: number;
  }[];
}

const FounderDetailsWithShares = ({
  founderDetailsList,
}: FounderDetailsWithPercentagesProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [
    founderDetailsWithPercentagesList,
    setFounderDetailsWithPercentagesList,
  ] = useState(
    founderDetailsList?.filter(
      (founderDetail) => founderDetail?.shareQuantityPercentage >= 10
    )
  );

  useEffect(() => {
    setFounderDetailsWithPercentagesList(
      founderDetailsList?.filter(
        (founderDetail) => founderDetail?.shareQuantityPercentage >= 10
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
                <FontAwesomeIcon
                  className="text-primary"
                  icon={faEllipsisVertical}
                />
              </menu>
            }
          >
            <Link
              className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
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
              className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedFounderDetailWithShares(row?.original));
              }}
              to={'#'}
            >
              <FontAwesomeIcon className="text-primary" icon={faFlag} /> Report
              as beneficial owner
            </Link>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      <h1 className="font-medium text-center uppercase">
        Existing founders eligible to become beneficial owners
      </h1>
      {founderDetailsWithPercentagesList?.length > 0 && (
        <Table
          data={founderDetailsWithPercentagesList}
          columns={
            founderDetailsWithPercentagesExtendedColumns as unknown as ColumnDef<{
              founderDetail: FounderDetail;
              shareQuantityPercentage: number;
            }>[]
          }
        />
      )}
      <FounderDetailsWithSharesDetails />
    </section>
  );
};

export default FounderDetailsWithShares;
