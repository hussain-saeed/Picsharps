import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Pagination,
} from "@mui/material";
import { useGetSuspendedUsersQuery } from "../../features/core/adminCoreApi";
import UserActionsMenu from "../../components/UserActionsMenu";
import DeleteUserModal from "../../components/DeleteUserModal";
import ReactivateUserModal from "../../components/ReactivateUserModal";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import useGeneralModal from "../../hooks/useGeneralModal";
import GeneralModal from "../../components/GeneralModal";

const SuspendedUsers = () => {
  // ================= STATE =================
  const [page, setPage] = useState(1);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openReactivate, setOpenReactivate] = useState(false);
  const { isOpen, openModal, closeModal } = useGeneralModal();
  const [selectedItem, setSelectedItem] = useState(null);
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    openModal();
  };

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
  const hasData = data?.status === "success" && Array.isArray(data.data?.users);
  const users = hasData ? data.data.users : [];
  const pagination = hasData ? data.data.pagination : null;

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
      {!isEmpty && (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100">
          <table className="w-full min-w-max bg-white table-auto text-left">
            <thead>
              <tr className="bg-linear-to-r from-[#00c853] to-[#00b0ff] text-white">
                <th className="px-4 py-4 font-semibold text-sm hidden md:table-cell">
                  User
                </th>
                <th className="px-4 py-4 font-semibold text-sm">Email</th>
                <th className="px-4 py-4 font-semibold text-sm hidden lg:table-cell">
                  Suspension Date
                </th>
                <th className="px-4 py-4 font-semibold text-sm hidden xl:table-cell">
                  Suspended Reason
                </th>
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

                  {/* Email Cell */}
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-[200px]">
                    <div className="truncate" title={u.email}>
                      {u.email}
                    </div>
                  </td>

                  {/* Suspension Date */}
                  <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell whitespace-nowrap">
                    {new Date(u.suspendedAt).toLocaleDateString("en-GB")}
                  </td>

                  {/* Suspended Reason */}
                  <td className="px-4 py-4 text-sm text-gray-600 hidden xl:table-cell max-w-[250px]">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap bg-red-100 text-red-600`}
                    >
                      {u.reason}
                    </span>
                  </td>

                  {/* Actions Button */}
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
                padding: "20px 18px",
                "@media (max-width: 600px)": {
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
                backgroundColor: "#00B0FF !important",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0090D1", 
                },
              },
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
                <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
                  Suspended
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
                  onReactivate={(user) => {
                    setOpenDetailsModal(false);
                    setSelectedUser(user);
                    setOpenReactivate(true);
                  }}
                />
              </div>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <p className="flex items-center gap-1">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium max-w-[210px] sm:max-w-[280px] truncate">
                  {selectedUser.email}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Suspension Date:</span>{" "}
                <span className="font-medium">
                  {new Date(selectedUser.suspendedAt).toLocaleDateString(
                    "en-GB",
                  )}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Reason:</span>{" "}
                <span className="font-medium text-gray-700">
                  {selectedUser.reason}
                </span>
              </p>
            </div>
          </div>
        )}
      </GeneralModal>

      {/* Modals for actions */}
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
