import { UUID } from 'crypto';
import { Organization } from './organization';
import { PersonRole } from './personRole';
import { ShareDetail } from './shareDetail';
import { Business } from './business';

export interface PersonDetail {
  id: UUID;
  version?: number;
  state?: string;
  createdAt?: number;
  updatedAt?: number; 
  personId?: UUID;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  maritalStatus?: string;
  dateOfBirth?: number;
  gender?: string;
  nationality?: string;
  personIdentType?: string;
  personDocNo?: string;
  persDocIssueDate?: number;
  persDocExpiryDate?: number;
  persDocIssuePlace?: string;
  validFrom?: number;
  validTo?: number;
  isFromNida?: boolean;
  streetNumber?: string;
  phoneNumber?: string;
  email?: string;
  fax?: string;
  poBox?: string;
  personRole?: PersonRole;
  roleDescription?: string;
  organization: Organization;
  villageId?: number;
}

export type FounderDetail = {
  id: UUID;
  version?: number;
  state?: string;
  createdAt?: number;
  updatedAt?: number;
  applicationReferenceId?: UUID;
  description?: string;
  shareQuantity?: number;
  totalQuantity?: number;
  shareHolderType?: string;
  verificationCode?: string;
  verificationCodeExpiration?: number;
  verified?: boolean;
  personDetail?: PersonDetail;
  organization: Organization;
  founderShareDetails?: ShareDetail[];
};

export interface BeneficialOwner extends PersonDetail {
  proCountry?: string;
  proVillageId?: number;
  proStreetNumber?: string;
  proPoBox?: string;
  proEmail?: string;
  proPhoneNumber?: string;
  proFax?: string;
  occupation?: string;
  tinNumber?: number;
  registeredDate?: Date;
  extentOfShare?: number;
  extentOfVoting?: number;
  significantInfluence?: string;
  controlType?: string;
  otherControlMeansDesc?: string;

  beneficialOwnerType?: string;
  seniorManagementPosition?: string;
  personDetail?: PersonDetail;
  business: Business;
}
