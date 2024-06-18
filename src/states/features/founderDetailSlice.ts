import { FounderDetail, PersonDetail } from '@/types/models/personDetail';
import { createSlice } from '@reduxjs/toolkit'

const initialState: {
founderDetailsList: FounderDetail[],
selectedFounderDetail: FounderDetail,
assignSharesModal: boolean,
} = {
founderDetailsList: [],
selectedFounderDetail: {} as FounderDetail,
assignSharesModal: false,
}

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
      state.founderDetailsList = [
        action.payload,
        ...state.founderDetailsList,
      ];
    },
    removeFounderDetail: (state, action) => {
      state.founderDetailsList = state.founderDetailsList.filter(
        (person: PersonDetail) => person.id !== action.payload
      );
    },
    setAssignSharesModal: (state, action) => {
      state.assignSharesModal = action.payload;
    }
  }
});

export const {
    setFounderDetailsList,
    setSelectedFounderDetail,
    addFounderDetail,
    removeFounderDetail,
    setAssignSharesModal
} = founderDetailSlice.actions

export default founderDetailSlice.reducer;
