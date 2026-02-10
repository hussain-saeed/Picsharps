import { useEffect, useState, useRef } from "react";
import { useGetRecentActivityQuery } from "../../../features/core/adminCoreApi";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoReloadOutline } from "react-icons/io5";
import { LoadingDots } from "../../../components/LoadingDots";

function RecentActivities({ markAsDone }) {
  const LIMIT = 5;

  const [cursor, setCursor] = useState(undefined);
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { data, isFetching, isError } = useGetRecentActivityQuery(
    { limit: LIMIT, cursor },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    let timeoutId;

    markAsDone(false);

    if (!isFetching) {
      markAsDone(true);
    } else {
      timeoutId = setTimeout(() => markAsDone(true), 10000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      markAsDone(false);
    };
  }, [isFetching]);

  // Reset on mount
  useEffect(() => {
    setCursor(undefined);
    setItems([]);
    setNextCursor(null);
    setLastUpdated(null);
  }, []);

  // Determine if response is valid based on backend status
  const hasData = data?.status === "success" && Array.isArray(data.data?.data);

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
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>

      {isInitialLoading && (
        <div className="min-h-[550px]">
          <LoadingDots
            loadingSize="20px"
            loadingWeight="500"
            dotsSize="25px"
            dotsWeight="600"
            gap="4px"
          />
        </div>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div
          style={{ fontSize: 13, marginBottom: 24 }}
          className="text-gray-500"
        >
          Last updated: {formatDate(lastUpdated)}
        </div>
      )}

      {/* Error */}
      {(!hasData || isError) && !isInitialLoading && (
        <div className="text-xl font-medium text-red-500">
          Something went wrong while fetching activities!
        </div>
      )}

      {/* Empty */}
      {hasData && !isInitialLoading && items.length === 0 && (
        <div className="text-xl font-medium">No recent activities!</div>
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
                  alignItems: "start",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "var(--gradient-color)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(userInfo.name)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }} className="flex flex-col gap-2">
                  <div
                    style={{
                      display: "flex",
                      fontWeight: 600,
                    }}
                    className={`flex flex-col ${item.type === "USER_DELETED" ? "md:flex-row md:items-center" : "sm:flex-row sm:items-center"} justify-start gap-0 xs:gap-1`}
                  >
                    <span>{userInfo.name}</span>
                    {item.type === "USER_DELETED" ? (
                      <span
                        style={{
                          display: "inline-block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle",
                        }}
                        className="text-[12px] max-w-[150px] xs:max-w-none"
                      >
                        ({item.metadata.originalEmail})
                      </span>
                    ) : (
                      ""
                    )}

                    <span className="text-gray-500 text-sm font-medium">
                      {item.action}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      color: "#666",
                      gap: 8,
                    }}
                    className="flex flex-col sm:flex-row justify-start items-start"
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
            background: "rgba(0, 200, 83, 1)",
            opacity: isLoadingMore ? 0.6 : 1,
            cursor: isLoadingMore ? "not-allowed" : "pointer",
          }}
          className="rounded-md text-white flex items-center gap-2"
        >
          {isLoadingMore ? "Loading ..." : "Load More"}
          <IoReloadOutline />
        </button>
      )}
    </div>
  );
}

export default RecentActivities;
