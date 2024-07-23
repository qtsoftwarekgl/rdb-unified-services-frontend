import { UUID } from "crypto";

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
  address?: Address;
  dateOfIncorporation?: Date;
  service: Service
};

export type Details = {
  id: UUID;
  branchName?: string;
  companyName: string;
  enterpriseName?: string;
  companyType: string;
  companyCategory: string;
  applicationReferenceId: string;
  position: string;
  hasArticlesOfAssociation: boolean;
  createdAt: Date;
  updatedAt: Date;
  applicationStatus: string;
  enterpriseBusinessName?: string;
};

export type Address = {
  id: UUID;
  countryOfIncorporation?: string;
  streetName?: string;
  city?: string;
  zipCode?: string;
  email: string;
  phoneNumber: string;
  location: {
    country?: string;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
};

export type EmploymentInfo = {
  workingStartTime: string;
  workingEndTime: string;
  numberOfEmployees: number;
  hiringDate: string;
  employmentDeclarationDate: string;
  financialYearStartDate: string;
  financialYearEndDate: string;
};

export type businessId = string | number | (string | number | null)[] | null;

export type BusinessActivity = {
  code: number;
  description: string;
};

export type Service = {
  id: UUID;
  name: string;
  path?: string
}
