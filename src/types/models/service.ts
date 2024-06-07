import { UUID } from "crypto";

export type Service = {
    id: UUID;
    name: string;
    path: string;
    section: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    items: Service[];
};
