import React, { useMemo } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import BookingPreview from "../components/profile/BookingPreview";

import { useBookings } from "../hooks/useBookings";

import { useAuth } from "../context/AuthContext";

import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

 // AuthContext mới
  const {
    user,
    signOut,
  } = useAuth();
  const userId = user?.id;

  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useBookings(userId);

  const stats = useMemo(() => {
    const now = new Date();

    const total = bookings.length;

    const upcoming = bookings.filter(
      (booking: any) => {
        const date =
          booking?.date ||
          booking?.booking_date;

        if (!date) {
          return false;
        }

        const bookingDate = new Date(date);

        return bookingDate >= now;
      }
    ).length;

    const completed =
      total - upcoming;

    return {
      total,
      upcoming,
      completed,
    };
  }, [bookings]);

  const recentBookings = bookings.slice(0, 3);
  

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert(
                "Lỗi",
                "Không thể đăng xuất"
              );
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleBookings = () => {
    navigation.navigate("MyBookings");
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <View style={styles.topSection}>
        <Text style={styles.title}>
          Hồ sơ cá nhân
        </Text>

        <Text style={styles.subtitle}>
          Quản lý tài khoản và lịch sử đặt phòng
        </Text>
      </View>

      {/* PROFILE */}

      <ProfileHeader
        name={
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          "Nguyễn Văn A"
        }
        email={
          user?.email ||
          "student@vku.udn.vn"
        }
        role="Sinh viên"
        avatar={
          user?.user_metadata?.avatar_url ||
          null
        }
        onEdit={handleEditProfile}
      />

      {/* STATS */}

      <ProfileStats
        total={stats.total}
        upcoming={stats.upcoming}
        completed={stats.completed}
      />

      {/* BOOKING */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Đặt phòng gần đây
          </Text>

          <TouchableOpacity
            onPress={handleBookings}
          >
            <Text style={styles.seeAll}>
              Xem tất cả
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator
              size="small"
              color="#2563EB"
            />

            <Text style={styles.loadingText}>
              Đang tải lịch sử...
            </Text>
          </View>
        ) : isError ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>
              ⚠️
            </Text>

            <Text style={styles.emptyText}>
              Không thể tải lịch sử đặt phòng
            </Text>

            <TouchableOpacity
              onPress={() => refetch()}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>
                Thử lại
              </Text>
            </TouchableOpacity>
          </View>
        ) : recentBookings.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>
              📅
            </Text>

            <Text style={styles.emptyText}>
              Bạn chưa có lịch sử đặt phòng
            </Text>

            <Text style={styles.emptySubText}>
              Hãy chọn một phòng để bắt đầu đặt
            </Text>
          </View>
        ) : (
          recentBookings.map(
            (booking: any, index: number) => (
              <BookingPreview
                key={
                  booking?.id ||
                  booking?.booking_id ||
                  index
                }
                booking={booking}
                onPress={handleBookings}
              />
            )
          )
        )}
      </View>

      {/* MENU */}

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>
          Tài khoản
        </Text>

        <MenuItem
          icon="👤"
          title="Thông tin cá nhân"
          subtitle="Cập nhật thông tin tài khoản"
          onPress={handleEditProfile}
        />

        <MenuItem
          icon="📅"
          title="Lịch sử đặt phòng"
          subtitle="Xem tất cả các lần đặt phòng"
          onPress={handleBookings}
        />

        <MenuItem
          icon="🔔"
          title="Thông báo"
          subtitle="Quản lý thông báo"
          onPress={() => {
            Alert.alert(
              "Thông báo",
              "Tính năng đang được phát triển."
            );
          }}
        />

        <MenuItem
          icon="⚙️"
          title="Cài đặt"
          subtitle="Cài đặt ứng dụng"
          onPress={() => {
            Alert.alert(
              "Cài đặt",
              "Tính năng đang được phát triển."
            );
          }}
        />
      </View>

      {/* LOGOUT */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutIcon}>
          🚪
        </Text>

        <Text style={styles.logoutText}>
          Đăng xuất
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>
        Room Booking • VKU
        {"\n"}
        Version 1.0.0
      </Text>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIcon}>
        <Text style={styles.menuIconText}>
          {icon}
        </Text>
      </View>

      <View style={styles.menuContent}>
        <Text style={styles.menuItemTitle}>
          {title}
        </Text>

        <Text style={styles.menuItemSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Text style={styles.arrow}>
        ›
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  topSection: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },

  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  seeAll: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },

  loading: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 13,
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  emptySubText: {
    marginTop: 5,
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },

  menu: {
    marginTop: 25,
    marginHorizontal: 16,
  },

  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  menuItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  menuIconText: {
    fontSize: 20,
  },

  menuContent: {
    flex: 1,
    marginLeft: 12,
  },

  menuItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  menuItemSubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 3,
  },

  arrow: {
    fontSize: 26,
    color: "#9CA3AF",
    marginLeft: 8,
  },

  logoutButton: {
    marginHorizontal: 16,
    marginTop: 15,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 14,
  },

  version: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 20,
    lineHeight: 17,
  },

  bottomSpace: {
    height: 40,
  },
});