import { capitalizeString, formatDate } from '@/helpers/strings';
import { BeneficialOwner } from '@/types/models/personDetail';
import { Row } from '@tanstack/react-table';

export const beneficialOwnerColumns = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }: { row: Row<BeneficialOwner> }) =>
      `${row.original.personDetail?.firstName || ''} ${
        row.original.personDetail?.lastName || ''
      }`,
  },
  {
    header: 'Type',
    accessorKey: 'beneficialOwnerType',
    cell: ({ row }: { row: Row<BeneficialOwner> }) =>
      `${capitalizeString(row?.original?.beneficialOwnerType)}`,
  },
  {
    header: 'Date of registration',
    accessorKey: 'registeredDate',
    cell: ({ row }: { row: Row<BeneficialOwner> }) =>
      `${formatDate(row.original.registeredDate)}`,
  },
  {
    header: 'TIN',
    accessorKey: 'tinNumber',
  },
  {
    header: 'Ownership %',
    accessorKey: 'extentOfShare',
    cell: ({ row }: { row: Row<BeneficialOwner> }) =>
      `${row.original.extentOfShare || '-'}`,
  },
  {
    header: 'Control type',
    accessorKey: 'controlType',
    cell: ({ row }: { row: Row<BeneficialOwner> }) =>
      `${capitalizeString(row?.original?.controlType)}`,
  },
  {
    header: 'Significant Influence',
    accessorKey: 'significantInfluence',
    cell: ({ row }: { row: Row<BeneficialOwner> }) =>
      `${capitalizeString(row?.original?.significantInfluence)}`,
  },
];
