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

    getCountriesVisits: builder.query({
      query: () => `/stats/visitors/by-country`,
    }),

    getCountriesLogins: builder.query({
      query: () => `/stats/users-by-country`,
    }),

    // endpoint to get user growth statistics
    getUserGrowth: builder.query({
      query: (period = "30d") => `/stats/growth?period=${period}`,
    }),

    // endpoint to get revenue statistics
    getRevenue: builder.query({
      query: () => `/stats/revenue-share`,
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
      providesTags: ["AllUsers"],
    }),

    // endpoint to get suspended users
    getSuspendedUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/users/suspended",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["SuspendedUsers"],
    }),

    // endpoint to suspend a user
    suspendUser: builder.mutation({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/suspend`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AllUsers", "SuspendedUsers"],
    }),

    // endpoint to reactivate a suspended user
    reactivateUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: ["AllUsers", "SuspendedUsers"],
    }),

    // endpoint to notify a user
    notifyUser: builder.mutation({
      query: ({ userId, body }) => ({
        url: `/users/${userId}/notify`,
        method: "POST",
        body,
      }),
    }),

    // endpoint to delete a user
    deleteUser: builder.mutation({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["AllUsers", "SuspendedUsers"],
    }),

    // endpoint to get plans
    getPlans: builder.query({
      query: () => "/plans",
      providesTags: ["Plans"],
    }),

    // endpoint to update a plan
    updatePlan: builder.mutation({
      query: ({ code, body }) => ({
        url: `/plans/${code}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Plans", "AllUsers"],
    }),

    // endpoint to get settings
    getSettings: builder.query({
      query: () => "/settings/general",
      providesTags: ["Settings"],
    }),

    // endpoint to update settings
    updateSettings: builder.mutation({
      query: ({ body }) => ({
        url: `/settings/general`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetOverviewStatisticsQuery,
  useGetCountriesVisitsQuery,
  useGetCountriesLoginsQuery,
  useGetUserGrowthQuery,
  useGetRevenueQuery,
  useGetRecentActivityQuery,
  useGetAllUsersQuery,
  useGetSuspendedUsersQuery,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useNotifyUserMutation,
  useDeleteUserMutation,
  useGetPlansQuery,
  useUpdatePlanMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = adminCoreApi;
