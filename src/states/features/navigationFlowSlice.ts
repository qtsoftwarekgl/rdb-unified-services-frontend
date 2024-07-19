import {
  NavigationFlow,
  NavigationFlowMass,
} from '@/types/models/navigationFlow';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  navigationFlowMassList?: NavigationFlowMass;
  businessNavigationFlowsList: NavigationFlow[];
} = {
  navigationFlowMassList: undefined,
  businessNavigationFlowsList: [],
};

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
  },
});

export const {
  setNavigationFlowMassList,
  setBusinessNavigationFlowsList,
  addBusinessNavigationFlow,
} = navigationFlowSlice.actions;

export default navigationFlowSlice.reducer;
