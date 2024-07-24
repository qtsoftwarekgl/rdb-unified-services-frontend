import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  NavigationFlow,
  NavigationFlowMass,
} from '@/types/models/navigationFlow';
import businessRegApiSlice from '../api/businessRegApiSlice';
import { AppDispatch } from '../store';
import { businessId } from '@/types/models/business';
import { UUID } from 'crypto';

const initialState: {
  navigationFlowMassList?: NavigationFlowMass;
  businessNavigationFlowsList: NavigationFlow[];
  businessNavigationFlowIsLoading: boolean;
} = {
  navigationFlowMassList: undefined,
  businessNavigationFlowsList: [],
  businessNavigationFlowIsLoading: false,
};

export const createNavigationFlowThunk = createAsyncThunk<
  NavigationFlow,
  { businessId: businessId; massId: string; isActive: boolean },
  { dispatch: AppDispatch }
>('navigationFlow/createNavigationFlow', async (payload, { dispatch }) => {
    const response = await dispatch(
      businessRegApiSlice.endpoints.createNavigationFlow.initiate(payload)
    ).unwrap();
    return response.data;
});

export const completeNavigationFlowThunk = createAsyncThunk<
  NavigationFlow,
  { isCompleted: boolean; navigationFlowId?: UUID },
  { dispatch: AppDispatch }
>('navigationFlow/completeNavigationFlow', async (payload, { dispatch }) => {
    const response = await dispatch(
      businessRegApiSlice.endpoints.completeNavigationFlow.initiate(payload)
    ).unwrap();
    return response.data;
});

const navigationFlowSlice = createSlice({
  name: 'navigationFlow',
  initialState,
  reducers: {
    setNavigationFlowMassList: (state, action) => {
      state.navigationFlowMassList = action.payload;
    },
    setBusinessNavigationFlowsList: (state, action) => {
      state.businessNavigationFlowsList = action.payload;
    },
    addBusinessNavigationFlow: (state, action) => {
      state.businessNavigationFlowsList.push(action.payload);
    },
    removeBusinessNavigationFlow: (state, action) => {
      state.businessNavigationFlowsList =
        state.businessNavigationFlowsList.filter(
          (navigationFlow) => navigationFlow.id !== action.payload
        );
    },
    setBusinessNavigationFlowIsLoading: (state, action) => {
      state.businessNavigationFlowIsLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNavigationFlowThunk.pending, (state) => {
        state.businessNavigationFlowIsLoading = true;
      })
      .addCase(
        createNavigationFlowThunk.fulfilled,
        (state, action: PayloadAction<NavigationFlow>) => {
          state.businessNavigationFlowIsLoading = false;
          state.businessNavigationFlowsList =
            action.payload as unknown as NavigationFlow[];
        }
      )
      .addCase(createNavigationFlowThunk.rejected, (state) => {
        state.businessNavigationFlowIsLoading = false;
      })
      .addCase(completeNavigationFlowThunk.pending, (state) => {
        state.businessNavigationFlowIsLoading = true;
      })
      .addCase(
        completeNavigationFlowThunk.fulfilled,
        (state, action: PayloadAction<NavigationFlow>) => {
          state.businessNavigationFlowIsLoading = false;
          state.businessNavigationFlowsList = state.businessNavigationFlowsList.map(
            (navigationFlow) =>
              navigationFlow.id === action.payload.id
                ? action.payload
                : navigationFlow
          );
        }
      )
      .addCase(completeNavigationFlowThunk.rejected, (state) => {
        state.businessNavigationFlowIsLoading = false;
      });
  },
});

export const {
  setNavigationFlowMassList,
  setBusinessNavigationFlowsList,
  addBusinessNavigationFlow,
  removeBusinessNavigationFlow,
  setBusinessNavigationFlowIsLoading,
} = navigationFlowSlice.actions;

export default navigationFlowSlice.reducer;
