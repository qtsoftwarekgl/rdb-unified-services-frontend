import { capitalizeString, formatDate } from '@/helpers/strings';
import { Business } from '@/types/models/business';
import { Row } from '@tanstack/react-table';

export const businessColumns = [
  {
    id: 'companyName',
    header: 'Company Name',
    accessorKey: 'companyName',
    cell: ({ row }: { row: Row<Business> }) =>
      (
        row?.original?.companyName ||
        row?.original?.enterpriseName ||
        row?.original?.branchName
      )?.toUpperCase() || 'N/A',
  },
  {
    id: 'companyType',
    header: 'Company Type',
    accessorKey: 'companyType',
    cell: ({ row }: { row: Row<Business> }) =>
      capitalizeString(row.original.companyType),
  },
  {
    id: 'dateOfIncorporation',
    header: 'Date of Incorporation',
    accessorKey: 'dateOfIncorporation',
    cell: ({ row }: { row: Row<Business> }) =>
      formatDate(row?.original?.dateOfIncorporation) ||
      formatDate(row?.original?.createdAt),
  },
  {
    id: 'applicationStatus',
    header: 'Status',
    accessorKey: 'applicationStatus',
    cell: ({ row }: { row: Row<Business> }) =>
      capitalizeString(row?.original?.applicationStatus),
  },
  {
    id: 'assignee',
    header: 'Assigned To',
    accessorKey: 'assignee',
  },
];

export const attachmentColumns = [
  {
    header: 'File Name',
    accessorKey: 'fileName',
  },
  {
    header: 'Attachment Type',
    accessorKey: 'attachmentType',
  },
  {
    header: 'Attachment Size',
    accessorKey: 'size',
  },
];
