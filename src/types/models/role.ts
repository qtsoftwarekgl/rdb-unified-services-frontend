import { AbstractDomain } from '.';

export interface Role extends AbstractDomain {
  roleName: string;
  description: string;
  state?: string;
}