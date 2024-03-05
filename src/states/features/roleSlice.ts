import { createSlice } from '@reduxjs/toolkit';

export const roleSlice = createSlice({
  name: 'role',
  initialState: {
    rolesList: [],
    role: {},
    addRoleModal: false,
    editRoleModal: false,
    deleteRoleModal: false,
    rolePermissionsModal: false,
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
    setEditRoleModal: (state, action) => {
      state.editRoleModal = action.payload;
    },
    setDeleteRoleModal: (state, action) => {
      state.deleteRoleModal = action.payload;
    },
    setRolePermissionsModal: (state, action) => {
      state.rolePermissionsModal = action.payload;
    },
  },
});

export default roleSlice.reducer;

export const { setRolesList, setRole, setAddRoleModal, setEditRoleModal, setDeleteRoleModal, setRolePermissionsModal } = roleSlice.actions;
