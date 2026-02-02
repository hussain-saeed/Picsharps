import { useState } from "react";
import React, { useMemo } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControl,
  Pagination,
} from "@mui/material";
import {
  useGetAllUsersQuery,
  useGetPlansQuery,
} from "../../features/core/adminCoreApi";
import UserActionsMenu from "../../components/UserActionsMenu";
import SendNotificationModal from "./components/SendNotificationModal";
import SuspendUserModal from "./components/SuspendUserModal";
import DeleteUserModal from "../../components/DeleteUserModal";
import ReactivateUserModal from "../../components/ReactivateUserModal";
import { transformPlansBySlug } from "../../../utils/plansUtils";
import useGeneralModal from "../../hooks/useGeneralModal";
import GeneralModal from "../../components/GeneralModal";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { RiMore2Fill } from "react-icons/ri";

// List of status
const STATUS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

// سنقوم بإنشاء مكون مخصص نظيف تماماً
const SearchInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  padding: "2px 32px 2px 42px",
  height: "40px", // لضمان تساويه في الارتفاع مع Select size="small"
  transition: "0.3s",
  border: "1px solid rgb(235, 235, 235)",
  display: "flex",
  alignItems: "center",

  "&.Mui-focused": {
    border: "1px solid #00B0FF",
    boxShadow: "0px 0px 8px rgba(0, 176, 255, 0.4)",
    backgroundColor: "#f5f5f5",
  },
  "& input": {
    outline: "none !important",
    WebkitTapHighlightColor: "transparent",
  },
}));

