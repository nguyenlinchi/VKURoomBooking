import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  onEdit?: () => void;
};

export default function ProfileHeader({
  name,
  email,
  role,
  avatar,
  onEdit,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={onEdit}
        >
          <Text style={styles.cameraText}>✎</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>
        {name || "Người dùng"}
      </Text>

      <Text style={styles.email}>
        {email || "Chưa có email"}
      </Text>

      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>
          {role || "Sinh viên"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 20,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "700",
  },

  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  cameraText: {
    fontSize: 17,
    color: "#2563EB",
    fontWeight: "700",
  },

  name: {
    fontSize: 23,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },

  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
  },

  roleText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
  },
});