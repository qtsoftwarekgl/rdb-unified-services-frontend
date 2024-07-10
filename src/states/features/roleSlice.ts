import { Role } from "@/types/models/role";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  rolesList: Role[];
  role?: Role;
  createRoleModal: boolean;
  updateRoleModal: boolean;
  disableRoleModal: boolean;
  rolePermissionsModal: boolean;
  assignRolesModal: boolean;
  selectedRole?: Role;
} = {
  rolesList: [],
  role: undefined,
  selectedRole: undefined,
  createRoleModal: false,
  updateRoleModal: false,
  disableRoleModal: false,
  rolePermissionsModal: false,
  assignRolesModal: false,
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRolesList: (state, action) => {
      state.rolesList = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    addRole: (state, action) => {
      state.rolesList = [action.payload, ...state.rolesList];
    },
    setCreateRoleModal: (state, action) => {
      state.createRoleModal = action.payload;
    },
    setUpdateRoleModal: (state, action) => {
      state.updateRoleModal = action.payload;
    },
    setDisableRoleModal: (state, action) => {
      state.disableRoleModal = action.payload;
    },
    setRolePermissionsModal: (state, action) => {
      state.rolePermissionsModal = action.payload;
    },
    setAssignRolesModal: (state, action) => {
      state.assignRolesModal = action.payload;
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
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    updateRole: (state, action) => {
      state.rolesList = state.rolesList.map((role) =>
        role.id === action.payload.id ? action.payload : role
      );
    },
  },
});

export default roleSlice.reducer;

export const {
  setRolesList,
  setRole,
  setCreateRoleModal,
  setUpdateRoleModal,
  setDisableRoleModal,
  setRolePermissionsModal,
  setAssignRolesModal,
  setTotalElements,
  setTotalPages,
  setPage,
  setSize,
  setSelectedRole,
  updateRole,
  addRole,
} = roleSlice.actions;
