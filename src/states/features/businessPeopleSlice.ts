import { PersonDetail } from '@/types/models/personDetail';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  businessPeopleList: PersonDetail[];
  selectedBusinessPerson: PersonDetail;
} = {
  businessPeopleList: [],
  selectedBusinessPerson: {} as PersonDetail,
};

export const businessPeopleSlice = createSlice({
  name: 'businessPeople',
  initialState,
  reducers: {
    setBusinessPeopleList: (state, action) => {
      state.businessPeopleList = action.payload;
    },
    setSelectedBusinessPerson: (state, action) => {
      state.selectedBusinessPerson = action.payload;
    },
    addBusinessPerson: (state, action) => {
      state.businessPeopleList = [
        action.payload,
        ...state.businessPeopleList,
      ];
    },
    removeBusinessPerson: (state, action) => {
      state.businessPeopleList = state.businessPeopleList.filter(
        (person: PersonDetail) => person.id !== action.payload
      );
    },
  },
});

export const {
  setBusinessPeopleList,
  setSelectedBusinessPerson,
  addBusinessPerson,
  removeBusinessPerson,
} = businessPeopleSlice.actions;

export default businessPeopleSlice.reducer;
