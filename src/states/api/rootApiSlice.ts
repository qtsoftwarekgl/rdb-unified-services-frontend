import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setToken, setUser } from "../features/userSlice";
import store from "store";
import { businessRegLocalApi } from "@/constants/environments";
import { toast } from "react-toastify";

const prepareHeaders = (headers: Headers) => {
  const user = store.get("user");
  if (user) {
    headers.set("authorization", `Bearer ${user.token}`);
  }
  return headers;
};

export const businessBaseQuery = fetchBaseQuery({
  baseUrl: `${businessRegLocalApi}/business`,
  prepareHeaders,
});

export const coreBaseQuery = fetchBaseQuery({
  baseUrl: `${businessRegLocalApi}`,
  prepareHeaders,
});

const redirectToLogin = () => {
  window.location.href = "/auth/login";
};

export const coreBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await coreBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    // Token has expired or is invalid, logout user
    console.log("Token has expired or is invalid, logout user");
    api.dispatch(setToken(""));
    api.dispatch(setUser({}));
    redirectToLogin();
  }

  return result;
};

export const businessBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await businessBaseQuery(args, api, extraOptions);
  if (result.error) {
    if ([403, 401].includes(Number(result?.error?.status))) {
      api.dispatch(setToken(''));
      api.dispatch(setUser({}));
    } else if (Number(result?.error?.status) === 500) {
      toast.error(
        'An error occurred on our side. Please refresh and try again'
      );
    }
  }

  return result;
};
