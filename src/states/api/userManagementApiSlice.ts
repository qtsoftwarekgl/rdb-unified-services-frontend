import {
  userManagementApi,
} from "@/constants/environments";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import store from "store";

export const userManagementApiSlice = createApi({
  reducerPath: "userManagementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${userManagementApi}`,
    prepareHeaders: (headers) => {
      const user = store.get("user");
      if (user?.token) {
        headers.set("authorization", `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      // UPLOAD USER ATTACHMENT
      uploadUserAttachment: builder.mutation({
        query: ({ formData }) => {
          return {
            url: `/attachment/users`,
            method: "POST",
            body: formData,
            formData: true,
          };
        },
      }),

      // FETCH USER ATTACHMENTS
      fetchUserAttachments: builder.query({
        query: ({ userId }) => {
          return {
            url: `/attachment/users?userId=${userId}`,
          };
        },
      }),

      // DELETE USER ATTACHMENT
      deleteUserAttachment: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/attachment/users/${id}`,
            method: "DELETE",
          };
        },
      }),

      // FETCH ROLES
      fetchRoles: builder.query({
        query: ({ page, size, state, searchKey }) => {
          let url = `/roles?page=${page}&size=${size}`;
          if (state) {
            url += `&state=${state}`;
          }
          if (searchKey) {
            url += `&searchKey=${searchKey}`;
          }
          return {
            url,
          };
        },
      }),

      // FETCH PERMISSIONS
      fetchPermissions: builder.query({
        query: ({ page, size, searchKey, roleId }) => {
          let url = `/permissions?page=${page}&size=${size}`;
          if (searchKey) {
            url += `&searchKey=${searchKey}`;
          }
          if (roleId) {
            url += `&roleId=${roleId}`;
          }
          return {
            url,
          };
        },
      }),

      // DISABLE ROLE
      disableRole: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/roles/${id}/disable`,
            method: "PATCH",
          };
        },
      }),

      // CREATE ROLE
      createRole: builder.mutation({
        query: ({ roleName, description, permissions }) => {
          return {
            url: `/roles`,
            method: "POST",
            body: {
              roleName,
              description,
              permissions,
            },
          };
        },
      }),
      // EDIT ROLE
      editRole: builder.mutation({
        query: ({ id, roleName, description, permissions }) => {
          return {
            url: `/roles/${id}`,
            method: "PATCH",
            body: {
              roleName,
              description,
              permissions,
            },
          };
        },
      }),

      // FETCH USERS
      fetchUsers: builder.query({
        query: ({ page, size, searchKey, state, userType, isLocked }) => {
          let url = `/users?page=${page}&size=${size}`;
          if (searchKey) {
            url += `&searchKey=${searchKey}`;
          }
          if (state) {
            url += `&state=${state}`;
          }
          if (userType) {
            url += `&userType=${userType}`;
          }
          if (isLocked) {
            url += `&isLocked=${isLocked}`;
          }
          return {
            url,
          };
        },
      }),
      // GET USER
      getUser: builder.query({
        query: ({ id }) => {
          return {
            url: `/users/${id}`,
          };
        },
      }),

      // ASSIGN ROLES
      assignRoles: builder.mutation({
        query: ({ userId, roleIds }) => {
          return {
            url: `/users/assign-role`,
            method: 'PATCH',
            body: {
              userId,
              roleIds,
            },
          };
        },
      }),

      // UPDATE NOTIFICATION PREFERENCES
      updateNotificationPreferences: builder.mutation({
        query: ({ notificationPreference }) => {
          return {
            url: `/users/update-notification-preferences/${notificationPreference}`,
            method: 'PATCH',
          };
        },
      }),
    };
  },
});

export const {
  useUploadUserAttachmentMutation,
  useLazyFetchUserAttachmentsQuery,
  useDeleteUserAttachmentMutation,
  useLazyFetchRolesQuery,
  useLazyFetchPermissionsQuery,
  useDisableRoleMutation,
  useCreateRoleMutation,
  useEditRoleMutation,
  useLazyFetchUsersQuery,
  useLazyGetUserQuery,
  useAssignRolesMutation,
  useUpdateNotificationPreferencesMutation,
} = userManagementApiSlice;

export default userManagementApiSlice;
