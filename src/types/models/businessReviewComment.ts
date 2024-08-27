import { AbstractDomain } from '.';
import { User } from './user';
import { NavigationFlow } from './navigationFlow';
import { UUID } from 'crypto';

export interface BusinessReviewComment extends AbstractDomain {
  navigationFlow: NavigationFlow;
  comment: string;
  createdBy: User;
  status: string;
}

export interface BusinessAmendmentReviewComment extends AbstractDomain {
  amendmentDetailId: UUID;
  comment: string;
  createdBy: User;
  status: string;
}
