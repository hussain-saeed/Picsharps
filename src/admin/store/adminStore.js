import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/auth/adminAuthSlice";
import { adminAuthApi } from "../features/auth/adminAuthApi";

export const adminStore = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
  },

  middleware: (gDM) => gDM().concat(adminAuthApi.middleware),
});
