import {
  capitalizeString,
  formatDate,
} from '@/helpers/strings';
import { Role } from '@/types/models/role';
import { Row } from '@tanstack/react-table';

export const roleColumns = [
  {
    header: 'Role Name',
    accessorKey: 'roleName',
    cell: ({ row }: { row: Row<Role> }) =>
      capitalizeString(row?.original?.roleName),
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Date added',
    accessorKey: 'createdAt',
    cell: ({ row }: { row: Row<Role> }) => formatDate(row?.original?.createdAt),
  },
  {
    header: 'Last updated',
    accessorKey: 'updatedAt',
    cell: ({ row }: { row: Row<Role> }) => formatDate(row?.original?.updatedAt),
  },
];
