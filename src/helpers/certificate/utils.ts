import { ApplicantDetails, Certificate } from '@/types/models/certificate';
import { ECertificateType } from './enums';

const {
    AMALGAMATION,
    ANNUAL_RETURN,
    BRANCH_REGISTRATION,
    CESSATION_OF_DORMANCY_DOMESTIC,
    CESSATION_OF_DORMANCY_FOREIGN,
    DISSOLUTION_DOMESTIC,
    DISSOLUTION_FOREIGN,
    DISSOLUTION_ENTERPRISE,
    DOMESTIC_COMPANY_REGISTRATION,
    FOREIGN_COMPANY_REGISTRATION,
    DOMESTIC_COMPANY_REGISTRATION_FULL,
    FOREIGN_COMPANY_REGISTRATION_FULL,
    ENTERPRISE_REGISTRATION,
    ENTERPRISE_REGISTRATION_FULL,
    CONFIRMATION_OF_DORMANCY_DOMESTIC,
    CONFIRMATION_OF_DORMANCY_FOREIGN,
    CONFIRMATION_OF_DORMANCY_ENTERPRISE,
    FOUNDATION_REGISTRATION,
    GOOD_STANDING,
    MEMORANDUM_OF_ASSOCIATION,
    NAME_RESERVATION,
    PARTNERSHIP_REGISTRATION,
    PARTNERSHIP_REGISTRATION_FULL,
    VALUE_ADDED_TAX,
} = ECertificateType;

export  function getCertificateTitle(certificateType: string, isFull: boolean = false) {
  switch (certificateType) {
    case AMALGAMATION:
    return "Certificate of Amalgamation";

    case ANNUAL_RETURN:
    return "Annual Return";

    case BRANCH_REGISTRATION:
    return "Branch Registration";

    case CESSATION_OF_DORMANCY_DOMESTIC:
    return "Cessation of Dormancy (Domestic)";

    case CESSATION_OF_DORMANCY_FOREIGN:
    return "Cessation of Dormancy (Foreign)";

    case DISSOLUTION_DOMESTIC:
    return "Dissolution (Domestic)";

    case DISSOLUTION_FOREIGN:
    return "Dissolution (Foreign)";

    case DISSOLUTION_ENTERPRISE:
    return "Dissolution (Enterprise)";

    case DOMESTIC_COMPANY_REGISTRATION:
    return isFull ? "FULL CERTIFICATE OF DOMESTIC COMPANY REGISTRATION" : "CERTIFICATE OF DOMESTIC COMPANY REGISTRATION";

    case FOREIGN_COMPANY_REGISTRATION:
    return "Foreign Company Registration";

    case DOMESTIC_COMPANY_REGISTRATION_FULL:
    return "Domestic Company Registration (Full)";

    case FOREIGN_COMPANY_REGISTRATION_FULL:
    return "Foreign Company Registration (Full)";

    case ENTERPRISE_REGISTRATION:
    return "Enterprise Registration";

    case ENTERPRISE_REGISTRATION_FULL:
    return "Enterprise Registration (Full)";

    case CONFIRMATION_OF_DORMANCY_DOMESTIC:
    return "Confirmation of Dormancy (Domestic)";

    case CONFIRMATION_OF_DORMANCY_FOREIGN:
    return "Confirmation of Dormancy (Foreign)";

    case CONFIRMATION_OF_DORMANCY_ENTERPRISE:
    return "Confirmation of Dormancy (Enterprise)";

    case FOUNDATION_REGISTRATION:
    return "Foundation Registration";

    case GOOD_STANDING:
    return "Good Standing";

    case MEMORANDUM_OF_ASSOCIATION:
    return "Memorandum of Association";

    case NAME_RESERVATION:
    return "Name Reservation";

    case PARTNERSHIP_REGISTRATION:
    return "Partnership Registration";

    case PARTNERSHIP_REGISTRATION_FULL:
    return "Partnership Registration (Full)";

    case VALUE_ADDED_TAX:
    return "Value Added Tax";

    default:
    return certificateType;
  }
}

export function getCompanyType(type: string){
    switch(type){
        case "companyLimitedByShares":
            return "Limited By Shares";
        case "companyLimitedBySharesAndGuarantee":
            return "Limited By Shares and Guarantee";
        case "companyLimitedByGuarantee":
            return "Limited By Guarantee";
        case "unlimitedCompany":
            return "Unlimited Company";
        default:
            return type;
    }
}

export function getCompanyAddress(certificate: Certificate): string{
    if(certificate.certificateType.includes("FOREIGN")){
        return certificate?.registeredOfficeAddress?.street+", "+certificate?.registeredOfficeAddress?.countryOfIncorporation || "";
    }
    else{
        return `${certificate?.registeredOfficeAddress?.sector}, ${certificate?.registeredOfficeAddress?.district}, ${certificate?.registeredOfficeAddress?.provinceOrCity || ""}, ${certificate?.registeredOfficeAddress?.countryOfIncorporation || ""}`;
    }
}
