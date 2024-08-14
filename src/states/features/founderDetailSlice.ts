import { businessId } from '@/types/models/business';
import { FounderDetail } from '@/types/models/personDetail';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import businessRegApiSlice from '../api/businessRegApiSlice';
import { toast } from 'react-toastify';

const initialState: {
  founderDetailsList: FounderDetail[];
  selectedFounderDetail: FounderDetail;
  assignSharesModal: boolean;
  deleteFounderModal: boolean;
  fetchFounderDetailsIsFetching: boolean;
  fetchFounderDetailsIsSuccess: boolean;
  selectedFounderDetailWithShares?: {
    founderDetail: FounderDetail;
    shareQuantityPercentage: number;
  };
  founderWithSharesDetailsModal: boolean;
} = {
  founderDetailsList: [],
  selectedFounderDetail: {} as FounderDetail,
  assignSharesModal: false,
  deleteFounderModal: false,
  fetchFounderDetailsIsFetching: false,
  fetchFounderDetailsIsSuccess: false,
  selectedFounderDetailWithShares: undefined,
  founderWithSharesDetailsModal: false,
};

// FETCH FOUNDERS WITH SHARE PERCENTAGES THUNK
export const fetchFoundersWithSharePercentagesThunk = createAsyncThunk<
  {
    founderDetail: FounderDetail;
    founderShareDetails: FounderDetail;
  },
  { businessId: businessId },
  { dispatch: AppDispatch }
>(
  'founderDetail/fetchFoundersWithSharePercentages',
  async ({ businessId }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessRegApiSlice.endpoints.fetchFoundersWithSharePercentages.initiate(
          {
            businessId,
          }
        )
      );
      dispatch(setFounderDetailsList(response.data?.data));
      return response.data;
    } catch (error) {
      toast.error(
        'An error occurred while fetching founders with share percentages'
      );
    }
  }
);

const founderDetailSlice = createSlice({
  name: 'founderDetail',
  initialState,
  reducers: {
    setFounderDetailsList: (state, action) => {
      state.founderDetailsList = action.payload;
    },
    setSelectedFounderDetail: (state, action) => {
      state.selectedFounderDetail = action.payload;
    },
    addFounderDetail: (state, action) => {
      state.founderDetailsList = [action.payload, ...state.founderDetailsList];
    },
    removeFounderDetail: (state, action) => {
      state.founderDetailsList = state.founderDetailsList.filter(
        (person: FounderDetail) => person.id !== action.payload
      );
    },
    setAssignSharesModal: (state, action) => {
      state.assignSharesModal = action.payload;
    },
    setDeleteFounderModal: (state, action) => {
      state.deleteFounderModal = action.payload;
    },
    setSelectedFounderDetailWithShares: (state, action) => {
      state.selectedFounderDetailWithShares = action.payload;
    },
    setFounderWithSharesDetailsModal: (state, action) => {
      state.founderWithSharesDetailsModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoundersWithSharePercentagesThunk.pending, (state) => {
        state.fetchFounderDetailsIsFetching = true;
        state.fetchFounderDetailsIsSuccess = false;
      })
      .addCase(fetchFoundersWithSharePercentagesThunk.fulfilled, (state) => {
        state.fetchFounderDetailsIsFetching = false;
        state.fetchFounderDetailsIsSuccess = true;
      })
      .addCase(fetchFoundersWithSharePercentagesThunk.rejected, (state) => {
        state.fetchFounderDetailsIsFetching = false;
        state.fetchFounderDetailsIsSuccess = false;
      });
  },
});

export const {
  setFounderDetailsList,
  setSelectedFounderDetail,
  addFounderDetail,
  removeFounderDetail,
  setAssignSharesModal,
  setDeleteFounderModal,
  setSelectedFounderDetailWithShares,
  setFounderWithSharesDetailsModal,
} = founderDetailSlice.actions;

export default founderDetailSlice.reducer;
