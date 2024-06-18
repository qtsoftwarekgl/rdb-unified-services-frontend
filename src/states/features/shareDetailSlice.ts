import { ShareDetail } from '@/types/models/shareDetail';
import { createSlice } from '@reduxjs/toolkit'

const initialState: {
    shareDetailsList: ShareDetail[],
    selectedShareDetail: ShareDetail,
} = {
    shareDetailsList: [],
    selectedShareDetail: {} as ShareDetail,
}

const shareDetailSlice = createSlice({
  name: 'shareDetail',
  initialState,
  reducers: {
    setShareDetailsList: (state, action) => {
      state.shareDetailsList = action.payload;
    },
    setSelectedShareDetail: (state, action) => {
      state.selectedShareDetail = action.payload;
    },
    addShareDetail: (state, action) => {
      state.shareDetailsList = [
        action.payload,
        ...state.shareDetailsList,
      ];
    },
    removeShareDetail: (state, action) => {
      state.shareDetailsList = state.shareDetailsList.filter(
        (shareDetail: ShareDetail) => shareDetail.id !== action.payload
      );
    }
  }
});

export const {
    setShareDetailsList,
    setSelectedShareDetail,
    addShareDetail,
    removeShareDetail
} = shareDetailSlice.actions

export default shareDetailSlice.reducer;
