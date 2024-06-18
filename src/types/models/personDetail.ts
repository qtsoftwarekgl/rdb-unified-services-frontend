import { UUID } from "crypto";

export type PersonDetail = {
  id: UUID;
  position?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  personIdentType?: string;
  personDocNo?: string;
  persDocIssueDate?: string;
  persDocExpiryDate?: string;
  persDocIssuePlace?: string;
  validFrom?: string;
  validTo?: string;
  isFromNida?: boolean;
  streetNumber?: string;
  phoneNumber?: string;
  email?: string;
  fax?: string;
  poBox?: string;
  roleDescription?: string;
};

export interface FounderDetail extends PersonDetail {
  shareHolderType?: string;
  companyName?: string;
  shareQuantity?: number;
  totalQuantity?: number;
}
