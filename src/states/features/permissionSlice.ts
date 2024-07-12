import { createSlice } from "@reduxjs/toolkit";
import { Permission } from "@/types/models/permission";

const initialState: {
  permissionsList: Permission[];
  permission?: Permission;
  selectedPermissions: Permission[];
  listPermissionsModal: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
} = {
  permissionsList: [],
  selectedPermissions: [],
  permission: undefined,
  listPermissionsModal: false,
  page: 1,
  size: 100,
  totalElements: 0,
  totalPages: 1,
};

export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissionsList: (state, action) => {
      state.permissionsList = action.payload;
    },
    setPermission: (state, action) => {
      state.permission = action.payload;
    },
    setListPermissionsModal: (state, action) => {
      state.listPermissionsModal = action.payload;
    },
    setTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setSelectedPermissions: (state, action) => {
      state.selectedPermissions = action.payload;
    },
    removeFromSelectedPermissions: (state, action) => {
      state.selectedPermissions = state.selectedPermissions.filter(
        (permission) => permission?.id !== action.payload?.id
      );
    },
    addToSelectedPermissions: (state, action) => {
      state.selectedPermissions = [
        ...state.selectedPermissions,
        action.payload,
      ];
    }
  },
});

export default permissionSlice.reducer;

export const {
  setPermissionsList,
  setPermission,
  setListPermissionsModal,
  setTotalElements,
  setTotalPages,
  setPage,
  setSize,
  setSelectedPermissions,
  removeFromSelectedPermissions,
  addToSelectedPermissions,
} = permissionSlice.actions;
