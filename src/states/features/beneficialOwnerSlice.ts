import { BeneficialOwner } from '@/types/models/personDetail';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { businessId } from '@/types/models/business';
import { toast } from 'react-toastify';
import businessRegApiSlice from '../api/businessRegApiSlice';

const beneficialOwnerNavigationSteps = [
  {
    name: 'tin_ownership',
    active: true,
    completed: false,
  },
  {
    name: 'personal_information',
    active: false,
    completed: false,
  },
  {
    name: 'residential_address',
    active: false,
    completed: false,
  },
  {
    name: 'professional_address',
    active: false,
    completed: false,
  },
  {
    name: 'ownership_information',
    active: false,
    completed: false,
  },
];

const initialState: {
  selectedBeneficialOwner?: BeneficialOwner;
  beneficialOwnersList: BeneficialOwner[];
  beneficialOwnersIsFetching: boolean;
  beneficialOwnersIsError: boolean;
  beneficialOwnersIsSuccess: boolean;
  beneficialOwnerDetailsModal: boolean;
  beneficialOwnerNavigationSteps: {
    name: string;
    active: boolean;
    completed: boolean;
  }[];
  newBeneficialOwner?: BeneficialOwner;
  beneficialOwner?: BeneficialOwner;
} = {
  selectedBeneficialOwner: undefined,
  beneficialOwnersList: [],
  beneficialOwnersIsError: false,
  beneficialOwnersIsFetching: false,
  beneficialOwnersIsSuccess: false,
  beneficialOwnerDetailsModal: false,
  beneficialOwnerNavigationSteps,
  newBeneficialOwner: undefined,
  beneficialOwner: undefined,
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
    setCompleteBeneficialOwnerNavigationStep: (state, action) => {
      state.beneficialOwnerNavigationSteps =
        state.beneficialOwnerNavigationSteps.map((step) => {
          if (step.name === action.payload) {
            return { ...step, active: false, completed: true };
          }
          return step;
        });
    },
    setActiveBeneficialOwnerNavigationStep: (state, action) => {
      state.beneficialOwnerNavigationSteps =
        state.beneficialOwnerNavigationSteps.map((step) => {
          if (step.name === action.payload) {
            return { ...step, active: true };
          }
          return { ...step, active: false };
        });
    },
    setNewBeneficialOwner: (state, action) => {
      state.newBeneficialOwner = action.payload;
    },
    setBeneficialOwner: (state, action) => {
      state.beneficialOwner = action.payload;
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
  setCompleteBeneficialOwnerNavigationStep,
  setActiveBeneficialOwnerNavigationStep,
  setNewBeneficialOwner,
  setBeneficialOwner,
} = beneficialOwnerSlice.actions;

export default beneficialOwnerSlice.reducer;
