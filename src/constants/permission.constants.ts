import { capitalizeString, formatDate } from '@/helpers/strings';
import { Permission } from '@/types/models/permission';
import { Row } from '@tanstack/react-table';

export const permissionColumns = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }: { row: Row<Permission> }) =>
      capitalizeString(row?.original?.name),
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Date Added',
    accessorKey: 'createdAt',
    cell: ({ row }: { row: Row<Permission> }) =>
      formatDate(row?.original?.createdAt),
  },
  {
    header: 'Last Updated',
    accessorKey: 'updatedAt',
    cell: ({ row }: { row: Row<Permission> }) =>
      formatDate(row?.original?.updatedAt),
  },
];
