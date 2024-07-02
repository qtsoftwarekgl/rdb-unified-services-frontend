import { PersonAttachment } from '@/types/models/attachment';
import { PersonDetail } from '@/types/models/personDetail';
import { UserInformation } from '@/types/models/userInformation';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  businessPeopleList: PersonDetail[];
  selectedBusinessPerson?: PersonDetail;
  businessPersonAttachments: PersonAttachment[];
  userInformation?: UserInformation;
  businessPersonDetailsModal: boolean;
  businessPerson?: PersonDetail;
  deleteBusinessPersonModal: boolean;
} = {
  businessPeopleList: [],
  selectedBusinessPerson: undefined,
  businessPersonAttachments: [],
  userInformation: undefined,
  businessPersonDetailsModal: false,
  businessPerson: undefined,
  deleteBusinessPersonModal: false,
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
      state.businessPeopleList = [action.payload, ...state.businessPeopleList];
    },
    removeBusinessPerson: (state, action) => {
      state.businessPeopleList = state.businessPeopleList.filter(
        (person: PersonDetail) => person.id !== action.payload
      );
    },
    setBusinessPersonAttachments: (state, action) => {
      state.businessPersonAttachments = action.payload;
    },
    addBusinessPersonAttachment: (state, action) => {
      state.businessPersonAttachments = [
        action.payload,
        ...state.businessPersonAttachments,
      ];
    },
    removeBusinessPersonAttachment: (state, action) => {
      state.businessPersonAttachments = state.businessPersonAttachments.filter(
        (attachment: PersonAttachment) => attachment.id !== action.payload
      );
    },
    setUserInformation: (state, action) => {
      state.userInformation = action.payload;
    },
    setBusinessPersonDetailsModal: (state, action) => {
      state.businessPersonDetailsModal = action.payload;
    },
    setBusinessPerson: (state, action) => {
      state.businessPerson = action.payload;
    },
    setDeleteBusinessPersonModal: (state, action) => {
      state.deleteBusinessPersonModal = action.payload;
    },
  },
});

export const {
  setBusinessPeopleList,
  setSelectedBusinessPerson,
  addBusinessPerson,
  removeBusinessPerson,
  setBusinessPersonAttachments,
  addBusinessPersonAttachment,
  removeBusinessPersonAttachment,
  setUserInformation,
  setBusinessPersonDetailsModal,
  setBusinessPerson,
  setDeleteBusinessPersonModal,
} = businessPeopleSlice.actions;

export default businessPeopleSlice.reducer;
