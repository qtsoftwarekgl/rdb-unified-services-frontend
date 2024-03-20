import { createSlice } from '@reduxjs/toolkit';

export const userApplicationsSlice = createSlice({
  name: 'userApplications',
  initialState: {
    user_applications:
      JSON.parse(String(localStorage.getItem('user_applications'))) || [],
    user_uncompleted_applications:
      JSON.parse(
        String(localStorage.getItem('user_uncompleted_applications'))
      ) || [],
    addReviewCommentsModal: false,
    listReviewCommentsModal: false,
    application_review_comments:
      JSON.parse(String(localStorage.getItem('application_review_comments'))) ||
      [],
  },
  reducers: {
    // SET USER APPLICATIONS
    setUserApplications: (state, action) => {
      // create user application entry if not exist
      const userApplicationIndex = state.user_applications?.findIndex(
        (app) => app?.entry_id === action?.payload?.entry_id
      );

      if (userApplicationIndex === -1)
        state.user_applications = [...state.user_applications, action.payload];
      else
        state.user_applications[userApplicationIndex] = {
          ...state.user_applications[userApplicationIndex],
          ...action.payload,
        };

      localStorage.setItem(
        'user_applications',
        JSON.stringify(state.user_applications)
      );
    },

    // SET ACTION COMMENTS
    setApplicationReviewComments: (state, action) => {
      state.application_review_comments = action.payload;
      localStorage.setItem(
        'application_review_comments',
        JSON.stringify(state.application_review_comments)
      );
    },

    // SET LIST COMMENTS MODAL
    setListReviewCommentsModal: (state, action) => {
      state.listReviewCommentsModal = action.payload;
    },

    // SET REVIEW COMMENTS MODAL
    setAddReviewCommentsModal: (state, action) => {
      state.addReviewCommentsModal = action.payload;
    },

    // UPDATE REVIEW COMMENT
    updateReviewComment: (state, action) => {
      const updatedComments = [...state.application_review_comments];
      const commentIndex = updatedComments?.findIndex(
        (comment) =>
          comment?.step?.name === action.payload?.step?.name &&
          comment?.entry_id === action.payload?.entry_id
      );
      if (commentIndex !== -1) {
        updatedComments[commentIndex] = action.payload;
        state.application_review_comments = updatedComments;
        localStorage.setItem(
          'application_review_comments',
          JSON.stringify(state.application_review_comments)
        );
      }
    },
  },
});

export default userApplicationsSlice.reducer;

export const {
  setUserApplications,
  setAddReviewCommentsModal,
  setListReviewCommentsModal,
  setApplicationReviewComments,
  updateReviewComment
} = userApplicationsSlice.actions;
