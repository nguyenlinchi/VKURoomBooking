import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useRoom } from "../hooks/useRooms";
import { createBooking } from "../services/bookingService";

// =====================================
// TÁCH ISO
// =====================================
function splitIso(iso?: string) {
  if (!iso) return null;
  const [date, time] = iso.split("T");
  return {
    date,
    time: time ? time.slice(0, 5) : undefined,
  };
}

// =====================================
// KIỂM TRA GIỜ ĐÃ QUÁ SO VỚI HIỆN TẠI
// =====================================
function isTimePassed(selectedDate: string, timeStr: string) {
  const now = new Date();

  // Lấy chuỗi ngày hôm nay YYYY-MM-DD theo giờ địa phương
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  // Nếu ngày chọn nhỏ hơn hôm nay (trường hợp ngày quá hạn):
  if (selectedDate < todayStr) return true;

  // Nếu ngày chọn lớn hơn hôm nay: chưa quá giờ
  if (selectedDate > todayStr) return false;

  // Nếu chọn đúng ngày HÔM NAY -> So sánh giờ: phút
  const [hours, minutes] = timeStr.split(":").map(Number);
  const slotDate = new Date(now);
  slotDate.setHours(hours, minutes, 0, 0);

  return slotDate <= now;
}

// =====================================
// ROOM DETAIL
// =====================================
export default function RoomDetailScreen({ route, navigation }: any) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const userName = session?.user.user_metadata?.name || "Người dùng";
  const userRole = session?.user.user_metadata?.role || "student";

  // NHẬN PARAM
  const {
    roomId,
    startAt: initialStartAt,
    endAt: initialEndAt,
  } = route.params || {};

  // LẤY PHÒNG TRỰC TIẾP TỪ SUPABASE
  const { data: room, isLoading, error } = useRoom(roomId?.toString());

  // THỜI GIAN BAN ĐẦU
  const initStart = splitIso(initialStartAt);
  const initEnd = splitIso(initialEndAt);

  const [date, setDate] = useState(
    initStart?.date ?? new Date().toISOString().split("T")[0]
  );

  const [startTime, setStartTime] = useState(
    initStart?.time ?? "09:00"
  );

  const [endTime, setEndTime] = useState(
    initEnd?.time ?? "10:00"
  );

  // LOADING
  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Đang tải thông tin phòng...</Text>
      </SafeAreaView>
    );
  }

  // ERROR
  if (error || !room) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy phòng.</Text>
        <Text>{error?.message || "Phòng không tồn tại trên Supabase."}</Text>
      </SafeAreaView>
    );
  }

  // KIỂM TRA THỜI GIAN HỢP LỆ
  const isStartPassed = isTimePassed(date, startTime);
  const isEndPassed = isTimePassed(date, endTime);
  const validTime = startTime < endTime && !isStartPassed && !isEndPassed;

  // TẠO ISO
  const startAt = `${date}T${startTime}:00`;
  const endAt = `${date}T${endTime}:00`;

  // ĐẶT PHÒNG
  function handleBooking() {
    if (isStartPassed || isEndPassed) {
      Alert.alert(
        "Thời gian không hợp lệ",
        "Khung giờ bạn chọn đã trôi qua. Vui lòng chọn khung giờ khác."
      );
      return;
    }

    if (!validTime) {
      Alert.alert(
        "Thời gian không hợp lệ",
        "Giờ kết thúc phải sau giờ bắt đầu."
      );
      return;
    }

    if (!userId) {
      Alert.alert("Lỗi", "Bạn chưa đăng nhập.");
      return;
    }

    Alert.alert(
      "Xác nhận đặt phòng",
      `${room.name}\n\n` +
        `Ngày: ${date}\n` +
        `Thời gian: ${startTime} → ${endTime}`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đặt phòng",
          onPress: async () => {
            try {
              await createBooking(
                room.id.toString(),
                userId,
                userName,
                userRole,
                startAt,
                endAt
              );

              Alert.alert(
                "Đặt phòng thành công",
                "Lịch đặt của bạn đã được ghi nhận.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("MainTabs", {
                        screen: "MyBookings",
                      });
                    },
                  },
                ]
              );
            } catch (error: any) {
              console.log("BOOKING ERROR:", error);
              Alert.alert(
                "Không thể đặt phòng",
                error?.message ||
                  "Phòng vừa được người khác đặt hoặc thời gian bị trùng."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* IMAGE */}
        {room.image ? (
          <Image source={{ uri: room.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Không có hình ảnh</Text>
          </View>
        )}

        {/* TÊN PHÒNG & THÔNG TIN */}
        <Text style={styles.title}>{room.name}</Text>
        <Text style={styles.info}>📍 {room.location}</Text>
        <Text style={styles.type}>🏫 {room.type}</Text>
        <Text style={styles.info}>👥 Sức chứa: {room.capacity} người</Text>

        {room.description && (
          <Text style={styles.description}>{room.description}</Text>
        )}

        {/* TIỆN ÍCH */}
        {room.facilities && room.facilities.length > 0 && (
          <>
            <Text style={styles.section}>Tiện ích</Text>
            <View style={styles.facilities}>
              {room.facilities.map((item: string) => (
                <Text key={item} style={styles.facility}>
                  {item}
                </Text>
              ))}
            </View>
          </>
        )}

        {/* CHỌN NGÀY */}
        <Text style={styles.section}>Chọn ngày</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateRow}>
            {getNextDays().map((item) => (
              <Pressable
                key={item}
                onPress={() => setDate(item)}
                style={[styles.dateButton, date === item && styles.selected]}
              >
                <Text
                  style={[
                    styles.dateText,
                    date === item && styles.selectedText,
                  ]}
                >
                  {formatDate(item)}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* THỜI GIAN BẮT ĐẦU */}
        <Text style={styles.section}>Thời gian bắt đầu</Text>
        <View style={styles.timeRow}>
          {["08:00", "09:00", "10:00", "13:00", "14:00", "15:00"].map(
            (time) => {
              const disabled = isTimePassed(date, time);
              const isSelected = startTime === time;

              return (
                <Pressable
                  key={time}
                  disabled={disabled}
                  onPress={() => setStartTime(time)}
                  style={[
                    styles.timeButton,
                    isSelected && styles.selected,
                    disabled && styles.disabledTimeButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.selectedText,
                      disabled && styles.disabledTimeText,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* THỜI GIAN KẾT THÚC */}
        <Text style={styles.section}>Đến</Text>
        <View style={styles.timeRow}>
          {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(
            (time) => {
              const disabled = isTimePassed(date, time);
              const isSelected = endTime === time;

              return (
                <Pressable
                  key={time}
                  disabled={disabled}
                  onPress={() => setEndTime(time)}
                  style={[
                    styles.timeButton,
                    isSelected && styles.selected,
                    disabled && styles.disabledTimeButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.selectedText,
                      disabled && styles.disabledTimeText,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* SUMMARY */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Lịch đặt</Text>
          <Text>📍 {room.name}</Text>
          <Text>📅 {formatDate(date)}</Text>
          <Text>
            🕐 {startTime} → {endTime}
          </Text>
        </View>

        {/* BOOK BUTTON */}
        <TouchableOpacity
          style={[styles.bookButton, !validTime && styles.disabledButton]}
          disabled={!validTime}
          onPress={handleBooking}
        >
          <Text style={styles.bookButtonText}>
            {isStartPassed || isEndPassed
              ? "Giờ đã trôi qua"
              : validTime
              ? "Đặt phòng"
              : "Thời gian không hợp lệ"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// 7 NGÀY TỚI
function getNextDays() {
  const result: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    result.push(`${year}-${month}-${day}`);
  }
  return result;
}

// FORMAT DATE
function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}`;
}

// STYLES
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7FB" },
  container: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  loadingText: { marginTop: 10, color: "#64748B" },
  errorText: { color: "#DC2626", fontSize: 16, marginBottom: 10 },
  image: { width: "100%", height: 220, borderRadius: 16 },
  imagePlaceholder: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { marginTop: 16, fontSize: 25, fontWeight: "800", color: "#172554" },
  type: { marginTop: 5, color: "#3157C8", fontWeight: "700" },
  info: { marginTop: 7, color: "#64748B" },
  description: { marginTop: 12, lineHeight: 21, color: "#475569" },
  section: { marginTop: 22, marginBottom: 10, fontSize: 17, fontWeight: "800", color: "#1E293B" },
  facilities: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  facility: { padding: 9, borderRadius: 10, backgroundColor: "#FFFFFF", color: "#475569" },
  dateRow: { flexDirection: "row", gap: 8 },
  timeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dateButton: { paddingHorizontal: 13, paddingVertical: 10, borderRadius: 10, backgroundColor: "#FFFFFF" },
  timeButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: "#FFFFFF" },
  disabledTimeButton: { backgroundColor: "#E2E8F0", opacity: 0.5 },
  dateText: { color: "#475569", fontWeight: "600" },
  disabledTimeText: { color: "#94A3B8", textDecorationLine: "line-through" },
  selected: { backgroundColor: "#3157C8" },
  selectedText: { color: "#FFFFFF" },
  summary: { marginTop: 24, padding: 16, borderRadius: 14, backgroundColor: "#FFFFFF", gap: 7 },
  summaryTitle: { fontWeight: "800", fontSize: 16, marginBottom: 5, color: "#0F172A" },
  bookButton: { marginTop: 20, padding: 16, borderRadius: 14, backgroundColor: "#3157C8", alignItems: "center" },
  disabledButton: { backgroundColor: "#94A3B8" },
  bookButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});