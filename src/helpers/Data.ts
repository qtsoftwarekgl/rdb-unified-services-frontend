import { rwandaAdministrativeUnits } from '../constants/Administration';

export const getRwandaProvinces = () => {
  const provinces = Object.keys(rwandaAdministrativeUnits);
  return provinces && provinces;
};

export const getRwandaDistricts = (province: string) => {
  const districts = rwandaAdministrativeUnits[province];
  return districts && Object.keys(districts);
};

export const getRwandaSectors = (province: string, district: string) => {
  const sectors = rwandaAdministrativeUnits[province][district];
  return sectors && Object.keys(sectors);
};

export const getRwandaCells = (
  province: string,
  district: string,
  sector: string
) => {
  const cells = rwandaAdministrativeUnits[province][district][sector];
  return cells && Object.keys(cells);
};

export const getRwandaVillages = (
  province: string,
  district: string,
  sector: string,
  cell: string
) => {
  const villages = rwandaAdministrativeUnits[province][district][sector][cell];
  return villages;
};
