import { UUID } from "crypto";

export interface Organization {
  id: UUID;
  organizationName?: string;
  certificateNo?: string;
  issuanceDate?: number;
  issuancePlace?: string;
  phone?: string;
  email?: string;
  countryOfIncorporation?: string;
  dateOfIncorporation?: number;
  approved?: boolean;
  foreign?: boolean;
}
