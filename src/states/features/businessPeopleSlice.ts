import { PersonAttachment } from '@/types/models/personAttachment';
import { PersonDetail } from '@/types/models/personDetail';
import { UserInformation } from '@/types/models/userInformation';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  businessPeopleList: PersonDetail[];
  selectedBusinessPerson?: PersonDetail;
  businessPeopleAttachments: PersonAttachment[];
  userInformation?: UserInformation;
} = {
  businessPeopleList: [],
  selectedBusinessPerson: undefined,
  businessPeopleAttachments: [],
  userInformation: undefined,
};

export const businessPeopleSlice = createSlice({
  name: "businessPeople",
  initialState,
  reducers: {
    setBusinessPeopleList: (state, action) => {
      state.businessPeopleList = action.payload;
    },
    setSelectedBusinessPerson: (state, action) => {
      state.selectedBusinessPerson = action.payload;
    },
    addBusinessPerson: (state, action) => {
      state.businessPeopleList = [action.payload, ...state.businessPeopleList];
    },
    removeBusinessPerson: (state, action) => {
      state.businessPeopleList = state.businessPeopleList.filter(
        (person: PersonDetail) => person.id !== action.payload
      );
    },
    setBusinessPeopleAttachments: (state, action) => {
      state.businessPeopleAttachments = action.payload;
    },
    addBusinessPersonAttachment: (state, action) => {
      state.businessPeopleAttachments = [
        action.payload,
        ...state.businessPeopleAttachments,
      ];
    },
    removeBusinessPersonAttachment: (state, action) => {
      state.businessPeopleAttachments = state.businessPeopleAttachments.filter(
        (attachment: PersonAttachment) => attachment.id !== action.payload
      );
    },
    setUserInformation: (state, action) => {
      state.userInformation = action.payload;
    }
  },
});

export const {
  setBusinessPeopleList,
  setSelectedBusinessPerson,
  addBusinessPerson,
  removeBusinessPerson,
  setBusinessPeopleAttachments,
  addBusinessPersonAttachment,
  removeBusinessPersonAttachment,
  setUserInformation,
} = businessPeopleSlice.actions;

export default businessPeopleSlice.reducer;
