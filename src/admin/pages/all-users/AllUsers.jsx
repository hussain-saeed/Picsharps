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

// List of status
const STATUS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

const AllUsers = () => {
  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");

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
    <Box mt={4}>
      {/* ================= FILTERS ================= */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />

        {plansData?.status !== "success" ? (
          ""
        ) : (
          <FormControl size="small">
            <Select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
              displayEmpty
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

        <FormControl size="small">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
            displayEmpty
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

        <button
          disabled={!canApplyFilters || isFetching}
          onClick={handleApplyFilters}
          className="
            px-4 py-2 rounded-md border
            bg-gray-100 text-gray-800
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            cursor-pointer
          "
        >
          {isFetching ? "Applying..." : "Apply"}
        </button>

        <button
          disabled={!canResetRemove || isFetching}
          onClick={handleResetRemove}
          className="
            px-4 py-2 rounded-md border border-red-600
            text-red-600 bg-white
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            cursor-pointer
          "
        >
          Reset
        </button>
      </Box>

      {/* ================= TABLE ================= */}
      {!isEmpty && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell>Images Used</TableCell>
                <TableCell>Credits</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        width={32}
                        height={32}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="50%"
                        bgcolor="#e5e7eb"
                        fontWeight={600}
                      >
                        {getInitials(u.name)}
                      </Box>
                      {u.name}
                    </Box>
                  </TableCell>

                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.currentPlan}</TableCell>
                  <TableCell>{u.status}</TableCell>
                  <TableCell>
                    {new Date(u.joinedAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{u.imagesUsed}</TableCell>
                  <TableCell>{u.credits}</TableCell>
                  <TableCell>
                    <UserActionsMenu
                      user={u}
                      onDelete={(u) => {
                        setSelectedUser(u);
                        setOpenDelete(true);
                      }}
                      onSuspend={(u) => {
                        setSelectedUser(u);
                        setOpenSuspend(true);
                      }}
                      onReactivate={(u) => {
                        setSelectedUser(u);
                        setOpenReactivate(true);
                      }}
                      onNotify={(u) => {
                        setSelectedUser(u);
                        setOpenNotify(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
        </TableContainer>
      )}

      {/* ================= PAGINATION ================= */}
      {!isEmpty && pagination && pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
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
          />
        </Box>
      )}

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
