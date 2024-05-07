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

export const capitalizeString = (string: string) => {
  if (!string) return '';
  const words = string.split('_');
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
    console.log(business)
    return {
      ...business,
      company_name: business?.name || 'N/A',
      status: business?.status,
      id: business?.id || Math.floor(Math.random() * 9000) + 1000,
      entry_id: business?.entry_id,
      reg_number: `REG-${(
        business?.entry_id?.split('-')[0] || ''
      ).toUpperCase()}`,
      service_name: business?.type,
      submission_date: moment(business?.created_at).format('DD/MM/YYYY'),
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
    entry_id: business?.entry_id,
    reg_number: `REG-${(
      business?.entry_id?.split('-')[0] || ''
    ).toUpperCase()}`,
    service_name: business?.type,
    submission_date: moment(business?.created_at).format('DD/MM/YYYY'),
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

export const validatePassword = (password: string) => {
  const missingCharacters = [
    {
      message: 'Uppercase letter',
      type: 'uppercase',
      color: 'red',
    },
    {
      message: 'Lowercase letter',
      type: 'lowercase',
      color: 'red',
    },
    {
      message: 'Numeral character',
      type: 'number',
      color: 'red',
    },
    {
      message: 'Special characters',
      type: 'special',
      color: 'red',
    },
  ];

  if (password && /(?=.*[A-Z])/.test(password)) {
    const uppercaseCharacter = missingCharacters.find(
      (character) => character.type === 'uppercase'
    );
    if (uppercaseCharacter) {
      uppercaseCharacter.color = 'green';
    }
  }
  if (password && /(?=.*[a-z])/.test(password)) {
    console.log(password);
    const lowercaseCharacter = missingCharacters.find(
      (character) => character.type === 'lowercase'
    );
    if (lowercaseCharacter) {
      lowercaseCharacter.color = 'green';
    }
  }
  if (password && /(?=.*\d)/.test(password)) {
    const numeralCharacter = missingCharacters.find(
      (character) => character.type === 'number'
    );
    if (numeralCharacter) {
      numeralCharacter.color = 'green';
    }
  }
  if (password && /(?=.*[^\w\s])/.test(password)) {
    const specialCharacter = missingCharacters.find(
      (character) => character.type === 'special'
    );
    if (specialCharacter) {
      specialCharacter.color = 'green';
    }
  }

  return missingCharacters;
};

export const maskPhoneDigits = (phone: string) => {
  return `${phone.slice(0, 3)}X XXX ${phone?.slice(-3)}`;
};
