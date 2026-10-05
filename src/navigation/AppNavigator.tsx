import React from "react";
import { StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import BrowseRoomsScreen from "../screens/BrowseRoomsScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RoomDetailScreen from "../screens/RoomDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* =========================
   MAIN TABS
========================= */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Tự động chọn Icon phù hợp theo Tab và Trạng thái Active/Inactive
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Browse") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "MyBookings") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // Màu sắc chủ đạo (Primary active color: Xanh hiện đại)
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",

        // Tùy chỉnh Kiểu dáng cho Bottom Tab Bar
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,

        // Định dạng Header chung căn giữa chuyên nghiệp
        headerTitleAlign: "center",
        headerTitleStyle: styles.headerTitle,
        headerStyle: styles.header,
      })}
    >
      <Tab.Screen
        name="Browse"
        component={BrowseRoomsScreen}
        options={{
          title: "Phòng",
          headerTitle: "Danh Sách Phòng",
        }}
      />

      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          title: "Lịch đặt",
          headerTitle: "Lịch Đặt Của Tôi",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Hồ sơ",
          headerTitle: "Trang Cá Nhân",
        }}
      />
    </Tab.Navigator>
  );
}

/* =========================
   APP NAVIGATOR
========================= */
export default function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
        }}
      >
        {!session ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Đăng nhập", headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Đăng ký" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RoomDetail"
              component={RoomDetailScreen}
              options={{ title: "Chi tiết phòng" }}
            />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 0,
    elevation: 10, // Bóng đổ rõ trên Android
    shadowColor: "#000", // Bóng đổ mượt trên iOS
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    height: Platform.OS === "ios" ? 88 : 65,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  header: {
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
});