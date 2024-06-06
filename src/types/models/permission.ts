import { UUID } from 'crypto';

export type Permission = {
  id: UUID;
  name: string;
  description: string;
};
