import { BusinessActivity } from '@/types/models/business';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  businessActivitiesList: BusinessActivity[];
  selectedBusinessActivity: BusinessActivity;
  selectedBusinessLinesList: BusinessActivity[];
  businessLinesList: BusinessActivity[];
  selectedMainBusinessLine: BusinessActivity;
} = {
  businessActivitiesList: [],
  selectedBusinessActivity: {} as BusinessActivity,
  selectedBusinessLinesList: [],
  businessLinesList: [],
  selectedMainBusinessLine: {} as BusinessActivity,
};

export const businessActivitySlice = createSlice({
  name: 'businessActivity',
  initialState,
  reducers: {
    setBusinessActivitiesList: (state, action) => {
      state.businessActivitiesList = action.payload;
    },
    setSelectedBusinessActivity: (state, action) => {
        state.selectedBusinessActivity = action.payload;
    },
    setSelectedBusinessLinesList: (state, action) => {
      state.selectedBusinessLinesList = action.payload;
    },
    addSelectedBusinessLine: (state, action) => {
      state.selectedBusinessLinesList.unshift(action.payload);
    },
    setBusinessLinesList: (state, action) => {
      state.businessLinesList = action.payload;
    },
    removeSelectedBusinessLine: (state, action) => {
      state.selectedBusinessLinesList = state.selectedBusinessLinesList.filter(
        (businessLine) => businessLine.code !== action.payload.code
      );
    },
    setSelectedMainBusinessLine: (state, action) => {
      state.selectedMainBusinessLine = action.payload;
    }
  },
});

export const {
  setBusinessActivitiesList,
  setSelectedBusinessActivity,
  setSelectedBusinessLinesList,
  addSelectedBusinessLine,
  setBusinessLinesList,
  removeSelectedBusinessLine,
  setSelectedMainBusinessLine,
} = businessActivitySlice.actions;

export default businessActivitySlice.reducer;
