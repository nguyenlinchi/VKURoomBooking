import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  booking: any;
  onPress?: () => void;
}

export default function BookingPreview({ booking, onPress }: Props) {
  // 1. Xử lý phòng: Supabase trả về rooms có thể là Mảng [0] hoặc Object
  const room = Array.isArray(booking?.rooms)
    ? booking?.rooms[0]
    : booking?.rooms;

  // 2. Lấy tên phòng từ bảng rooms liên kết hoặc cột phòng fallback
  const roomName =
    room?.name ||
    booking?.room_name ||
    "Phòng học";

  // 3. Lấy thời gian từ đúng cột start_at và end_at trong Supabase
  const rawStart = booking?.start_at;
  const rawEnd = booking?.end_at;

  // Format Ngày (Ví dụ: 05/10/2026)
  const formatDate = (isoString?: string) => {
    if (!isoString) return "Chưa có ngày";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Chưa có ngày";
    return d.toLocaleDateString("vi-VN");
  };

  // Format Giờ (Ví dụ: 09:00)
  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const dateStr = formatDate(rawStart);
  const startTimeStr = formatTime(rawStart);
  const endTimeStr = formatTime(rawEnd);

  const status = booking?.status || "confirmed";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.icon}>
        <Text style={styles.iconText}>🏫</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.roomName} numberOfLines={1}>
          {roomName}
        </Text>

        <Text style={styles.date}>📅 {dateStr}</Text>

        {startTimeStr ? (
          <Text style={styles.time}>
            🕐 {startTimeStr} - {endTimeStr}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.status,
          status === "cancelled" ? styles.cancelled : styles.confirmed,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            status === "cancelled"
              ? styles.cancelledText
              : styles.confirmedText,
          ]}
        >
          {status === "cancelled" ? "Đã hủy" : "Đã đặt"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  icon: { marginRight: 12 },
  iconText: { fontSize: 24 },
  info: { flex: 1 },
  roomName: { fontWeight: "bold", fontSize: 16, color: "#333" },
  date: { color: "#666", marginTop: 2, fontSize: 13 },
  time: { color: "#666", marginTop: 2, fontSize: 13 },
  status: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  confirmed: { backgroundColor: "#e6f4ea" },
  cancelled: { backgroundColor: "#fce8e6" },
  statusText: { fontSize: 12, fontWeight: "bold" },
  confirmedText: { color: "#137333" },
  cancelledText: { color: "#c5221f" },
});