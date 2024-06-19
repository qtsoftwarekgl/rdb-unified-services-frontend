import { UUID } from 'crypto';
import { Role } from './role';

export type User = {
  id: UUID;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  nationalId: string;
  phoneNumber?: string;
  password?: string;
  failedLoginAttempts: number;
  isLocked: boolean;
  roles: Role[];
};
