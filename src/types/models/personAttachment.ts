import { UUID } from "crypto";

export type BaseAttachment = {
  id: UUID;
  fileName: string;
  attachmentType?: string;
  attachmentUrl: string;
  fileSize: string;
  name?: string;
  type?: string;
  url?: string;
  size?: number | string;
};

export type PersonAttachment = BaseAttachment & {
  personId: UUID;
};

export type BusinessAttachment = BaseAttachment & {
  businessId: UUID;
};
