import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  total: number;
  upcoming: number;
  completed: number;
};

export default function ProfileStats({
  total,
  upcoming,
  completed,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.number}>{total}</Text>
        <Text style={styles.label}>Tổng lượt đặt</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.number}>{upcoming}</Text>
        <Text style={styles.label}>Sắp tới</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.number}>{completed}</Text>
        <Text style={styles.label}>Đã dùng</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 18,
    paddingVertical: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  item: {
    flex: 1,
    alignItems: "center",
  },

  number: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 4,
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },

  divider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },
});