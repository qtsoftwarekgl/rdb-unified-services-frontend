import { formatNumbers } from '@/helpers/strings';
import { FounderDetail } from '@/types/models/personDetail';
import { Row } from '@tanstack/react-table';

export const founderDetailsWithPercentagesColumns = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({
      row,
    }: {
      row: Row<{
        founderDetail: FounderDetail;
        personDetail: FounderDetail;
      }>;
    }) =>
      `${
        row.original.founderDetail?.personDetail?.firstName ||
        row?.original?.founderDetail?.personDetail?.organization
          ?.organizationName ||
        ''
      } ${row.original.founderDetail?.personDetail?.lastName || ''}`,
  },
  {
    header: 'Share Percentage',
    accessorKey: 'shareQuantityPercentage',
    cell: ({
      row,
    }: {
      row: Row<{
        founderDetail: FounderDetail;
        shareQuantityPercentage: number;
      }>;
    }) => `${formatNumbers(row.original?.shareQuantityPercentage) || ''}%`,
  },
  {
    header: 'Document Number',
    accessorKey: 'personDocNo',
    cell: ({ row }: { row: Row<{ founderDetail: FounderDetail }> }) =>
      `${row.original.founderDetail?.personDetail?.personDocNo || ''}`,
  },
  {
    header: 'Phone number',
    accessorKey: 'phoneNumber',
    cell: ({ row }: { row: Row<{ founderDetail: FounderDetail }> }) =>
      `${row.original.founderDetail?.personDetail?.phoneNumber || ''}`,
  },
];

export const founderDetailColumns = [
  
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Document Number',
    accessorKey: 'personDocNo',
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
];
