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
  }),
});

export const { useGetOverviewStatisticsQuery, useGetRecentActivityQuery } =
  adminCoreApi;
