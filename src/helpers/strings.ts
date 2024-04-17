import moment from "moment";
import { v4 as uuid } from "uuid";

export const formatPhone = (phone: string) => {
  if (!phone || phone === "null") return "";
  return `250${phone?.slice(-9)}`;
};

export const formatDate = (date: string | Date) => {
  if (!date) return "";
  return moment(date).format("DD/MM/YYYY");
};

export const capitalizeString = (string: string) => {
  if (!string) return "";
  const words = string.split("_");
  const capitalizedWords =
    words && words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(" ");
};

export const formatNumbers = (number: number | string) => {
  if (!number) return "";
  return new Intl.NumberFormat().format(Number(number));
};
export const generateUUID = () => {
  return uuid();
};

export const formatCompanyData = (business) => {
  if (business?.type === "name_reservation") {
    return {
      ...business,
      company_name: business?.name || "N/A",
      status: capitalizeString(business?.status),
      id: business?.id || Math.floor(Math.random() * 9000) + 1000,
      entry_id: business?.entry_id,
      reg_number: `REG-${(
        business?.entry_id?.split("-")[0] || ""
      ).toUpperCase()}`,
      service_name: capitalizeString(business?.type),
      submission_date: moment(business?.created_at).format("DD/MM/YYYY"),
      path: business?.path,
      active_tab: business?.active_tab,
      active_step: business?.active_step,
    };
  }

  const company = business?.company_details;
  return {
    ...company,
    company_name: company?.name || "N/A",
    status: capitalizeString(business?.status),
    id: business?.id || Math.floor(Math.random() * 9000) + 1000,
    entry_id: business?.entry_id,
    reg_number: `REG-${(
      business?.entry_id?.split("-")[0] || ""
    ).toUpperCase()}`,
    service_name: capitalizeString(business?.type),
    submission_date: moment(business?.created_at).format("DD/MM/YYYY"),
    path: business?.path,
    active_tab: business?.active_tab,
    active_step: business?.active_step,
  };
};

export function filterObject(
  obj: Record<string, string | number | undefined>
): Record<string, string | number | undefined> {
  const cleanedObj: Record<string, string | number | undefined> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined && value !== "") {
      cleanedObj[key] = value;
    }
  }

  return cleanedObj;
}

export const validatePassword = (password: string) => {
  const missingCharacters = [];

  if (!/(?=.*[A-Z])/.test(password)) {
    missingCharacters.push("No uppercase letter");
  }
  if (!/(?=.*[a-z])/.test(password)) {
    missingCharacters.push("No lowercase letter");
  }
  if (!/(?=.*\d)/.test(password)) {
    missingCharacters.push("No number");
  }
  if (!/(?=.*[^\w\s])/.test(password)) {
    missingCharacters.push("No special character");
  }

  return missingCharacters;
};
