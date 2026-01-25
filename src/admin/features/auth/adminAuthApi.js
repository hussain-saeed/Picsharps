import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../../../api";

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().adminAuth.accessToken;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    refreshAdmin: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        body: {},
      }),
    }),

    loginAdmin: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),

    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRefreshAdminMutation,
  useLoginAdminMutation,
  useLogoutAdminMutation,
} = adminAuthApi;
