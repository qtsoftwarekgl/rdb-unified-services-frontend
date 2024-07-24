import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setToken, setUser } from "../features/userSlice";
import store from "store";
import { businessRegApi } from "@/constants/environments";
import { toast } from "react-toastify";

const prepareHeaders = (headers: Headers) => {
  const user = store.get("user");
  if (user) {
    headers.set("authorization", `Bearer ${user.token}`);
  }
  return headers;
};

export const businessRegBaseQuery = fetchBaseQuery({
  baseUrl: `${businessRegApi}`,
  prepareHeaders,
});

export const businessBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await businessRegBaseQuery(args, api, extraOptions);
  if (result.error) {
    if ([403, 401].includes(Number(result?.error?.status))) {
      api.dispatch(setToken(''));
      api.dispatch(setUser({}));
      window.location.href = '/auth/login';
    } else if (Number(result?.error?.status) === 500) {
      toast.info(
        'Please refresh and try again'
      );
    }
  }

  return result;
};