const AllUsers = () => {
  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");

  const { isOpen, openModal, closeModal } = useGeneralModal();
  const [selectedItem, setSelectedItem] = useState(null);
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    openModal();
  };

  const [appliedFilters, setAppliedFilters] = useState({
    q: "",
    plan: "",
    status: "",
  });
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openNotify, setOpenNotify] = useState(false);
  const [openSuspend, setOpenSuspend] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openReactivate, setOpenReactivate] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  // ================= QUERY =================
  const { data, isFetching, isError } = useGetAllUsersQuery(
    {
      q: appliedFilters.q,
      plan: appliedFilters.plan,
      page,
      limit: 10,
      status: appliedFilters.status,
    },
    { keepUnusedDataFor: 300 },
  );
  console.log("Fetched data:", data);

  const { data: plansData } = useGetPlansQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  console.log("Fetched Plans Data:", plansData);

  const transformedPlans = useMemo(() => {
    if (plansData?.status !== "success") return [];
    return transformPlansBySlug(plansData?.data?.plans);
  }, [plansData]);

  // List of plans
  const PLANS = [
    { label: "All Plans", value: "" },
    { label: "Free", value: "free" },
    { label: transformedPlans[0]?.name, value: transformedPlans[0]?.name },
    { label: transformedPlans[1]?.name, value: transformedPlans[1]?.name },
  ];

  // ================= DERIVED DATA =================
  const hasData = data?.status === "success" && Array.isArray(data.data?.users);
  const users = hasData ? data.data.users : [];
  const pagination = hasData ? data.data.pagination : null;

  const isInitialLoading = isFetching && !data;
  const isEmpty = !isInitialLoading && users.length === 0;

  const canApplyFilters =
    search !== appliedFilters.q ||
    plan !== appliedFilters.plan ||
    status !== appliedFilters.status;

  const canResetRemove =
    search !== "" ||
    plan !== "" ||
    status !== "" ||
    appliedFilters.q !== "" ||
    appliedFilters.plan !== "" ||
    appliedFilters.status !== "";

  const isPageLoading = isFetching && page > 1;

  // ================= HANDLERS =================
  const handleApplyFilters = () => {
    if (!canApplyFilters) return;
    setPage(1);
    setAppliedFilters({ q: search, plan, status });
  };

  const handleResetRemove = () => {
    setSearch("");
    setPlan("");
    setStatus("");
    setAppliedFilters({ q: "", plan: "", status: "" });
    setPage(1);
  };

  const handleChangePage = (_, value) => {
    if (!pagination) return;
    setPage(value);
  };

  const getInitials = (name = "") => {
    if (!name) return "G";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // ================= RENDER =================
  if (isInitialLoading) {
    return (
      <Box mt={4}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (isError || !hasData) {
    return (
      <Box mt={4}>
        <Typography color="error">Something went wrong.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        gap={2}
        mb={2}
        className="bg-white p-7 rounded-xl flex xl:flex-row flex-col"
        style={{ border: "1px solid rgb(235, 235, 235)" }}
      >
        <div className="flex gap-4 lg:flex-row flex-col">
          {/* Search Field */}
          <div className="w-full md:w-[380px]">
            <SearchInput
              placeholder="Search users by name or email ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment
                  position="start"
                  sx={{ position: "absolute", left: "12px" }}
                >
                  <SearchIcon sx={{ color: "#9e9e9e" }} />
                </InputAdornment>
              }
            />
          </div>

          <div className="gap-4 flex sm:flex-row flex-col">
            {/* Plans Select */}
            {plansData?.status === "success" && (
              <FormControl size="small" className="flex-1 md:flex-none">
                {" "}
                <Select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  displayEmpty
                  sx={{
                    border: "1px solid rgb(235, 235, 235)",
                    minWidth: 160,
                    height: "40px", // توحيد الارتفاع
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0px 0px 8px rgba(0, 176, 255, 0.4)",
                      border: "1px solid #00B0FF",
                      backgroundColor: "#ffffff",
                    },
                  }}
                  MenuProps={{
                    disableScrollLock: true,
                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                    transformOrigin: { vertical: "top", horizontal: "left" },
                    PaperProps: {
                      sx: {
                        zoom: {
                          xs: "100%",
                          "@media (min-width: 1024px)": {
                            zoom: "115.65%", // ده كدة هيبدأ مع lg بتاعة Tailwind بالظبط
                          },
                        },
                        marginTop: "4px",
                        borderRadius: "8px",
                        "& .MuiList-root": { padding: 0 },
                      },
                    },
                  }}
                  renderValue={(selected) =>
                    selected === ""
                      ? "All Plans"
                      : PLANS.find((p) => p.value === selected)?.label
                  }
                >
                  {PLANS.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Status Select */}
            <FormControl size="small" className="flex-1 md:flex-none">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                displayEmpty
                sx={{
                  border: "1px solid rgb(235, 235, 235)",
                  minWidth: 160,
                  height: "40px", // توحيد الارتفاع
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0px 0px 8px rgba(0, 176, 255, 0.4)",
                    border: "1px solid #00B0FF",
                    backgroundColor: "#ffffff",
                  },
                }}
                MenuProps={{
                  anchorOrigin: { vertical: "bottom", horizontal: "left" },
                  transformOrigin: { vertical: "top", horizontal: "left" },
                  PaperProps: {
                    sx: {
                      zoom: {
                        xs: "100%",
                        "@media (min-width: 1024px)": {
                          zoom: "116%", // ده كدة هيبدأ مع lg بتاعة Tailwind بالظبط
                        },
                      },
                      marginTop: "4px",
                      borderRadius: "8px",
                      "& .MuiList-root": { padding: 0 },
                    },
                  },
                }}
                renderValue={(selected) =>
                  selected === ""
                    ? "All Status"
                    : STATUS.find((s) => s.value === selected)?.label
                }
              >
                {STATUS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="gap-4 flex">
          {/* Apply Button */}
          <button
            disabled={!canApplyFilters || isFetching}
            onClick={handleApplyFilters}
            style={{ height: "40px", background: "var(--gradient-color)" }} // توحيد الارتفاع مع البقية
            className="
            flex-1 sm:flex-none
          px-6 py-2 rounded-md
          bg-gray-100 
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
          cursor-pointer
          text-white
          shadow-md
          font-semibold
        "
          >
            {isFetching ? "Applying..." : "Apply"}
          </button>

          {/* Reset Button */}
          <button
            disabled={!canResetRemove || isFetching}
            onClick={handleResetRemove}
            style={{ height: "40px", background: "rgb(240,240, 240)" }} // توحيد الارتفاع مع البقية
            className="
                        flex-1 sm:flex-none
          px-6 py-2 rounded-md
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
          cursor-pointer
          shadow-md
          font-semibold
        "
          >
            Reset
          </button>
        </div>
      </Box>

      {/* ================= TABLE ================= */}
      <>
        {/* ================= TABLE CONTAINER ================= */}
        {!isEmpty && (
          <div className="overflow-x-auto rounded-xl shadow-lg mt-5 border border-gray-100">
            {/* أضفنا min-w-max لضمان أن الجدول لا ينضغط أبداً ويحافظ على مساحة محتواه */}
            <table className="w-full min-w-max bg-white table-auto text-left">
              <thead>
                <tr className="bg-linear-to-r from-[#00c853] to-[#00b0ff] text-white">
                  {/* User - العمود الأساسي */}
                  <th className="px-4 py-4 font-semibold text-sm hidden md:table-cell">
                    User
                  </th>
                  {/* باقي الأعمدة مع خاصية الاختفاء التدريجي */}
                  <th className="px-4 py-4 font-semibold text-sm">Email</th>
                  <th className="px-4 py-4 font-semibold text-sm hidden xl:table-cell">
                    Plan
                  </th>
                  <th className="px-4 py-4 font-semibold text-sm hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-4 font-semibold text-sm hidden xl:table-cell">
                    Registered
                  </th>
                  <th className="px-4 py-4 font-semibold text-sm hidden lg:table-cell">
                    Images Used
                  </th>
                  <th className="px-4 py-4 font-semibold text-sm hidden md:table-cell">
                    Credits
                  </th>

                  {/* Details - يظهر في أي شاشة أصغر من xl ويأخذ مساحة صغيرة جداً (width-1) */}
                  <th className="px-4 py-4 w-1"></th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`border-b border-gray-100 transition-all duration-200 hover:bg-[#ddf4ff]/30 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    {/* User Cell */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ background: "var(--gradient-color)" }}
                          className="text-white w-11 h-11 flex items-center justify-center rounded-full font-semibold text-md shrink-0"
                        >
                          {getInitials(u.name)}
                        </div>
                        <span className="font-medium text-gray-800 text-sm whitespace-nowrap">
                          {u.name}
                        </span>
                      </div>
                    </td>

                    {/* Email Cell - أضفنا محددات لمنع التداخل */}
                    <td className="px-4 py-4 text-sm text-gray-600  max-w-[200px]">
                      <div className="truncate" title={u.email}>
                        {u.email}
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-4 text-gray-600 hidden xl:table-cell whitespace-nowrap">
                      <div
                        className={
                          "px-3 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap w-fit"
                        }
                        style={{
                          background:
                            u.currentPlan === "Pro"
                              ? "#00B0FF"
                              : u.currentPlan === "Premium"
                                ? "rgba(0, 200, 83, 1)"
                                : "",
                          color:
                            u.currentPlan === "Free"
                              ? "rgb(150, 150, 150)"
                              : "white",
                          border:
                            u.currentPlan === "Free"
                              ? "1px solid rgb(220, 220, 220)"
                              : "",
                        }}
                      >
                        {u.currentPlan}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-sm hidden md:table-cell">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap ${
                          u.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Registered */}
                    <td className="px-4 py-4 text-sm text-gray-600 hidden xl:table-cell whitespace-nowrap">
                      {new Date(u.joinedAt).toLocaleDateString("en-GB")}
                    </td>

                    {/* Images */}
                    <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {u.imagesUsed}
                    </td>

                    {/* Credits */}
                    <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell font-mono">
                      {u.credits}
                    </td>

                    {/* Mobile/Tablet Details Button */}
                    <td className="px-4 py-4 text-right w-1">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setOpenDetailsModal(true);
                        }}
                        className="inline-flex items-center gap-1 text-[13px] font-bold text-[#00b0ff] cursor-pointer hover:underline whitespace-nowrap"
                      >
                        Actions
                        <LuSquareArrowOutUpRight className="shrink-0" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        {!isEmpty && pagination && pagination.totalPages > 1 && (
          <div
            className="bg-white px-3 sm:px-6 py-6 rounded-xl flex flex-row mt-5.5 items-center justify-center lg:justify-end"
            style={{ border: "1px solid rgb(235, 235, 235)" }}
          >
            {isPageLoading && (
              <Typography variant="body2" mr={2}>
                Loading...
              </Typography>
            )}
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={handleChangePage}
              siblingCount={0}
              boundaryCount={1}
              showFirstButton
              showLastButton
              disabled={isFetching}
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: "bold",
                  fontSize: "18px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  // --- إضافة الـ Padding هنا ---
                  padding: "22px 18px",
                  // ----------------------------
                  "@media (max-width: 600px)": {
                    // في الموبايل يفضل padding أصغر أو الاعتماد على أبعاد ثابتة
                    padding: "4px 8px",
                    fontSize: "0.8rem",
                    margin: "0 2px",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#00B0FF",
                    color: "#fff",
                  },
                },
                "@media (max-width: 600px)": {
                  "& .MuiPaginationItem-firstButton, & .MuiPaginationItem-lastButton":
                    {
                      display: "none",
                    },
                  "& .MuiPaginationItem-previousNext": {
                    display: "none",
                  },
                },
                "& .MuiPaginationItem-ellipsis": {
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#666",
                },
                "&.Mui-selected": {
                  backgroundColor: "#00B0FF !important", // استخدام !important لضمان الأولوية
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#0090D1", // لون أغمق قليلاً عند الوقوف عليه وهو نشط
                  },
                },
                // إضافة حالة الـ focus لضمان عدم تغير اللون بعد النقرة
                "&.Mui-selected.Mui-focusVisible": {
                  backgroundColor: "#00B0FF",
                },
              }}
            />
          </div>
        )}

        {/* ================= MOBILE DETAILS MODAL ================= */}
        <GeneralModal
          isOpen={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
        >
          {selectedUser && (
            <div className="text-left">
              <div className="flex justify-between items-start md:items-center mb-5 pb-6 border-b border-gray-300">
                <div className="flex items-start md:items-center gap-2 md:flex-row flex-col">
                  <h2 className="font-bold text-xl text-gray-800">
                    {selectedUser.name}
                  </h2>
                  <span
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                      selectedUser.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>

                <div className="mt-1">
                  <UserActionsMenu
                    user={selectedUser}
                    onDelete={(user) => {
                      setOpenDetailsModal(false);
                      setSelectedUser(user);
                      setOpenDelete(true);
                    }}
                    onSuspend={(user) => {
                      setOpenDetailsModal(false);
                      setSelectedUser(user);
                      setOpenSuspend(true);
                    }}
                    onReactivate={(user) => {
                      setOpenDetailsModal(false);
                      setSelectedUser(user);
                      setOpenReactivate(true);
                    }}
                    onNotify={(user) => {
                      setOpenDetailsModal(false);
                      setSelectedUser(user);
                      setOpenNotify(true);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <p className="flex items-center gap-1">
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium max-w-[210px] sm:max-w-[280px] truncate">
                    {selectedUser.email}
                  </p>
                </p>
                <p>
                  <span className="text-gray-500">Plan:</span>{" "}
                  <span className="font-medium">
                    {selectedUser.currentPlan}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Registered:</span>{" "}
                  <span className="font-medium">
                    {new Date(selectedUser.joinedAt).toLocaleDateString(
                      "en-GB",
                    )}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Credits:</span>{" "}
                  <span className="font-medium font-mono">
                    {selectedUser.credits}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Images Used:</span>{" "}
                  <span className="font-medium">{selectedUser.imagesUsed}</span>
                </p>
              </div>
            </div>
          )}
        </GeneralModal>

        {/* ================= ORIGINAL LOGIC MODALS ================= */}
        <SendNotificationModal
          open={openNotify}
          user={selectedUser}
          onClose={() => setOpenNotify(false)}
        />
        <SuspendUserModal
          open={openSuspend}
          user={selectedUser}
          onClose={() => setOpenSuspend(false)}
        />
        <DeleteUserModal
          open={openDelete}
          user={selectedUser}
          onClose={() => setOpenDelete(false)}
        />
        <ReactivateUserModal
          open={openReactivate}
          user={selectedUser}
          onClose={() => setOpenReactivate(false)}
        />
      </>
      {/* ================= EMPTY STATE ================= */}
      {isEmpty && (
        <Box mt={4}>
          <Typography>No users found.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AllUsers;
