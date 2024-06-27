import { PersonDetail } from "@/types/models/personDetail";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  executiveManagersList: PersonDetail[];
  selectedExecutiveManager?: PersonDetail;
} = {
  executiveManagersList: [],
  selectedExecutiveManager: undefined,
};

export const executiveManagersSlice = createSlice({
  name: "executiveManagers",
  initialState,
  reducers: {
    setExecutiveManagersList: (state, action) => {
      state.executiveManagersList = action.payload;
    },
    setSelectedManagerPerson: (state, action) => {
      state.selectedExecutiveManager = action.payload;
    },
    addExecutiveManager: (state, action) => {
      state.executiveManagersList = [
        action.payload,
        ...state.executiveManagersList,
      ];
    },
    removeExecutiveManager: (state, action) => {
      state.executiveManagersList = state.executiveManagersList.filter(
        (person: PersonDetail) => person.id !== action.payload
      );
    },
  },
});

export const {
  setExecutiveManagersList,
  setSelectedManagerPerson,
  addExecutiveManager,
  removeExecutiveManager,
} = executiveManagersSlice.actions;

export default executiveManagersSlice.reducer;
