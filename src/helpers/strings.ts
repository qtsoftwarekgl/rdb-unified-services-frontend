import moment from 'moment';
import { v4 as uuid } from 'uuid';

export const formatPhone = (phone: string) => {
  if (!phone || phone === 'null') return '';
  return `250${phone?.slice(-9)}`;
};

export const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  return moment(date).format('DD/MM/YYYY');
};

export const convertDecimalToPercentage = (number: number | string) => {
  if (!number) return '';
  return Number(Number(number).toFixed(2)) * 100;
};

export const capitalizeString = (string: string | undefined | null) => {
  if (!string) return '';
  const words = string?.toLowerCase()?.split('_');
  const capitalizedWords =
    words && words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords && capitalizedWords.join(' ');
};

export const formatNumbers = (number: number | string) => {
  if (!number) return '';
  return new Intl.NumberFormat().format(Number(number));
};
export const generateUUID = () => {
  return uuid();
};

export const formatCompanyData = (business: any) => {
  if (business?.type === 'name_reservation') {
    return {
      ...business,
      company_name: business?.name || 'N/A',
      status: business?.status,
      id: business?.id || Math.floor(Math.random() * 9000) + 1000,
      entryId: business?.entryId,
      reference_no: `REG-${(
        business?.entryId?.split('-')[0] || ''
      ).toUpperCase()}`,
      service_name: business?.type,
      createdAt: formatDate(business?.createdAt),
      updatedAt: formatDate(business?.updatedAt),
      path: business?.path,
      active_tab: business?.active_tab,
      active_step: business?.active_step,
    };
  }

  const company = business?.company_details;
  return {
    ...company,
    company_name: company?.name || 'N/A',
    status: business?.status,
    id: business?.id || Math.floor(Math.random() * 9000) + 1000,
    entryId: business?.entryId,
    reference_no: `REG-${(
      business?.entryId?.split('-')[0] || ''
    ).toUpperCase()}`,
    service_name: business?.type,
    createdAt: formatDate(business?.createdAt),
    updatedAt: formatDate(business?.updatedAt),
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
    if (value !== undefined && value !== '') {
      cleanedObj[key] = value;
    }
  }

  return cleanedObj;
}

export const maskPhoneDigits = (phone: string) => {
  return `${phone.slice(0, 3)}X XXX ${phone?.slice(-3)}`;
};
