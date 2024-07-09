import { UUID } from "crypto";

// Define the PersonRole interface
export interface PersonRole {
  id: UUID;
  roleName?: string;
  roleDescription?: string;
}
