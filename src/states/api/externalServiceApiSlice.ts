import store from "store";
import { businessRegLocalApi } from "@/constants/environments";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const externalServiceApiSlice = createApi({
  reducerPath: "businessRegUatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: businessRegLocalApi,
    prepareHeaders: (headers) => {
      const user = store.get("user");
      if (user) {
        headers.set("authorization", `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
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

export const { useLazyGetUserInformationQuery } = externalServiceApiSlice;

export default externalServiceApiSlice;
