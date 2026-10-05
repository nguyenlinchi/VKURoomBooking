import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Platform,
  Animated,
  ActivityIndicator,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAvailableRooms } from "../hooks/useAvailableRooms";
import RoomCard from "../components/RoomCard";
import { useResponsiveLayout } from "../hooks/useResponsiveLayout";

// Hàm ghép Ngày + Giờ
const buildDateTime = (date: Date, time: Date) => {
  const result = new Date(date);
  result.setHours(time.getHours());
  result.setMinutes(time.getMinutes());
  result.setSeconds(0);
  result.setMilliseconds(0);
  return result;
};

// Component Wrapper Animation xuất hiện từng thẻ phòng
const AnimatedRoomCard = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        delay: Math.min(index * 70, 400),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 450,
        delay: Math.min(index * 70, 400),
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default function BrowseRoomsScreen({ navigation }: any) {
  const { columns, cardWidth } = useResponsiveLayout();

  // State chọn Ngày và Giờ
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // State Lọc theo sức chứa
  const [capacityFilter, setCapacityFilter] = useState<
    "all" | "small" | "medium" | "large"
  >("all");

  // State tìm kiếm tên phòng
  const [searchText, setSearchText] = useState("");

  // Animation cho Filter Header
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Tính toán startAt và endAt
  const startAt = buildDateTime(selectedDate, startTime);
  const endAt = buildDateTime(selectedDate, endTime);

  // Gọi Hook lấy phòng trống
  const {
    data: availableRooms = [],
    isLoading,
    error,
  } = useAvailableRooms(startAt.toISOString(), endAt.toISOString());

  // Xử lý thay đổi Ngày / Giờ
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleStartTimeChange = (event: any, time?: Date) => {
    setShowStartPicker(false);
    if (time) setStartTime(time);
  };

  const handleEndTimeChange = (event: any, time?: Date) => {
    setShowEndPicker(false);
    if (time) setEndTime(time);
  };

  // Lọc kết hợp Tìm kiếm Tên + Sức chứa
  const filteredRooms = availableRooms.filter((room: any) => {
    const keyword = searchText.trim().toLowerCase();
    const matchesSearch = room.name?.toLowerCase().includes(keyword);

    if (!matchesSearch) return false;

    if (capacityFilter === "small" && room.capacity >= 30) return false;
    if (
      capacityFilter === "medium" &&
      (room.capacity < 30 || room.capacity > 50)
    )
      return false;
    if (capacityFilter === "large" && room.capacity <= 50) return false;

    return true;
  });

  // Màn hình Loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Đang tra cứu phòng trống...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Màn hình Lỗi
  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Không thể tải danh sách phòng</Text>
          <Text style={styles.errorSubText}>
            Vui lòng kiểm tra lại kết nối mạng của bạn.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* KHU VỰC BỘ LỌC CÓ ANIMATION */}
        <Animated.View style={{ opacity: headerFade }}>
          {/* THANH TÌM KIẾM */}
          <View style={styles.searchBox}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm phòng theo tên (ví dụ: A101, B202)..."
                placeholderTextColor="#94a3b8"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Text style={styles.clearIcon}>✖</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* BẢNG LỌC THỜI GIAN & SỨC CHỨA */}
          <View style={styles.filterCard}>
            {/* Chọn ngày */}
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>📅 Ngày đặt phòng</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString("vi-VN", {
                    weekday: "short",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.timeContainer}>
              <View style={styles.timeItem}>
                <Text style={styles.filterTitle}>⏰ Bắt đầu</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.dateButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.dateText}>
                    {startTime.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timeItem}>
                <Text style={styles.filterTitle}>⌛ Kết thúc</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.dateButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.dateText}>
                    {endTime.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                onChange={handleStartTimeChange}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={true}
                onChange={handleEndTimeChange}
              />
            )}

            {/* Lọc sức chứa (Capacity Chips) */}
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>👥 Sức chứa phòng</Text>
              <View style={styles.filterRow}>
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "small", label: "< 30" },
                  { id: "medium", label: "30 - 50" },
                  { id: "large", label: "> 50" },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={[
                      styles.filterButton,
                      capacityFilter === item.id && styles.activeFilter,
                    ]}
                    onPress={() => setCapacityFilter(item.id as any)}
                  >
                    <Text
                      style={
                        capacityFilter === item.id
                          ? styles.activeFilterText
                          : styles.filterText
                      }
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* HEADER KẾT QUẢ */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>Phòng khả dụng</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{filteredRooms.length} phòng</Text>
          </View>
        </View>

        {/* DANH SÁCH PHÒNG CÓ ANIMATION TỪNG ITEM */}
        <FlatList
          data={filteredRooms}
          key={columns}
          keyExtractor={(item) => item.id.toString()}
          numColumns={columns}
          columnWrapperStyle={columns > 1 ? styles.column : undefined}
          renderItem={({ item, index }) => (
            <AnimatedRoomCard index={index}>
              <RoomCard
                room={item}
                width={cardWidth}
                onPress={() =>
                  navigation.navigate("RoomDetail", {
                    room: item,
                    roomId: item.id,
                    startAt: startAt.toISOString(),
                    endAt: endAt.toISOString(),
                  })
                }
              />
            </AnimatedRoomCard>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🏫</Text>
              <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
              <Text style={styles.emptySub}>
                Hãy thay đổi khung giờ hoặc điều chỉnh bộ lọc sức chứa
              </Text>
            </View>
          }
          contentContainerStyle={styles.list}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    color: "#475569",
    fontSize: 15,
    fontWeight: "600",
  },
  errorIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#dc2626",
  },
  errorSubText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },

  // SEARCH BOX
  searchBox: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  clearIcon: {
    fontSize: 14,
    color: "#94a3b8",
    padding: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },

  // FILTER CARD CONTAINER
  filterCard: {
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  filterBox: {
    width: "100%",
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    color: "#334155",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  chevron: {
    fontSize: 10,
    color: "#64748b",
  },
  timeContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  timeItem: {
    flex: 1,
  },

  // CAPACITY FILTER CHIPS
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  activeFilter: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  activeFilterText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  // RESULT HEADER & BADGE
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginVertical: 6,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  badge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563eb",
  },

  // LIST & EMPTY STATE
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  column: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },
  emptySub: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});