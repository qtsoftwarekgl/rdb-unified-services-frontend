import CustomTooltip from '@/components/inputs/CustomTooltip';
import Table from '@/components/table/Table';
import { beneficialOwnerColumns } from '@/constants/beneficialOwner.constants';
import {
  setBeneficialOwnerDetailsModal,
  setSelectedBeneficialOwner,
} from '@/states/features/beneficialOwnerSlice';
import { AppDispatch } from '@/states/store';
import { BeneficialOwner } from '@/types/models/personDetail';
import { faEllipsisH, faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useDispatch } from 'react-redux';
import BeneficialOwnerDetails from './BeneficialOwnerDetails';
import CustomPopover from '@/components/inputs/CustomPopover';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyBeneficialOwnerCompletion } from '@/helpers/business.helpers';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

interface BeneficialOwnersTableProps {
  beneficialOwners: BeneficialOwner[];
}

const BeneficialOwnersTable = ({
  beneficialOwners,
}: BeneficialOwnersTableProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // NAVIGATION
  const [searchParams, setSearchParams] = useSearchParams();

  // BENEFICIAL OWNERS EXTENDED COLUMNS
  const beneficialOwnersExtendedColumns = [
    ...beneficialOwnerColumns,
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<BeneficialOwner> }) => {
        return (
          <CustomTooltip label="Click to view details">
            <CustomPopover
              trigger={
                <FontAwesomeIcon
                  className="text-primary bg-slate-200 hover:bg-slate-300 p-1 px-[9px] rounded-md cursor-pointer"
                  icon={faEllipsisH}
                />
              }
            >
              <menu className="w-full flex flex-col gap-1">
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setSelectedBeneficialOwner(row.original));
                    dispatch(setBeneficialOwnerDetailsModal(true));
                  }}
                  to={'#'}
                  className="flex items-center gap-2 text-[13px] hover:bg-background cursor-pointer p-1 rounded-md"
                >
                  <FontAwesomeIcon
                    className="px-[9px] p-[5px] text-[12px] flex items-center justify-center rounded-full bg-primary text-white"
                    icon={faInfo}
                  />
                  View details
                </Link>
                {!verifyBeneficialOwnerCompletion(row?.original) && (
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchParams({
                        ...searchParams,
                        businessId: row?.original.business?.id,
                        beneficialOwnerId: row?.original.id,
                      });
                    }}
                    to={'#'}
                    className="flex items-center gap-2 text-[13px] hover:bg-background cursor-pointer p-1 rounded-md"
                  >
                    <FontAwesomeIcon
                      className="p-[6px] text-[12px] flex items-center justify-center rounded-full bg-primary text-white"
                      icon={faPenToSquare}
                    />
                    Complete registration
                  </Link>
                )}
              </menu>
            </CustomPopover>
          </CustomTooltip>
        );
      },
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      <h1 className="text-primary uppercase font-semibold text-lg">
        Existing beneficial owners
      </h1>
      <Table
        data={beneficialOwners}
        columns={
          beneficialOwnersExtendedColumns as ColumnDef<BeneficialOwner>[]
        }
      />
      <BeneficialOwnerDetails />
    </section>
  );
};

export default BeneficialOwnersTable;
