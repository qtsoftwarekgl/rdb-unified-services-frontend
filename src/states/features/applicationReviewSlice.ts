import { createSlice } from "@reduxjs/toolkit";

export const applicationReviewSlice = createSlice({
    name: "applicationReview",
    initialState: {
        applicationReview: null,
        applicationReviewStepName: null,
        applicationReviewTabName: null,
    },
    reducers: {
        setApplicationReview: (state, action) => {
        state.applicationReview = action.payload;
        },
        setApplicationReviewStepName: (state, action) => {
        state.applicationReviewStepName = action.payload;
        },
        setApplicationReviewTabName: (state, action) => {
        state.applicationReviewTabName = action.payload;
        }
    },
});

export const { setApplicationReview, setApplicationReviewStepName, setApplicationReviewTabName } = applicationReviewSlice.actions;

export default applicationReviewSlice.reducer;
