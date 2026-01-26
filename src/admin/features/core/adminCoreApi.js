import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "../../../api";

// Define a service using a base URL and expected endpoints
export const adminCoreApi = createApi({
  reducerPath: "adminCoreApi",

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
    // endpoint to get overview statistics
    getOverviewStatistics: builder.query({
      query: () => "/stats/overview",
    }),

    // endpoint to get recent activity
    getRecentActivity: builder.query({
      query: ({ limit = 5, cursor } = {}) => ({
        url: "/stats/activity",
        params: {
          limit,
          cursor,
        },
      }),
    }),

    // endpoint to get all users with filters
    getAllUsers: builder.query({
      query: ({ q = "", page = 1, limit = 10, status = "", plan } = {}) => ({
        url: "/users",
        params: {
          q,
          page,
          limit,
          status,
          plan,
        },
      }),
    }),

    // endpoint to get suspended users with filters
    getSuspendedUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/users/suspended",
        params: {
          page,
          limit,
        },
      }),
    }),
  }),
});

export const {
  useGetOverviewStatisticsQuery,
  useGetRecentActivityQuery,
  useGetAllUsersQuery,
  useGetSuspendedUsersQuery,
} = adminCoreApi;
