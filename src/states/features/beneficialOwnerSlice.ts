import { BeneficialOwner } from '@/types/models/personDetail';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { businessId } from '@/types/models/business';
import { toast } from 'react-toastify';
import businessRegApiSlice from '../api/businessRegApiSlice';

const initialState: {
  selectedBeneficialOwner?: BeneficialOwner;
  beneficialOwnersList: BeneficialOwner[];
  beneficialOwnersIsFetching: boolean;
  beneficialOwnersIsError: boolean;
  beneficialOwnersIsSuccess: boolean;
  beneficialOwnerDetailsModal: boolean;
} = {
  selectedBeneficialOwner: undefined,
  beneficialOwnersList: [],
  beneficialOwnersIsError: false,
  beneficialOwnersIsFetching: false,
  beneficialOwnersIsSuccess: false,
  beneficialOwnerDetailsModal: false,
};

// FETCH BENEFICIAL OWNERS THUNK
export const fetchBeneficialOwnersThunk = createAsyncThunk<
  BeneficialOwner[],
  { businessId: businessId },
  { dispatch: AppDispatch }
>(
  'beneficialOwner/fetchBeneficialOwners',
  async ({ businessId }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.fetchBeneficialOwners.initiate({
          businessId,
        })
      );
      return response.data.data?.data;
    } catch (error) {
      toast.error('Failed to load benficial owners. Refresh and try again');
    }
  }
);

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
    // SET BENEFICIAL OWNER DETAILS MODAL
    setBeneficialOwnerDetailsModal: (state, action) => {
      state.beneficialOwnerDetailsModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBeneficialOwnersThunk.pending, (state) => {
      state.beneficialOwnersIsFetching = true;
      state.beneficialOwnersIsError = false;
      state.beneficialOwnersIsSuccess = false;
    });
    builder.addCase(fetchBeneficialOwnersThunk.fulfilled, (state, action) => {
      state.beneficialOwnersList = action.payload;
      state.beneficialOwnersIsFetching = false;
      state.beneficialOwnersIsError = false;
      state.beneficialOwnersIsSuccess = true;
    });
    builder.addCase(fetchBeneficialOwnersThunk.rejected, (state) => {
      state.beneficialOwnersIsFetching = false;
      state.beneficialOwnersIsError = true;
      state.beneficialOwnersIsSuccess = false;
    });
  },
});

export const {
  setSelectedBeneficialOwner,
  setBeneficialOwnersList,
  addToBeneficialOwnersList,
  setBeneficialOwnerDetailsModal,
} = beneficialOwnerSlice.actions;

export default beneficialOwnerSlice.reducer;
