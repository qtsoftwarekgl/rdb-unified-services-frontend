import CustomTooltip from '@/components/inputs/CustomTooltip';
import Table from '@/components/table/Table';
import { beneficialOwnerColumns } from '@/constants/beneficialOwner.constants';
import {
  setBeneficialOwnerDetailsModal,
  setSelectedBeneficialOwner,
} from '@/states/features/beneficialOwnerSlice';
import { AppDispatch } from '@/states/store';
import { BeneficialOwner } from '@/types/models/personDetail';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useDispatch } from 'react-redux';
import BeneficialOwnerDetails from './BeneficialOwnerDetails';

interface BeneficialOwnersTableProps {
  beneficialOwners: BeneficialOwner[];
}

const BeneficialOwnersTable = ({
  beneficialOwners,
}: BeneficialOwnersTableProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // BENEFICIAL OWNERS EXTENDED COLUMNS
  const beneficialOwnersExtendedColumns = [
    ...beneficialOwnerColumns,
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<BeneficialOwner> }) => {
        return (
          <menu className="w-full flex items-center gap-2">
            <CustomTooltip label="Click to view details">
              <FontAwesomeIcon
                className="text-primary cursor-pointer transition-all ease-in-out duration-300 hover:scale-[1.01]"
                icon={faCircleInfo}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedBeneficialOwner(row.original));
                  dispatch(setBeneficialOwnerDetailsModal(true));
                }}
              />
            </CustomTooltip>
          </menu>
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
