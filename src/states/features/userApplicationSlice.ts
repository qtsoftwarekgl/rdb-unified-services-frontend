import { createSlice } from "@reduxjs/toolkit";

export const userApplicationsSlice = createSlice({
  name: "userApplications",
  initialState: {
    user_applications:
      JSON.parse(String(localStorage.getItem("user_applications"))) || [],
    addReviewCommentsModal: false,
    listReviewCommentsModal: false,
    applicationReviewComments:
      JSON.parse(String(localStorage.getItem("applicationReviewComments"))) ||
      [],
    userReviewTabCommentsModal: false,
    userReviewStepCommentModal: false,
    userReviewComments: [],
    approveApplicationModal: false,
    selectedApplication: null,
    applicationReviewComment: {},
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
        "user_applications",
        JSON.stringify(state.user_applications)
      );
    },

    // SET ACTION COMMENTS
    setApplicationReviewComments: (state, action) => {
      state.applicationReviewComments = action.payload;
      localStorage.setItem(
        "applicationReviewComments",
        JSON.stringify(state.applicationReviewComments)
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
      const updatedComments = [...state.applicationReviewComments];
      const commentIndex = updatedComments?.findIndex(
        (comment) =>
          comment?.step?.name === action.payload?.step?.name &&
          comment?.entry_id === action.payload?.entry_id
      );
      if (commentIndex !== -1) {
        updatedComments[commentIndex] = action.payload;
        state.applicationReviewComments = updatedComments;
        localStorage.setItem(
          "applicationReviewComments",
          JSON.stringify(updatedComments)
        );
      }
    },

    // UPDATE USER REVIEW COMMENT
    updateUserReviewComment: (state, action) => {
      const updatedComments = [...state.userReviewComments];
      const commentIndex = updatedComments?.findIndex(
        (comment) =>
          comment?.step?.name === action.payload?.step?.name &&
          comment?.entry_id === action.payload?.entry_id
      );
      if (commentIndex !== -1) {
        updatedComments[commentIndex] = action.payload;
        state.userReviewComments = updatedComments;
      }
    },

    // SET USER REVIEW COMMENTS MODAL
    setUserReviewTabCommentsModal: (state, action) => {
      state.userReviewTabCommentsModal = action.payload;
    },

    // SET USER REVIEW COMMENTS
    setUserReviewTabComments: (state, action) => {
      state.userReviewComments = action.payload;
    },

    // DELETE USER APPLICATION
    deleteUserApplication: (state, action) => {
      state.user_applications = state.user_applications.filter(
        (app) => app?.entry_id !== action.payload
      );
    },

    // SET APPROVE APPLICATION MODAL
    setApproveApplicationModal: (state, action) => {
      state.approveApplicationModal = action.payload;
    },

    // SET SELECTED APPLICATION
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload;
    },

    // SET USER REVIEW STEP COMMENTS MODAL
    setUserReviewStepCommentModal: (state, action) => {
      state.userReviewStepCommentModal = action.payload;
  },

  // SET APPLICATION
  setApplicationReviewComment: (state, action) => {
    state.applicationReviewComment = action.payload;
  },
},
});

export default userApplicationsSlice.reducer;

export const {
  setUserApplications,
  setAddReviewCommentsModal,
  setListReviewCommentsModal,
  setApplicationReviewComments,
  updateReviewComment,
  setUserReviewTabCommentsModal,
  setUserReviewTabComments,
  updateUserReviewComment,
  deleteUserApplication,
  setApproveApplicationModal,
  setSelectedApplication,
  setUserReviewStepCommentModal,
  setApplicationReviewComment,
} = userApplicationsSlice.actions;
