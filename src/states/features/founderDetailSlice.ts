import { FounderDetail } from '@/types/models/personDetail';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  founderDetailsList: FounderDetail[];
  selectedFounderDetail: FounderDetail;
  assignSharesModal: boolean;
  deleteFounderModal: boolean;
} = {
  founderDetailsList: [],
  selectedFounderDetail: {} as FounderDetail,
  assignSharesModal: false,
  deleteFounderModal: false,
};

const founderDetailSlice = createSlice({
  name: "founderDetail",
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
  },
});

export const {
  setFounderDetailsList,
  setSelectedFounderDetail,
  addFounderDetail,
  removeFounderDetail,
  setAssignSharesModal,
  setDeleteFounderModal,
} = founderDetailSlice.actions;

export default founderDetailSlice.reducer;
