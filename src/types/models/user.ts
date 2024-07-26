import { AbstractDomain } from '.';

export interface User extends AbstractDomain {
  fullName?: string;
  state: string,
  firstName: string;
  lastName: string;
  username: string;
  email: string;
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
  roles: string[];
  permissions: string[];
}
