import { BusinessActivity } from "@/types/models/business";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  businessActivitiesList: BusinessActivity[];
  selectedBusinessActivity: BusinessActivity;
  selectedBusinessLinesList: BusinessActivity[];
  businessLinesList: BusinessActivity[];
  selectedMainBusinessLine: BusinessActivity;
  vatRegistred: boolean;
} = {
  businessActivitiesList: [],
  selectedBusinessActivity: {} as BusinessActivity,
  selectedBusinessLinesList: [],
  businessLinesList: [],
  selectedMainBusinessLine: {} as BusinessActivity,
  vatRegistred: false,
};

export const businessActivitySlice = createSlice({
  name: "businessActivity",
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
    setVatRegistred: (state, action) => {
      state.vatRegistred = action.payload;
    },
    removeSelectedBusinessLine: (state, action) => {
      state.selectedBusinessLinesList = state.selectedBusinessLinesList.filter(
        (businessLine) => businessLine.code !== action.payload.code
      );
    },
    setSelectedMainBusinessLine: (state, action) => {
      state.selectedMainBusinessLine = action.payload;
    },
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
  setVatRegistred,
} = businessActivitySlice.actions;

export default businessActivitySlice.reducer;
