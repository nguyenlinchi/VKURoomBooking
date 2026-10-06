import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { useBookings } from "../hooks/useBookings";
import { useCancelBooking } from "../hooks/useCancelBooking";


// ================================
// TYPE FILTER
// ================================

type FilterType =
  | "all"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";


// ================================
// SCREEN
// ================================

export default function MyBookingsScreen() {
  const { session } = useAuth();

  const userId = session?.user?.id;

  const {
    data: bookings = [],
    isLoading,
    isFetching,
    refetch,
  } = useBookings(userId);

  const cancelMutation = useCancelBooking();

  const [filter, setFilter] =
    useState<FilterType>("all");


  // ================================
  // FILTER BOOKING
  // ================================

  const filteredBookings = useMemo(() => {
    const now = new Date();

    return bookings.filter((booking: any) => {
      const start = new Date(booking.start_at);
      const end = new Date(booking.end_at);

      // Đã hủy
      if (booking.status === "cancelled") {
        return filter === "all" || filter === "cancelled";
      }

      // Sắp tới
      if (start > now) {
        return (
          filter === "all" ||
          filter === "upcoming"
        );
      }

      // Đang sử dụng
      if (start <= now && end > now) {
        return (
          filter === "all" ||
          filter === "ongoing"
        );
      }

      // Đã hoàn thành
      if (end <= now) {
        return (
          filter === "all" ||
          filter === "completed"
        );
      }

      return true;
    });
  }, [bookings, filter]);


  // ================================
  // HỦY BOOKING
  // ================================

  const handleCancel = (booking: any) => {
    Alert.alert(
      "Hủy đặt phòng",
      `Bạn có chắc muốn hủy phòng ${
        booking.rooms?.name || ""
      } không?`,
      [
        {
          text: "Không",
          style: "cancel",
        },

        {
          text: "Hủy phòng",
          style: "destructive",

          onPress: () => {
            cancelMutation.mutate(
              booking.id,
              {
                onSuccess: () => {
                  Alert.alert(
                    "Thành công",
                    "Đã hủy đặt phòng."
                  );
                },

                onError: (error: any) => {
                  Alert.alert(
                    "Lỗi",
                    error?.message ||
                      "Không thể hủy booking."
                  );
                },
              }
            );
          },
        },
      ]
    );
  };


  // ================================
  // LOADING
  // ================================

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>
          Đang tải lịch đặt phòng...
        </Text>
      </View>
    );
  }


  // ================================
  // RENDER
  // ================================

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Lịch đặt phòng
        </Text>

        <Text style={styles.subtitle}>
          Quản lý các phòng bạn đã đặt
        </Text>
      </View>


      {/* FILTER */}

      <View style={styles.filterContainer}>

        <FilterButton
          title="Tất cả"
          active={filter === "all"}
          onPress={() => setFilter("all")}
        />

        <FilterButton
          title="Sắp tới"
          active={filter === "upcoming"}
          onPress={() => setFilter("upcoming")}
        />

        <FilterButton
          title="Đang dùng"
          active={filter === "ongoing"}
          onPress={() => setFilter("ongoing")}
        />

        <FilterButton
          title="Đã xong"
          active={filter === "completed"}
          onPress={() => setFilter("completed")}
        />

        <FilterButton
          title="Đã hủy"
          active={filter === "cancelled"}
          onPress={() => setFilter("cancelled")}
        />

      </View>


      {/* LIST */}

      <FlatList
        data={filteredBookings}

        keyExtractor={(item: any) =>
          item.id.toString()
        }

        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onCancel={() =>
              handleCancel(item)
            }
          />
        )}

        showsVerticalScrollIndicator={false}

        contentContainerStyle={
          filteredBookings.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }

        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
          />
        }

        ListEmptyComponent={
          <EmptyState filter={filter} />
        }
      />

    </View>
  );
}



function FilterButton({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        active && styles.filterButtonActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.filterTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}



function BookingCard({
  booking,
  onCancel,
}: {
  booking: any;
  onCancel: () => void;
}) {
  const room = booking.rooms;

  const start = new Date(
    booking.start_at
  );

  const end = new Date(
    booking.end_at
  );

  const now = new Date();

  const isCancelled =
    booking.status === "cancelled";

  const isUpcoming =
    start > now && !isCancelled;

  const isOngoing =
    start <= now &&
    end > now &&
    !isCancelled;

  const isCompleted =
    end <= now &&
    !isCancelled;


  return (
    <View style={styles.card}>

      {/* ROOM */}

      <View style={styles.cardHeader}>

        <View style={styles.roomInfo}>

          <Text style={styles.roomName}>
            🏫 {room?.name || "Phòng"}
          </Text>

          <Text style={styles.roomLocation}>
            📍 {room?.location || "Không xác định"}
          </Text>

        </View>

        <StatusBadge
          isCancelled={isCancelled}
          isUpcoming={isUpcoming}
          isOngoing={isOngoing}
          isCompleted={isCompleted}
        />

      </View>


      {/* INFO */}

      <View style={styles.infoBox}>

        <Text style={styles.infoText}>
          📅 {formatDate(start)}
        </Text>

        <Text style={styles.infoText}>
          🕐 {formatTime(start)} -{" "}
          {formatTime(end)}
        </Text>

        <Text style={styles.infoText}>
          👥 Sức chứa:{" "}
          {room?.capacity || "--"} người
        </Text>

      </View>


      {/* COUNTDOWN */}

      {isUpcoming && (
        <Countdown
          start={start}
        />
      )}

      {isOngoing && (
        <View style={styles.ongoingBox}>
          <Text style={styles.ongoingText}>
            🟢 Phòng đang được sử dụng
          </Text>

          <Text style={styles.remainingText}>
            Còn {getRemainingTime(end)}
          </Text>
        </View>
      )}


      {/* CANCEL */}

      {isUpcoming && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>
            Hủy đặt phòng
          </Text>
        </TouchableOpacity>
      )}

    </View>
  );
}


