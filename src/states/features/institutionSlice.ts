import { createSlice } from '@reduxjs/toolkit';

export const institutionSlice = createSlice({
  name: 'institution',
  initialState: {
    institutionsList: [],
    institution: {},
    addInstitutionModal: false,
    editInstitutionModal: false,
  },
  reducers: {
    setInstitutionsList: (state, action) => {
      state.institutionsList = action.payload;
    },
    setInstitution: (state, action) => {
      state.institution = action.payload;
    },
    setAddInstitutionModal: (state, action) => {
      state.addInstitutionModal = action.payload;
    },
    updateInstitutionsList: (state, action) => {
        state.institutionsList = [action.payload, ...state.institutionsList];
    },
    setEditInstitutionModal: (state, action) => {
      state.editInstitutionModal = action.payload;
    }
  },
});

export default institutionSlice.reducer;

export const { setInstitutionsList, setInstitution, setAddInstitutionModal, updateInstitutionsList, setEditInstitutionModal } =
  institutionSlice.actions;
