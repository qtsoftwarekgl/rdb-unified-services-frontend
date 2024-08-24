export type Certificate = {
    id: string;
    dateOfIssuance: string;
    companyCode: string;
    parentCompanyName?: string;
    branchId?: string;
    type?: string;
    registrationDate?: string;
    companyName: string;
    enterpriseName: string;
    mainBusinessActivityCode: string;
    mainBusinessActivity: string;
    mainBusinessActivityDate?: string;
    filingDate: string;
    financialStartYear: string;
    serialNumber?: string;
    category: string;
    certificateType: string;
    status: string;
    terminationDate: string;
    startOfDormancyDate: string;
    firstHiringDate: string;
    numberOfEmployeesOnRegistrationDate: string;
    branchBusinessAddressCertificate: string;
    businessId: string;
    attachmentTypes: string[];
    businessBranchId: string;
    createdAt: string;
    qrcode?: string;
    signedBy?: string;
    applicantDetails?: ApplicantDetails[];
    businessOwner?: ApplicantDetails;
    managingDirector?: ApplicantDetails;
    registeredOfficeAddress: RegisteredOfficeAddress;
    otherBusinessActivities?: BusinessActivitiesCertificate[];
    businessOwners?: ApplicantDetails[];
    membersOfBoard?: ApplicantDetails[];
    certificateBusinessShares?: CertificateBusinessShares[];
    certificateBusinessShareholders?: CertificateBusinessShareHolder[];
    shareGroups?: ShareGroup[];
    shareHoldersDetails?: ShareHolderDetails[];
}

export type BusinessActivitiesCertificate = {
    id: string;
    activityCode: string;
    activityName: string;
    certificateId: string;
    date: string;
}

export type ApplicantDetails = {
    id: string;
    version: number;
    state?: string | null;
    createdAt?: number;
    updatedAt?: number;
    createdBy?: string | null;
    updatedBy?: string | null;
    position?: string;
    name?: string;
    documentId?: string;
    gender?: string | null;
    documentType?: string | null;
    address?: string;
    phoneNumber?: string;
    certificateId?: string;
    roleName?: string;
}

export type CertificateBusinessShares = {
    id: string;
    shareGroup: string;
    valuePerShare: string;
    numberOfShares: string;
    shareCapital: string;
    certificateId: string;
}

export type CertificateBusinessShareHolder = {
    id: string;
    shareHolderName: string;
    shareGroup: string;
    numberOfShares: string;
    shareCapital: string;
    documentId: string;
    certificateId: string;
}

export type ReservedName = {
    id: string;
    name: string;
    reservationStatus: string;
    expiryDate: string;
}

export type RegisteredOfficeAddress = {
    id: string;
    version: number;
    state?: string | null;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    sector?: string;
    district?: string;
    provinceOrCity?: string | null;
    street?: string;
    phone?: string;
    poBox?: string | null;
    email?: string;
    countryOfIncorporation?: string | null;
    certificateId?: string;
}

export type ShareGroup = {
    id: string;
    version: number;
    state?: string | null;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    shareGroup: string;
    valuePerShare: string;
    numberOfShares: string;
    shareCapital: string;
    certificateId: string;
}

export type ShareHolderDetails = {
    id?: string;
    version?: number;
    state?: string | null;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    shareHolderName?: string;
    shareGroup?: string;
    numberOfShares?: string;
    shareCapital?: string;
    documentId?: string;
    certificateId?: string;
}

