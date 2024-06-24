import { PersonDetail } from "@/types/models/personDetail";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  boardMemberList: PersonDetail[];
  selectedBoardMember: PersonDetail;
} = {
  boardMemberList: [],
  selectedBoardMember: {} as PersonDetail,
};

export const boardOfDirectorSlice = createSlice({
  name: "boardOfDirector",
  initialState,
  reducers: {
    setBoardOfDirectorsList: (state, action) => {
      state.boardMemberList = action.payload;
    },
    setSelectedBoardPerson: (state, action) => {
      state.selectedBoardMember = action.payload;
    },
    addBoardMember: (state, action) => {
      state.boardMemberList = [action.payload, ...state.boardMemberList];
    },
    removeBoardMember: (state, action) => {
      state.boardMemberList = state.boardMemberList.filter(
        (person: PersonDetail) => person.id !== action.payload
      );
    },
  },
});

export const {
  setBoardOfDirectorsList,
  setSelectedBoardPerson,
  addBoardMember,
  removeBoardMember,
} = boardOfDirectorSlice.actions;

export default boardOfDirectorSlice.reducer;
