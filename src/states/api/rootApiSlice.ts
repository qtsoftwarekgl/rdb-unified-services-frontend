import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setToken, setUser } from "../features/userSlice";
import store from "store";

const prepareHeaders = (headers: Headers) => {
  const user = store.get("user");
  if (user) {
    headers.set("authorization", `Bearer ${user.token}`);
  }
  return headers;
};

export const businessBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_APP_BUSINESS_REG_LOCAL_API}/business`,
  prepareHeaders,
});

export const businessBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await businessBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    // Token has expired or is invalid, logout user
    api.dispatch(setToken(""));
    api.dispatch(setUser({}));
  }

  return result;
};
