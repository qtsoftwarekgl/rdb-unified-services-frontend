export const genderOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
];

export const getGenderLabel = (gender?: string) => {
  if (!gender) return 'Male'
  return genderOptions?.find((g) => g?.value === gender)?.label;
};
