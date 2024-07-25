import { createApi } from "@reduxjs/toolkit/query/react";
import { userManagementBaseQueryWithReauth } from "./rootApiSlice";

export const userManagementApiSlice = createApi({
  reducerPath: "userManagementApi",
  baseQuery: userManagementBaseQueryWithReauth,
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
            method: "GET",
          };
        },
      }),

      // FETCH PERMISSIONS
      fetchPermissions: builder.mutation({
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

      // ENABLE ROLE
      enableRole: builder.mutation({
        query: ({ id }) => {
          return {
            url: `/roles/${id}/enable`,
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
          let url = `/?page=${page}&size=${size}`;
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
            url: `/${id}`,
          };
        },
      }),

      // ASSIGN ROLES
      assignRoles: builder.mutation({
        query: ({ userId, roleIds }) => {
          return {
            url: `/assign-role`,
            method: "PATCH",
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
            url: `/update-notification-preferences/${notificationPreference}`,
            method: "PATCH",
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
  useFetchPermissionsMutation,
  useDisableRoleMutation,
  useCreateRoleMutation,
  useEditRoleMutation,
  useLazyFetchUsersQuery,
  useLazyGetUserQuery,
  useAssignRolesMutation,
  useUpdateNotificationPreferencesMutation,
  useEnableRoleMutation,
} = userManagementApiSlice;

export default userManagementApiSlice;
