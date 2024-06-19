export type Province = {
  id: number;
  name: string;
};

export type District = {
  id: number;
  name: string;
  province: Province;
};

export type Sector = {
  id: number;
  name: string;
  district: District;
};

export type Cell = {
  id: number;
  name: string;
  sector: Sector;
};

export type Village = {
  id: number;
  name: string;
  cell: Cell;
};
