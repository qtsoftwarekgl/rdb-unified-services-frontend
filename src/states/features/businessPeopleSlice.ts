import {
  BusinessAttachment,
  PersonAttachment,
} from "@/types/models/attachment";
import { PersonDetail } from "@/types/models/personDetail";
import { UserInformation } from "@/types/models/userInformation";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  businessPeopleList: PersonDetail[];
  selectedBusinessPerson?: PersonDetail;
  businessPeopleAttachments: PersonAttachment[];
  businessAttachments: BusinessAttachment[];
  userInformation?: UserInformation;
} = {
  businessPeopleList: [],
  selectedBusinessPerson: undefined,
  businessPeopleAttachments: [],
  businessAttachments: [],
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
    setBusinessAttachments: (state, action) => {
      state.businessAttachments = action.payload;
    },
    addBusinessAttachment: (state, action) => {
      state.businessAttachments = [
        action.payload,
        ...state.businessAttachments,
      ];
    },
    removeBusinessPersonAttachment: (state, action) => {
      state.businessPeopleAttachments = state.businessPeopleAttachments.filter(
        (attachment: PersonAttachment) => attachment.id !== action.payload
      );
    },
    setUserInformation: (state, action) => {
      state.userInformation = action.payload;
    },
  },
});

export const {
  setBusinessPeopleList,
  setSelectedBusinessPerson,
  addBusinessPerson,
  removeBusinessPerson,
  setBusinessPeopleAttachments,
  addBusinessPersonAttachment,
  setBusinessAttachments,
  addBusinessAttachment,
  removeBusinessPersonAttachment,
  setUserInformation,
} = businessPeopleSlice.actions;

export default businessPeopleSlice.reducer;
