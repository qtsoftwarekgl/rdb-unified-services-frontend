import { Certificate } from '@/types/models/certificate';
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
    return "CONFIRMATION OF CESSATION OF DORMANCY OF DOMESTIC";

    case CESSATION_OF_DORMANCY_FOREIGN:
    return "CONFIRMATION OF CESSATION OF DORMANCY OF FOREIGN";

    case DISSOLUTION_DOMESTIC:
    return "CONFIRMATION LETTER OF REMOVAL OF DOMESTIC COMPANY";

    case DISSOLUTION_FOREIGN:
    return "CONFIRMATION LETTER OF REMOVAL OF FOREIGN COMPANY";

    case DISSOLUTION_ENTERPRISE:
    return "CONFIRMATION LETTER OF REMOVAL OF ENTERPRISE";

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
    return "CONFIRMATION OF DORMANCY OF DOMESTIC COMPANY";

    case CONFIRMATION_OF_DORMANCY_FOREIGN:
    return "CONFIRMATION OF DORMANCY OF FOREIGN COMPANY";

    case CONFIRMATION_OF_DORMANCY_ENTERPRISE:
    return "CONFIRMATION OF DORMANCY OF ENTERPRISE";

    case FOUNDATION_REGISTRATION:
    return "Foundation Registration";

    case GOOD_STANDING:
    return "Good Standing";

    case MEMORANDUM_OF_ASSOCIATION:
    return "Memorandum of Association";

    case NAME_RESERVATION:
    return "CERTIFICATE OF NAME RESERVATION";

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
    if(certificate?.certificateType?.includes("FOREIGN")){
        return certificate?.registeredOfficeAddress?.street+", "+certificate?.registeredOfficeAddress?.countryOfIncorporation || "";
    }
    else{
        return `${certificate?.registeredOfficeAddress?.sector}, ${certificate?.registeredOfficeAddress?.district}, ${certificate?.registeredOfficeAddress?.provinceOrCity || ""}, ${certificate?.registeredOfficeAddress?.countryOfIncorporation || ""}`;
    }
}
