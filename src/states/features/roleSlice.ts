import { createSlice } from '@reduxjs/toolkit';

export const roleSlice = createSlice({
  name: 'role',
  initialState: {
    rolesList: [],
    role: {},
    addRoleModal: false,
  },
  reducers: {
    setRolesList: (state, action) => {
      state.rolesList = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setAddRoleModal: (state, action) => {
      state.addRoleModal = action.payload;
    },
  },
});

export default roleSlice.reducer;

export const { setRolesList, setRole, setAddRoleModal } = roleSlice.actions;
