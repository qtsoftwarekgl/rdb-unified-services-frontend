import {
  userManagementLocalApi,
  userManagementUatApi,
} from '@/constants/environments';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store';

export const userManagementApiSlice = createApi({
  reducerPath: 'userManagementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${userManagementLocalApi || userManagementUatApi}`,
    prepareHeaders: (headers) => {
      const user = store.get('user');
      if (user?.token) {
        headers.set('authorization', `Bearer ${user.token}`);
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
            method: 'POST',
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
            method: 'DELETE',
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
} = userManagementApiSlice;

export default userManagementApiSlice;
