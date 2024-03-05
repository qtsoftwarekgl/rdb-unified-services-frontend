import { createSlice } from '@reduxjs/toolkit';

export const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    permissionsList: [],
    permission: {},
    addPermissionModal: false,
    selectedPermissions: [],
  },
  reducers: {
    setPermissionsList: (state, action) => {
      state.permissionsList = action.payload;
    },
    setPermission: (state, action) => {
      state.permission = action.payload;
    },
    setAddPermissionModal: (state, action) => {
      state.addPermissionModal = action.payload;
    },
    setSelectedPermissions: (state, action) => {
      state.selectedPermissions = action.payload;
    },
    updateSelectedPermissions: (state, action) => {
      state.selectedPermissions = [
        action.payload,
        ...state.selectedPermissions,
      ];
    },
  },
});

export default permissionSlice.reducer;

export const {
  setPermissionsList,
  setPermission,
  setAddPermissionModal,
  setSelectedPermissions,
  updateSelectedPermissions
} = permissionSlice.actions;
