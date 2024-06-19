import {
  Cell,
  District,
  Province,
  Sector,
  Village,
} from '@/types/locationTypes';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  provincesList: Province[];
  districtsList: District[];
  sectorsList: Sector[];
  cellsList: Cell[];
  villagesList: Village[];
  selectedProvince: Province | undefined;
  selectedDistrict: District | undefined;
  selectedSector: Sector | undefined;
  selectedCell: Cell | undefined;
  selectedVillage: Village | undefined;
} = {
  provincesList: [],
  districtsList: [],
  sectorsList: [],
  cellsList: [],
  villagesList: [],
  selectedProvince: undefined,
  selectedDistrict: undefined,
  selectedSector: undefined,
  selectedCell: undefined,
  selectedVillage: undefined,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setProvincesList: (state, action) => {
      state.provincesList = action.payload;
    },
    setDistrictsList: (state, action) => {
      state.districtsList = action.payload;
    },
    setSectorsList: (state, action) => {
      state.sectorsList = action.payload;
    },
    setCellsList: (state, action) => {
      state.cellsList = action.payload;
    },
    setVillagesList: (state, action) => {
      state.villagesList = action.payload;
    },
    setSelectedProvince: (state, action) => {
      if (action.payload instanceof Object) {
        state.selectedProvince = action.payload;
      } else {
        state.selectedProvince = state.provincesList.find(
          (province) => province.id === Number(action.payload)
        );
      }
    },
    setSelectedDistrict: (state, action) => {
      if (action.payload instanceof Object) {
        state.selectedDistrict = action.payload;
      } else {
        state.selectedDistrict = state.districtsList.find(
          (district) => district.id === Number(action.payload)
        );
      }
    },
    setSelectedSector: (state, action) => {
      if (action.payload instanceof Object) {
        state.selectedSector = action.payload;
      } else {
        state.selectedSector = state.sectorsList.find(
          (sector) => sector.id === Number(action.payload)
        );
      }
    },
    setSelectedCell: (state, action) => {
      if (action.payload instanceof Object) {
        state.selectedCell = action.payload;
      } else {
        state.selectedCell = state.cellsList.find(
          (cell) => cell.id === Number(action.payload)
        );
      }
    },
    setSelectedVillage: (state, action) => {
      if (action.payload instanceof Object) {
        state.selectedVillage = action.payload;
      } else {
        state.selectedVillage = state.villagesList.find(
          (village) => village.id === Number(action.payload)
        );
      }
    },
  },
});

export const {
  setProvincesList,
  setDistrictsList,
  setSectorsList,
  setCellsList,
  setVillagesList,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedSector,
  setSelectedCell,
  setSelectedVillage,
} = locationSlice.actions;

export default locationSlice.reducer;
