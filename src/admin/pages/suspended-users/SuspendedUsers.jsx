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
import { useGetSuspendedUsersQuery } from "../../features/core/adminCoreApi";

const SuspendedUsers = () => {
  // ================= STATE =================
  const [page, setPage] = useState(1);

  // ================= QUERY =================
  const { data, isFetching, isError } = useGetSuspendedUsersQuery(
    {
      page,
      limit: 10,
    },
    { keepUnusedDataFor: 300 },
  );
  console.log("Fetched data:", data);

  // ================= DERIVED DATA =================
  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination ?? null;

  const isInitialLoading = isFetching && !data;
  const isEmpty = !isInitialLoading && users.length === 0;

  const isPageLoading = isFetching && page > 1;

  // ================= HANDLERS =================
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
      {/* ================= TABLE ================= */}
      {!isEmpty && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Suspension Date</TableCell>
                <TableCell>Suspended Reason</TableCell>
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
                    {" "}
                    {new Date(u.suspendedAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{u.reason}</TableCell>
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

export default SuspendedUsers;
