import { UUID } from "crypto"

export type ReservedName = {
    id: UUID;
    name: string;
    state: string;
    reservationStatus: string;
    expiryDate: Date;
    createdAt: Date;
}