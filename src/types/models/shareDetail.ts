import { UUID } from "crypto";

export type ShareDetail = {
  id: UUID;
  version: number;
  state?: string;
  createdAt: Date;
  updatedAt: Date;
  shareTypeCD: string;
  perValue: number;
  shareQuantity: number;
  totalAmount: number;
  showSequence: number;
  remainingShares?: number;
  applicationReferenceId?: UUID;
};
