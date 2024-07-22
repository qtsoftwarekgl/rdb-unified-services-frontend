import { capitalizeString } from '@/helpers/strings';
import { Business } from '@/types/models/business';
import { Row } from '@tanstack/react-table';

export const businessColumns = [
  {
    id: 'companyName',
    header: 'Company Name',
    accessorKey: 'companyName',
  },
  {
    id: 'companyType',
    header: 'Company Type',
    accessorKey: 'companyType',
  },
  {
    id: 'dateOfIncorporation',
    header: 'Date of Incorporation',
    accessorKey: 'dateOfIncorporation',
  },
  {
    id: 'applicationStatus',
    header: 'Status',
    accessorKey: 'applicationStatus',
    cell: ({ row }: { row: Row<Business> }) =>
      capitalizeString(row.original.applicationStatus),
  },
  {
    id: 'assignee',
    header: 'Assigned To',
    accessorKey: 'assignee',
  },
];
