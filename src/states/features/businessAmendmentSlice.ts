import { BusinessAmendment } from '@/types/models/business';
import { BusinessAmendmentReviewComment } from '@/types/models/businessReviewComment';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  userBusinessAmendmentsList: BusinessAmendment[];
  selectedBusinessAmendment?: BusinessAmendment;
  amendmentReviewCommentsList: BusinessAmendmentReviewComment[];
  selectedAmendmentReviewComment?: BusinessAmendmentReviewComment;
  updateAmendmentReviewCommentModal: boolean;
} = {
  userBusinessAmendmentsList: [],
  selectedBusinessAmendment: undefined,
  amendmentReviewCommentsList: [],
  selectedAmendmentReviewComment: undefined,
  updateAmendmentReviewCommentModal: false,
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
    setSelectedAmendmentReviewComment: (state, action) => {
      state.selectedAmendmentReviewComment = action.payload;
    },
    setAmendmentReviewCommentsList: (state, action) => {
      state.amendmentReviewCommentsList = action.payload;
    },
    setUpdateAmendmentReviewCommentModal: (state, action) => {
      state.updateAmendmentReviewCommentModal = action.payload;
    },
    updateAmendmentReviewComment: (state, action) => {
      state.amendmentReviewCommentsList = state.amendmentReviewCommentsList.map(
        (reviewComment) => {
          if (reviewComment.id === action?.payload?.id) {
            return action.payload;
          }
          return reviewComment;
        }
      );
    },
    updateUserBusinessAmendment: (state, action) => {
      state.userBusinessAmendmentsList = state.userBusinessAmendmentsList.map(
        (businessAmendment) => {
          if (businessAmendment.id === action?.payload?.id) {
            return action.payload;
          }
          return businessAmendment;
        }
      );
    }
  },
});

export const {
  setUserBusinessAmendmentsList,
  setSelectedBusinessAmendment,
  addToUserBusinessAmendmentsList,
  removeFromUserBusinessAmendmentsList,
  setSelectedAmendmentReviewComment,
  setAmendmentReviewCommentsList,
  setUpdateAmendmentReviewCommentModal,
  updateAmendmentReviewComment,
  updateUserBusinessAmendment,
} = businessAmendmentSlice.actions;

export default businessAmendmentSlice.reducer;
