import { BusinessAmendment } from '@/types/models/business';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  userBusinessAmendmentsList: BusinessAmendment[];
  selectedBusinessAmendment?: BusinessAmendment;
} = {
  userBusinessAmendmentsList: [],
  selectedBusinessAmendment: undefined,
};

const businessAmendmentSlice = createSlice({
  name: 'businessAmendment',
  initialState,
  reducers: {
    setUserBusinessAmendmentsList: (state, action) => {
      state.userBusinessAmendmentsList = action.payload;
    },
    setSelectedBusinessAmendment: (state, action) => {
      state.selectedBusinessAmendment = action.payload;
    },
    addToUserBusinessAmendmentsList: (state, action) => {
      state.userBusinessAmendmentsList = [
        action.payload,
        ...state.userBusinessAmendmentsList,
      ];
    },
    removeFromUserBusinessAmendmentsList: (state, action) => {
      state.userBusinessAmendmentsList =
        state.userBusinessAmendmentsList.filter(
          (businessAmendment) => businessAmendment.id !== action.payload
        );
    },
  },
});

export const {
  setUserBusinessAmendmentsList,
  setSelectedBusinessAmendment,
  addToUserBusinessAmendmentsList,
  removeFromUserBusinessAmendmentsList,
} = businessAmendmentSlice.actions;

export default businessAmendmentSlice.reducer;
