import {
  Cell,
  District,
  Province,
  Sector,
  Village,
} from '@/types/locationTypes';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessRegApiSlice from '../api/businessRegApiSlice';
import { toast } from 'react-toastify';

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
  fetchProvincesIsLoading: boolean;
  fetchDistrictsIsLoading: boolean;
  fetchSectorsIsLoading: boolean;
  fetchCellsIsLoading: boolean;
  fetchVillagesIsLoading: boolean;
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
  fetchProvincesIsLoading: false,
  fetchDistrictsIsLoading: false,
  fetchSectorsIsLoading: false,
  fetchCellsIsLoading: false,
  fetchVillagesIsLoading: false,
};

// FETCH PROVINCES THUNK
export const fetchProvincesThunk = createAsyncThunk<Province[]>(
  'location/fetchProvinces',
  async (_, { dispatch }) => {
      try {
        const response = await dispatch(
          businessRegApiSlice.endpoints.fetchProvinces.initiate({})
        ).unwrap();
        return response.data;
      } catch (error) {
        toast.error('An error occurred while fetching provinces');
      }
    }
);

// FETCH DISTRICTS THUNK
export const fetchDistrictsThunk = createAsyncThunk<District[], number>(
  'location/fetchDistricts',
  async (provinceId, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.fetchDistricts.initiate({ provinceId })
      ).unwrap();
      return response.data;
    } catch (error) {
      toast.error('An error occurred while fetching districts');
    }
  }
);

// FETCH SECTORS THUNK
export const fetchSectorsThunk = createAsyncThunk<Sector[], number>(
  'location/fetchSectors',
  async (districtId, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.fetchSectors.initiate({ districtId })
      ).unwrap();
      return response.data;
    } catch (error) {
      toast.error('An error occurred while fetching sectors');
    }
  }
);

// FETCH CELLS THUNK
export const fetchCellsThunk = createAsyncThunk<Cell[], number>(
  'location/fetchCells',
  async (sectorId, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.fetchCells.initiate({ sectorId })
      ).unwrap();
      return response.data;
    } catch (error) {
      toast.error('An error occurred while fetching cells');
    }
  }
);

// FETCH VIILAGES THUNK
export const fetchVillagesThunk = createAsyncThunk<Village[], number>(
  'location/fetchVillages',
  async (cellId, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.fetchVillages.initiate({ cellId })
      ).unwrap();
      return response.data;
    } catch (error) {
      toast.error('An error occurred while fetching villages');
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchProvincesThunk.fulfilled, (state, action) => {
      state.fetchProvincesIsLoading = false;
      state.provincesList = action.payload;
    });
    builder.addCase(fetchProvincesThunk.pending, (state) => {
      state.fetchProvincesIsLoading = true;
    });
    builder.addCase(fetchProvincesThunk.rejected, (state) => {
      state.fetchProvincesIsLoading = false;
    })
    builder.addCase(fetchDistrictsThunk.fulfilled, (state, action) => {
      state.fetchDistrictsIsLoading = false;
      state.districtsList = action.payload;
    })
    builder.addCase(fetchDistrictsThunk.pending, (state) => {
      state.fetchDistrictsIsLoading = true;
    })
    builder.addCase(fetchDistrictsThunk.rejected, (state) => {
      state.fetchDistrictsIsLoading = false;
    })
    builder.addCase(fetchSectorsThunk.fulfilled, (state, action) => {
      state.fetchSectorsIsLoading = false;
      state.sectorsList = action.payload;
    })
    builder.addCase(fetchSectorsThunk.pending, (state) => {
      state.fetchSectorsIsLoading = true;
    })
    builder.addCase(fetchSectorsThunk.rejected, (state) => {
      state.fetchSectorsIsLoading = false;
    })
    builder.addCase(fetchCellsThunk.fulfilled, (state, action) => {
      state.fetchCellsIsLoading = false;
      state.cellsList = action.payload;
    })
    builder.addCase(fetchCellsThunk.rejected, (state) => {
      state.fetchCellsIsLoading = false;
    })
    builder.addCase(fetchCellsThunk.pending, (state) => {
      state.fetchCellsIsLoading = true;
    })
    builder.addCase(fetchVillagesThunk.fulfilled, (state, action) => {
      state.fetchVillagesIsLoading = false;
      state.villagesList = action.payload;
    })
    builder.addCase(fetchVillagesThunk.rejected, (state) => {
      state.fetchVillagesIsLoading = false;
    })
    builder.addCase(fetchVillagesThunk.pending, (state) => {
      state.fetchVillagesIsLoading = true;
    })
  }
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
