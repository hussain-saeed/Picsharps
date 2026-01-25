import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  accessToken: null,
  isLoading: true,
  roles: [],
};

// convert role IDs to role names
const detectAdminRoles = (roles = []) => {
  const ids = roles.map((r) => r.roleId || r.role?.id);
  const result = [];

  if (ids.includes(2)) result.push("superadmin");
  // if (ids.includes(3)) result.push("moderator");
  // if (ids.includes(4)) result.push("editor");

  if (result.length === 0) result.push("admin"); // default

  return result;
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,

  reducers: {
    clearAdmin(state) {
      state.admin = null;
      state.accessToken = null;
      state.role = null;
      state.isLoading = false;
    },

    setAdminFromRefresh(state, action) {
      const { user, accessToken } = action.payload;

      state.admin = user;
      state.accessToken = accessToken;
      state.roles = detectAdminRoles(user.roles || []);
      state.isLoading = false;
    },

    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { clearAdmin, setAdminFromRefresh, setLoading } =
  adminAuthSlice.actions;

export default adminAuthSlice.reducer;
