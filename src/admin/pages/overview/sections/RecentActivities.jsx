import { useEffect, useState } from "react";
import { useGetRecentActivityQuery } from "../../../features/core/adminCoreApi";

const EVENT_TYPE_MAP = {
  USER_LOGGED_IN: { label: "Login", color: "#3b82f6" },
  IMAGE_UPLOADED: { label: "Upload", color: "#3b82f6" },
  SUBSCRIPTION_CREATED: { label: "Subscription", color: "#22c55e" },
  TOOL_RUN: { label: "Processing", color: "#3b82f6" },
  USER_SIGNED_UP: { label: "Register", color: "#3b82f6" },
  USER_DELETED: { label: "Deletion", color: "#ef4444" },
};

function RecentActivities() {
  const LIMIT = 5;

  const [cursor, setCursor] = useState(undefined);
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { data, isFetching, isError } = useGetRecentActivityQuery(
    { limit: LIMIT, cursor },
    { refetchOnMountOrArgChange: true },
  );

  // Reset on mount
  useEffect(() => {
    setCursor(undefined);
    setItems([]);
    setNextCursor(null);
    setLastUpdated(null);
  }, []);

  // Determine if response is valid based on backend status
  const hasData = data?.status === "success" && Array.isArray(data.data?.data);
  console.log(data);

  // Sync response
  useEffect(() => {
    if (!hasData) return;

    // prevent duplicates
    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.id));
      const newOnes = data.data.data.filter(
        (item) => !existingIds.has(item.id),
      );
      return [...prev, ...newOnes];
    });

    setNextCursor(data.data.nextCursor ?? null);

    if (cursor === undefined) {
      setLastUpdated(new Date());
    }
  }, [data, cursor, hasData]);

  const isInitialLoading = isFetching && items.length === 0;
  const isLoadingMore = isFetching && items.length > 0;

  const getInitials = (name = "") => {
    if (!name) return "G";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const normalizeUserInfo = (item) => {
    const isDeletedOverride =
      item.user === "Guest" &&
      item.action === "got deleted by an admin" &&
      item.type === "USER_DELETED" &&
      item.metadata;

    if (!isDeletedOverride) {
      return {
        name: item.user,
        email: null,
        reason: null,
        details: null,
      };
    }

    return {
      name: item.metadata.originalName || "Unknown",
      email: item.metadata.originalEmail || null,
      reason: item.metadata.reason || null,
      details: item.metadata.details || null,
    };
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div style={{ marginTop: 30 }}>
      {/* Title */}
      <h3>Recent Activity</h3>

      {/* Last Updated */}
      {lastUpdated && (
        <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
          Last updated: {formatDate(lastUpdated)}
        </div>
      )}

      {/* Loading */}
      {isInitialLoading && <div>Loading recent activities...</div>}

      {/* Error */}
      {(!hasData || isError) && !isInitialLoading && (
        <div style={{ color: "red" }}>
          Something went wrong while fetching activities.
        </div>
      )}

      {/* Empty */}
      {hasData && !isInitialLoading && items.length === 0 && (
        <div>No recent activities.</div>
      )}

      {/* List */}
      {hasData && items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => {
            const userInfo = normalizeUserInfo(item);

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  border: "1px solid #eee",
                  padding: 12,
                  borderRadius: 8,
                  background: "#fff",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(userInfo.name)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      alignItems: "center",
                      fontWeight: 600,
                    }}
                  >
                    <span>{userInfo.name}</span>
                    {item.type === "USER_DELETED" ? (
                      <div style={{ fontSize: 12, color: "#888" }}>
                        ({item.metadata.originalEmail})
                      </div>
                    ) : (
                      ""
                    )}

                    <span style={{ color: "#555" }}>{item.action}</span>
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      color: "#666",
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <span>{formatDate(item.time)}</span>
                    <span
                      style={{
                        background: item.metadata.color || "orange",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {item.type}
                    </span>
                  </div>

                  {item.type === "USER_DELETED" ? (
                    <div style={{ marginTop: 6, fontSize: 12, color: "#555" }}>
                      <div>
                        <strong>Reason:</strong> {item.metadata.reason}
                      </div>
                      <div>
                        <strong>Details:</strong> {item.metadata.details}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {item.type === "USER_SUSPENDED" ? (
                    <div style={{ marginTop: 6, fontSize: 12, color: "#555" }}>
                      <div>
                        <strong>Reason:</strong> {item.metadata.reason}
                      </div>
                      <div>
                        <strong>Notes:</strong> {item.metadata.notes}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {hasData && items.length > 0 && nextCursor && !isInitialLoading && (
        <button
          onClick={() => setCursor(nextCursor)}
          disabled={isLoadingMore}
          style={{
            marginTop: 16,
            padding: "8px 14px",
            opacity: isLoadingMore ? 0.6 : 1,
            cursor: isLoadingMore ? "not-allowed" : "pointer",
          }}
        >
          {isLoadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}

export default RecentActivities;
