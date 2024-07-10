import { User } from '@/types/models/user';
import { createSlice } from '@reduxjs/toolkit';
import store from 'store';

const initialState: {
  token?: string;
  user?: User;
  selectedUser?: User;
  usersList: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  viewUserDetailsModal: boolean;
  userProfile?: User;
} = {
  token: store.get('token'),
  user: store.get('user'),
  usersList: [],
  page: 1,
  size: 10,
  totalElements: 0,
  totalPages: 1,
  selectedUser: undefined,
  viewUserDetailsModal: false,
  userProfile: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      store.set('user', action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      store.set('token', action.payload);
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setViewUserDetailsModal: (state, action) => {
      state.viewUserDetailsModal = action.payload;
    },
    updateUser: (state, action) => {
      state.usersList = state.usersList.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    }
  },
});

export default userSlice.reducer;

export const {
  setUser,
  setToken,
  setUsersList,
  setSelectedUser,
  setPage,
  setSize,
  setTotalElements,
  setTotalPages,
  setViewUserDetailsModal,
  updateUser,
  setUserProfile,
} = userSlice.actions;
