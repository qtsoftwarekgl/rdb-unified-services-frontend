import { PersonDetail } from '@/types/models/personDetail';
import { createSlice } from '@reduxjs/toolkit'

const initialState: {
founderDetailsList: PersonDetail[],
selectedFounderDetail: PersonDetail,
} = {
founderDetailsList: [],
selectedFounderDetail: {} as PersonDetail,
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
  }
});

export const {
    setFounderDetailsList,
    setSelectedFounderDetail,
    addFounderDetail,
    removeFounderDetail,
} = founderDetailSlice.actions

export default founderDetailSlice.reducer;
