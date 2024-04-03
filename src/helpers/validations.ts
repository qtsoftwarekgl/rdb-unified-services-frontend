export const validateInputs = (value: string, type: string) => {
  if (!value) {
    return false;
  } else {
    if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      return false;
    }

    if (type === 'password' && value.length < 6) {
      return false;
    }

    if (type === 'number' && !/^\d+$/.test(value)) {
      return false;
    }

    if (
      type === 'tel' &&
      value?.trim() !== '' &&
      !/^07[2389][0-9]{7}$/.test(value)
    ) {
      return false;
    }

    if (type === 'text' && !/^\s*[\s\S]+?\s*$/.test(value)) {
      return false;
    }
    if (type === 'url' && !/(ftp|http|https|www):\/\/[^ "]+$/.test(value)) {
      return false;
    }
    if (type === 'textarea' && !/^\s*[\s\S]+?\s*$/.test(value)) {
      return false;
    }
    if (type === 'nid' && value?.length !== 16) {
      return false;
    }
    if (type === 'tin' && value?.length !== 9) {
      return false;
    }
    if (type === 'nid' && value?.length !== 16) {
      return false;
    }
    if (
      type === 'password' &&
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value)
    ) {
      return false;
    }
    if (type === 'passport' && !/^[a-zA-Z0-9]{12}$/g.test(value)) {
      return false;
    }
  }

  return true;
};

export default validateInputs;
