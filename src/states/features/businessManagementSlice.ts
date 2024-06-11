import { PersonDetail } from '@/types/models/personDetail';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  managementPeopleList: PersonDetail[];
  selectedManagementPerson: PersonDetail;
} = {
  managementPeopleList: [],
  selectedManagementPerson: {} as PersonDetail,
};

export const businessManagementSlice = createSlice({
  name: 'businessManagement',
  initialState,
  reducers: {
    setManagementPeopleList: (state, action) => {
      state.managementPeopleList = action.payload;
    },
    setSelectedManagementPerson: (state, action) => {
      state.selectedManagementPerson = action.payload;
    },
    addManagementPerson: (state, action) => {
      state.managementPeopleList = [
        action.payload,
        ...state.managementPeopleList,
      ];
    },
    removeManagementPerson: (state, action) => {
      state.managementPeopleList = state.managementPeopleList.filter(
        (person: PersonDetail) => person.id !== action.payload
      );
    },
  },
});

export const {
  setManagementPeopleList,
  setSelectedManagementPerson,
  addManagementPerson,
  removeManagementPerson,
} = businessManagementSlice.actions;

export default businessManagementSlice.reducer;
