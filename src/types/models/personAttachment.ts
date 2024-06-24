import { UUID } from 'crypto';

export type PersonAttachment = {
  id: UUID;
  personId: UUID;
  fileName: string;
  attachmentType?: string;
  attachmentUrl: string;
  name?: string;
  type?: string;
  url?: string;
  size?: number;
};
