import { AbstractDomain } from '.';
import { User } from './user';
import { NavigationFlow } from './navigationFlow';

export interface BusinessReviewComment extends AbstractDomain {
  navigationFlow: NavigationFlow;
  comment: string;
  createdBy: User;
  status: string;
}
