import { BeneficialOwner } from '@/types/models/personDetail';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
    selectedBeneficialOwner?: BeneficialOwner;
    beneficialOwnersList: BeneficialOwner[];
} = {
  selectedBeneficialOwner: undefined,
  beneficialOwnersList: [],
};

const beneficialOwnerSlice = createSlice({
  name: 'beneficialOwner',
  initialState,
  reducers: {
    setSelectedBeneficialOwner: (state, action) => {
      state.selectedBeneficialOwner = action.payload;
    },
    setBeneficialOwnersList: (state, action) => {
      state.beneficialOwnersList = action.payload;
    },
    addToBeneficialOwnersList: (state, action) => {
      state.beneficialOwnersList.unshift(action.payload);
    },
  },
});

export const {
  setSelectedBeneficialOwner,
  setBeneficialOwnersList,
  addToBeneficialOwnersList,
} = beneficialOwnerSlice.actions;

export default beneficialOwnerSlice.reducer;
