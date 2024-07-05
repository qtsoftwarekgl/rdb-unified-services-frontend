import { UUID } from "crypto";

export type UserInformation = {
    id: UUID;
    foreName: string;
    surnames: string;
    gender: string;
    dateOfBirth: string
    nationality: string;
    documentNumber?: string;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    phones: Phone[];
};

export type Phone = {
    msidn: string;
    mno?: string;
    servicePeriod?: string;
};
