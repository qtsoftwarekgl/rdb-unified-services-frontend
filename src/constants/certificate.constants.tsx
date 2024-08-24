import { capitalizeString, formatDate } from '@/helpers/strings';
import { Certificate } from '@/types/models/certificate';
import { Row } from '@tanstack/react-table';
import { access } from 'fs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export const certificateColumns = [
  {
    id: 'serialNumber',
    header: 'Serial Number',
    accessorKey: 'serialNumber',
    cell: ({ row }: { row: Row<Certificate> }) =>
      (
        row?.original?.serialNumber
      ) || 'N/A',
  },
  {
    id: 'certificateType',
    header: 'Certificate Type',
    accessorKey: 'certificateType',
    cell: ({ row }: { row: Row<Certificate> }) =>
      row.original.businessCertificateType?.split('_').join(' ') || 'N/A',
  },

  {
    id: 'createdDate',
    header: 'Created Date',
    accessorKey: 'createdDate',
    cell: ({ row }: { row: Row<Certificate> }) =>
      formatDate(row?.original?.createdAt)
  },
  {
    id: 'status',
    header: 'Certificate Status',
    accessorKey: 'certificateStatus',
    cell: ({ row }: { row: Row<Certificate> }) =>
      capitalizeString(row?.original?.status),
  },
  {
    id: 'download',
    header: 'Download',
    accessorKey: 'download',
    cell: ({ row }: { row: Row<Certificate> }) => (
      <FontAwesomeIcon 
      icon={faDownload} 
      className="text-primary hover:text-secondary transition-colors duration-300 cursor-pointer" 
    />
    ),
  },
];


