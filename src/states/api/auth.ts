import { rootApi } from "./api";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: "/users/auth/login",
          method: "POST",
          body: { email, password },
        }),
      }),
    };
  },
});

export const { useLoginMutation } = authApi;
