import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/auth/adminAuthSlice";
import { adminAuthApi } from "../features/auth/adminAuthApi";
import { adminCoreApi } from "../features/core/adminCoreApi";

export const adminStore = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,

    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [adminCoreApi.reducerPath]: adminCoreApi.reducer,
  },

  middleware: (gDM) =>
    gDM().concat(adminAuthApi.middleware, adminCoreApi.middleware),
});