// ==================================================
// STATUS BADGE
// ==================================================

function StatusBadge({
  isCancelled,
  isUpcoming,
  isOngoing,
  isCompleted,
}: {
  isCancelled: boolean;
  isUpcoming: boolean;
  isOngoing: boolean;
  isCompleted: boolean;
}) {
  if (isCancelled) {
    return (
      <View style={styles.cancelledBadge}>
        <Text style={styles.badgeText}>
          🔴 Đã hủy
        </Text>
      </View>
    );
  }

  if (isOngoing) {
    return (
      <View style={styles.ongoingBadge}>
        <Text style={styles.badgeText}>
          🟢 Đang dùng
        </Text>
      </View>
    );
  }

  if (isUpcoming) {
    return (
      <View style={styles.upcomingBadge}>
        <Text style={styles.badgeText}>
          🔵 Sắp tới
        </Text>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={styles.completedBadge}>
        <Text style={styles.badgeText}>
          ⚪ Đã xong
        </Text>
      </View>
    );
  }

  return null;
}


// ==================================================
// COUNTDOWN
// ==================================================

function Countdown({
  start,
}: {
  start: Date;
}) {
  const [remaining, setRemaining] =
    React.useState(
      getRemainingTime(start)
    );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(
        getRemainingTime(start)
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [start]);

  return (
    <View style={styles.countdownBox}>
      <Text style={styles.countdownTitle}>
        ⏰ Thời gian còn lại
      </Text>

      <Text style={styles.countdownText}>
        {remaining}
      </Text>
    </View>
  );
}


// ==================================================
// EMPTY STATE
// ==================================================

function EmptyState({
  filter,
}: {
  filter: FilterType;
}) {
  let message =
    "Bạn chưa có lịch đặt phòng.";

  if (filter === "upcoming") {
    message =
      "Bạn không có phòng sắp tới.";
  }

  if (filter === "ongoing") {
    message =
      "Hiện tại bạn không sử dụng phòng nào.";
  }

  if (filter === "completed") {
    message =
      "Chưa có lịch sử phòng đã hoàn thành.";
  }

  if (filter === "cancelled") {
    message =
      "Bạn chưa hủy phòng nào.";
  }

  return (
    <View style={styles.empty}>

      <Text style={styles.emptyIcon}>
        🏫
      </Text>

      <Text style={styles.emptyTitle}>
        Không có lịch đặt phòng
      </Text>

      <Text style={styles.emptyText}>
        {message}
      </Text>

    </View>
  );
}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(date: Date) {
  return date.toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}


// ==================================================
// FORMAT TIME
// ==================================================

function formatTime(date: Date) {
  return date.toLocaleTimeString(
    "vi-VN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


// ==================================================
// COUNTDOWN
// ==================================================

function getRemainingTime(
  target: Date
) {
  const diff =
    target.getTime() -
    new Date().getTime();

  if (diff <= 0) {
    return "Đã bắt đầu";
  }

  const totalMinutes = Math.floor(
    diff / (1000 * 60)
  );

  const days = Math.floor(
    totalMinutes / (60 * 24)
  );

  const hours = Math.floor(
    (totalMinutes % (60 * 24)) / 60
  );

  const minutes =
    totalMinutes % 60;

  if (days > 0) {
    return `${days} ngày ${hours} giờ`;
  }

  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }

  return `${minutes} phút`;
}


// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
  },


  // FILTER

  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },

  filterButtonActive: {
    backgroundColor: "#2563EB",
  },

  filterText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },


  // LIST

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },


  // CARD

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  roomInfo: {
    flex: 1,
    marginRight: 10,
  },

  roomName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  roomLocation: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
  },


  // INFO

  infoBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },

  infoText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 5,
  },


  // BADGE

  upcomingBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  ongoingBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  completedBadge: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  cancelledBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },


  // COUNTDOWN

  countdownBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
  },

  countdownTitle: {
    fontSize: 12,
    color: "#6B7280",
  },

  countdownText: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },


  // ONGOING

  ongoingBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
  },

  ongoingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#15803D",
  },

  remainingText: {
    marginTop: 4,
    fontSize: 13,
    color: "#166534",
  },


  // CANCEL

  cancelButton: {
    marginTop: 14,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
  },

  cancelButtonText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 14,
  },


  // EMPTY

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },


  // LOADING

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#6B7280",
  },

});