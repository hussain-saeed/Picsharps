import { useState } from "react";
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
  InputLabel,
  Pagination,
} from "@mui/material";
import { useGetActiveUsersQuery } from "../../features/core/adminCoreApi";

// List of plans
const PLANS = [
  { label: "All Plans", value: "" },
  { label: "Free", value: "free" },
  { label: "Pro Monthly", value: "pro-monthly" },
  { label: "Pro Yearly", value: "pro-yearly" },
  { label: "Premium Monthly", value: "premium-monthly" },
  { label: "Premium Yearly", value: "premium-yearly" },
];

const ActiveUsers = () => {
  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({ q: "", plan: "" });
  const [page, setPage] = useState(1);

  // ================= QUERY =================
  const { data, isFetching, isError } = useGetActiveUsersQuery(
    {
      q: appliedFilters.q,
      plan: appliedFilters.plan,
      page,
      limit: 10,
      status: "active",
    },
    { keepUnusedDataFor: 300 },
  );

  // ================= DERIVED DATA =================
  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination ?? null;

  const isInitialLoading = isFetching && !data;
  const isEmpty = !isInitialLoading && users.length === 0;

  const canApplyFilters =
    search !== appliedFilters.q || plan !== appliedFilters.plan;

  const canResetRemove =
    search !== "" ||
    plan !== "" ||
    appliedFilters.q !== "" ||
    appliedFilters.plan !== "";

  const isPageLoading = isFetching && page > 1;

  // ================= HANDLERS =================
  const handleApplyFilters = () => {
    if (!canApplyFilters) return;
    setPage(1);
    setAppliedFilters({ q: search, plan });
  };

  const handleResetRemove = () => {
    setSearch("");
    setPlan("");
    setAppliedFilters({ q: "", plan: "" });
    setPage(1);
  };

  const handleChangePage = (_, value) => {
    if (!pagination) return;
    setPage(value);
  };

  const getInitials = (name = "") => {
    if (!name) return "G";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // ================= RENDER =================
  if (isInitialLoading) {
    return (
      <Box mt={4}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (isError) {
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

        <FormControl size="small">
          <Select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
            displayEmpty
            renderValue={(selected) => {
              if (selected === "") {
                return "All Plans";
              }

              return PLANS.find((p) => p.value === selected)?.label;
            }}
          >
            {PLANS.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
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
                <TableCell>Registered</TableCell>
                <TableCell>Current Plan</TableCell>
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
                  <TableCell>
                    {new Date(u.joinedAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{u.currentPlan}</TableCell>
                  <TableCell>{u.imagesUsed}</TableCell>
                  <TableCell>{u.credits}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      Action
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default ActiveUsers;
