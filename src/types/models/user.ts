import { AbstractDomain } from ".";

export type Profile = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  id: string;
  phoneNumber: string;
  personDocNo: string;
};

export interface User extends AbstractDomain {
  fullName?: string;
  firstName: string;
  lastName: string;
  state: string;
  profile: Profile;
  nationality: string;
  personIdentType: string;
  personDocNo: string;
  persDocIssueDate: Date;
  persDocExpiryDate: Date;
  dateOfBirth: Date;
  gender: string;
  persDocIssuePlace: string;
  validFrom: Date;
  validTo: Date;
  isFromNida: boolean;
  phoneNumber: string;
  notificationPreference: string;
  userType: string;
  failedLoginAttempts: number;
  isLocked: boolean;
  email: string;
  roles: string[];
  permissions: string[];
}
