import { PersonAttachment } from '@/types/models/attachment';
import { PersonDetail } from '@/types/models/personDetail';
import { UserInformation } from '@/types/models/userInformation';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import businessExternalServiceApiSlice from '../api/businessExternalServiceApiSlice';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';

const initialState: {
  businessPeopleList: PersonDetail[];
  selectedBusinessPerson?: PersonDetail;
  businessPersonAttachments: PersonAttachment[];
  userInformation?: UserInformation;
  businessPersonDetailsModal: boolean;
  businessPerson?: PersonDetail;
  deleteBusinessPersonModal: boolean;
  userInformationIsFetching: boolean;
  userInformationIsSuccess: boolean;
} = {
  businessPeopleList: [],
  selectedBusinessPerson: undefined,
  businessPersonAttachments: [],
  userInformation: undefined,
  businessPersonDetailsModal: false,
  businessPerson: undefined,
  deleteBusinessPersonModal: false,
  userInformationIsFetching: false,
  userInformationIsSuccess: false,
};

// GET USER INFORMATION THUNK
export const getUserInformationThunk = createAsyncThunk<UserInformation, {
  documentNumber: string}, { dispatch: AppDispatch }
  >(
  'businessPeople/getUserInformation',
  async ({ documentNumber }, { dispatch }) => {
    try {
      const response = await dispatch(
        businessExternalServiceApiSlice.endpoints.getUserInformation.initiate({
          documentNumber,
        })
      );
      return response.data?.data;
    } catch (error) {
      toast.error('Failed to get user information. Refresh and try again');
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(getUserInformationThunk.fulfilled, (state, action) => {
      state.userInformation = action.payload;
      state.userInformationIsFetching = false;
      state.userInformationIsSuccess = true;
    });
    builder.addCase(getUserInformationThunk.pending, (state) => {
      state.userInformationIsFetching = true;
      state.userInformationIsSuccess = false;
    });
    builder.addCase(getUserInformationThunk.rejected, (state) => {
      state.userInformationIsFetching = false;
      state.userInformationIsSuccess = false;
    });
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
