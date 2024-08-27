import { formatDate } from '@/helpers/strings';
import { Row } from '@tanstack/react-table';
import { ReservedName } from '@/types/models/reservedName';

export const reservedNameColumns = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }: { row: Row<ReservedName> }) =>
      (
        row?.original?.name
      ) || 'N/A',
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ row }: { row: Row<ReservedName> }) =>
      formatDate(row?.original?.createdAt)
  },
  {
    id: 'expiringAt',
    header: 'Expiring At',
    accessorKey: 'expiringAt',
    cell: ({ row }: { row: Row<ReservedName> }) =>
      formatDate(row?.original?.expiryDate)
  }
];


