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
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
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
  const company = business?.company_details;
  return {
    ...company,
    company_name: company?.name,
    status: capitalizeString(business?.status),
    id:
      business?.id ||
      Math.floor(Math.random() * 9000) + 1000,
      entry_id: business?.entry_id,
    reg_number: `REG-${(
      business?.entry_id?.split("-")[0] || ""
    ).toUpperCase()}`,
    service_name: capitalizeString(business?.type),
    submission_date: business?.created_at,
    path: business?.path,
    active_tab: business?.active_tab,
    active_step: business?.active_step,
  };
};
