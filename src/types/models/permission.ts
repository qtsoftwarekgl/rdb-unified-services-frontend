import { AbstractDomain } from '.';

export interface Permission extends AbstractDomain {
  name: string;
  description?: string;
}
