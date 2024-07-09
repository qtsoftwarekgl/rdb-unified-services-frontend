import { UUID } from "crypto";

export type AbstractDomain = {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
};