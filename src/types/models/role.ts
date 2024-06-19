import { UUID } from 'crypto';

export type Role = {
  id: UUID;
  roleName: string;
  description: string;
};
