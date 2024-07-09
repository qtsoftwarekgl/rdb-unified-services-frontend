import { createApi } from '@reduxjs/toolkit/query/react';
import { coreBaseQueryWithReauth } from './rootApiSlice';

export const coreApiSlice = createApi({
  reducerPath: 'coreApi',
  baseQuery: coreBaseQueryWithReauth,
  endpoints: (builder) => {
    return {
      // GET USER INFO
      getUserInformation: builder.query({
        query: ({ documentNumber }) =>
          `/user-info?documentNumber=${documentNumber}`,
      }),
    };
  },
});

export const { useLazyGetUserInformationQuery } = coreApiSlice;

export default coreApiSlice;
