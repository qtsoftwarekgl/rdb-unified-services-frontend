import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  file: null,
  fileName: "",
  attachmentType: "",
};

const resolutionAttachmentSlice = createSlice({
  name: "resolutionAttachment",
  initialState,
  reducers: {
    setResolutionAttachment: (state, action) => {
      state.file = action.payload.file;
      state.fileName = action.payload.fileName;
      state.attachmentType = action.payload.attachmentType;
    },
  },
});

export default resolutionAttachmentSlice.reducer;
export const { setResolutionAttachment } = resolutionAttachmentSlice.actions;
