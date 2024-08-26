import { capitalizeString } from '@/helpers/strings';
import { BusinessAmendment } from '@/types/models/business';
import { Row } from '@tanstack/react-table';
import moment from 'moment';

export const businessAmendmentColumns = [
  {
    header: 'Application Reference',
    accessorKey: 'applicationReferenceId',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      `${row?.original?.business?.applicationReferenceId}`,
  },
  {
    header: 'Application Status',
    accessorKey: 'applicationStatus',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      `${capitalizeString(row?.original?.business?.applicationStatus)}`,
  },
  {
    header: 'Business Name',
    accessorKey: 'companyName',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      `${
        row?.original?.business?.companyName ||
        row?.original?.business?.enterpriseBusinessName ||
        row?.original?.business?.enterpriseName ||
        row?.original?.business?.branchName ||
        ''
      }`,
  },
  {
    header: 'Amendment Type',
    accessorKey: 'amendmentType',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      capitalizeString(row?.original?.amendmentType),
  },
  {
    header: 'Amendment Status',
    accessorKey: 'amdApplicationStatusId',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      capitalizeString(
        row?.original?.amdApplicationStatusId || row?.original?.status
      ),
  },
  {
    header: 'Company Category',
    accessorKey: 'companyCategory',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      `${capitalizeString(row?.original?.business?.companyCategory)}`,
  },
  {
    header: 'Assigned Verifier',
    accessorKey: 'assignedVerifier',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      `${row?.original?.assignedVerifier?.firstName || '-'} ${
        row?.original?.assignedVerifier?.lastName || ''
      }`,
  },
  {
    header: 'Assigned Approver',
    accessorKey: 'assignedApprover',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      `${row?.original?.assignedApprover?.firstName || '-'} ${
        row?.original?.assignedApprover?.lastName || ''
      }`,
  },
  {
    header: 'Date created',
    accessorKey: 'createdAt',
    cell: ({ row }: { row: Row<BusinessAmendment> }) =>
      moment(row?.original?.createdAt).format('YYYY-MM-DD HH:mm'),
  },
];

export const amendmentTypes: string[] = [
  'AMEND_COMPANY_DETAILS',
  'AMEND_COMPANY_ADDRESS',
  'AMEND_BUSINESS_ACTIVITIES',
  'AMEND_SHARE_DETAILS',
  'AMEND_ADD_BUSINESS_FOUNDER',
  'AMEND_DELETE_BUSINESS_FOUNDER',
  'AMEND_ADD_BUSINESS_EXECUTIVE_MEMBER',
  'AMEND_ADD_BUSINESS_BOARD_MEMBER',
  'AMEND_DELETE_BUSINESS_MEMBER',
  'AMEND_BUSINESS_FOUNDER_SHARES',
  'AMEND_BUSINESS_EMPLOYMENT_INFO',
  'AMEND_BUSINESS_ATTACHMENT',
  'AMEND_BUSINESS_PERSON_ATTACHMENT',
  'DELETE_BUSINESS_PERSON_ATTACHMENT',
  'DELETE_BUSINESS_ATTACHMENT',
  'AMEND_BUSINESS_DORMANCY_DECLARATION',
  'AMEND_BUSINESS_DISSOLUTION',
  'AMEND_BUSINESS_RESTORATION',
  'AMEND_BUSINESS_NEW_BRANCH',
  'AMEND_BUSINESS_AMALGAMATION',
  'AMEND_BUSINESS_TRANSFER_OF_REGISTRATION',
  'AMEND_BUSINESS_BENEFICIAL_OWNERSHIP',
  'AMEND_CESSATION_TO_BE_DORMANT',
];

export const amendmentStatuses: string[] = [
  'SUBMITTED',
  'VERIFIED',
  'REJECTED',
  'RESUBMITTED',
  'AMENDMENT_SUBMITTED',
  'ACTIVE',
  'IN_REVIEW',
  'ACTION_REQUIRED',
  'PENDING_APPROVAL',
  'APPROVED'
];
