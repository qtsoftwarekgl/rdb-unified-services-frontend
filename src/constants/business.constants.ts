import { capitalizeString, formatDate } from "@/helpers/strings";
import { Business } from "@/types/models/business";
import { Row } from "@tanstack/react-table";

export const businessColumns = [
  {
    id: "companyName",
    header: "Company Name",
    accessorKey: "companyName",
    cell: ({ row }: { row: Row<Business> }) =>
      (
        row?.original?.companyName ||
        row?.original?.enterpriseName ||
        row?.original?.branchName
      )?.toUpperCase() || "N/A",
  },
  {
    id: "companyType",
    header: "Company Type",
    accessorKey: "companyType",
    cell: ({ row }: { row: Row<Business> }) =>
      capitalizeString(row.original.companyType),
  },
  {
    id: "dateOfIncorporation",
    header: "Submission Date",
    accessorKey: "dateOfIncorporation",
    cell: ({ row }: { row: Row<Business> }) =>
      formatDate(row?.original?.dateOfIncorporation) ||
      formatDate(row?.original?.createdAt),
  },
];

export const attachmentColumns = [
  {
    header: "File Name",
    accessorKey: "fileName",
  },
  {
    header: "Attachment Type",
    accessorKey: "attachmentType",
  },
  {
    header: "Attachment Size",
    accessorKey: "size",
  },
];

export const beneficialOwnerControlMeans = [
  "CLOSE_FAMILY_RELATIONSHIP",
  "CONNECTION_TO_PERSON_THAT_POSSESS_OWNERSHIP",
  "CONTRACTUAL_ASSOCIATION",
  "ENJOYS_OR_BENEFITS_FROM_THE_ASSETS_OF_THE_ORGANIZATIONS",
  "PARTICIPATES_IN_FINANCING_OF_THE_ORGANIZATIONS",
  "RESPONSIBLE_FOR_KEY_MANAGEMENT_DECISIONS",
  "RIGHT_TO_APPOINT_MAJORITY_OF_DIRECTORS",
  "OTHERS",
];

export const beneficialOwnerControlType = ["DIRECT", "INDIRECT"];

export const beneficialOwnerTypes = ["REGULAR_MANAGEMENT", "SENIOR_MANAGEMENT"];
