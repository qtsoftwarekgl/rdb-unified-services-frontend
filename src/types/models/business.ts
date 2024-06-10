import { UUID } from 'crypto';

export type Business = {
  id: UUID;
  version: number;
  state?: string | number;
  createdAt: Date;
  updatedAt: Date;
  applicationReferenceId: string;
  registrationNo?: string;
  companyId?: string;
  branchId?: string;
  branchName?: string;
  companyName?: string;
  companyType?: string;
  companyCategory: string;
  position: string;
  reservationId?: string;
  isForeign: boolean;
  tin?: string | number;
  validFrom?: string | Date;
  validTo?: string | Date;
  applicationStatus: string;
  certificateNo?: string;
  issuanceDate?: string | Date;
  issuancePlace?: string;
  hasArticlesOfAssociation?: boolean;
  enterpriseName?: string;
  enterpriseBusinessName?: string;
  employmentInfo?: string | object;
  address?: string | object;
};

export type businessId = string | number | (string | number | null)[] | null;
