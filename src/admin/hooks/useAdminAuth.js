import { useDispatch } from "react-redux";
import {
  useRefreshAdminMutation,
  useLoginAdminMutation,
  useLogoutAdminMutation,
} from "../features/auth/adminAuthApi";

import {
  setAdminFromRefresh,
  clearAdmin,
  setLoading,
} from "../features/auth/adminAuthSlice";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useAdminAuth = () => {
  const dispatch = useDispatch();

  const [refreshTrigger] = useRefreshAdminMutation();
  const [loginTrigger] = useLoginAdminMutation();
  const [logoutTrigger] = useLogoutAdminMutation();

  const navigate = useNavigate();

  const refreshAdmin = async () => {
    dispatch(setLoading(true));

    try {
      const res = await refreshTrigger().unwrap();

      if (res?.status === "success") {
        const roles = res?.data?.user?.roles || [];

        // prevent users with role 'user' from being set as admin
        const isUser =
          roles.length === 0 ||
          roles[0]?.roleId === 1 ||
          roles[0]?.role?.id === 1;

        if (isUser) {
          toast.error("Something went wrong!");
          dispatch(clearAdmin());
          return;
        }

        dispatch(
          setAdminFromRefresh({
            user: res.data.user,
            accessToken: res.accessToken,
          }),
        );
      } else {
        dispatch(clearAdmin());
      }
    } catch {
      dispatch(clearAdmin());
    }
  };

  const loginAdmin = async ({ email, password }) => {
    try {
      const res = await loginTrigger({ email, password }).unwrap();

      if (res.status === "success") {
        window.location.href = "/admin8yut91b9e22a/main";
        return true;
      }

      toast.error("Something went wrong!");
      return false;
    } catch (err) {
      const msg = err?.data?.message || "";

      if (msg.includes("email")) toast.error("Invalid email address!");
      else if (msg.includes("Password")) toast.error("Invalid credentials!");
      else toast.error("Something went wrong!");

      return false;
    }
  };

  const logoutAdmin = async () => {
    dispatch(setLoading(true));

    try {
      const res = await logoutTrigger().unwrap();

      if (res.status === "success") {
        dispatch(clearAdmin());
        navigate("/admin8yut91b9e22a/login", { replace: true });
        return;
      }

      toast.error("Logout failed!");
    } catch (err) {
      toast.error("Logout failed!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    refreshAdmin,
    loginAdmin,
    logoutAdmin,
  };
};
