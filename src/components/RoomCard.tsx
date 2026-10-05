import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";

import Animated, {
  FadeInDown,
} from "react-native-reanimated";

import { Room } from "../types/Room";

interface Props {
  room: Room;
  width?: number;
  onPress: () => void;
}

export default function RoomCard({
  room,
  width,
  onPress,
}: Props) {

  const available =
    room.status === "available";

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={[
        width ? { width } : null,
      ]}
    >

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && {
            opacity: 0.8,
          },
        ]}
      >

        <Image
          source={{
            uri: room.image,
          }}
          style={styles.image}
        />


        <View style={styles.content}>

          <View style={styles.row}>

            <Text
              style={styles.name}
              numberOfLines={1}
            >
              {room.name}
            </Text>

            <View
              style={[
                styles.badge,
                available
                  ? styles.available
                  : styles.unavailable,
              ]}
            >

              <Text
                style={[
                  styles.badgeText,
                  available
                    ? styles.availableText
                    : styles.unavailableText,
                ]}
              >
                {room.status === "available"
                  ? "Available"
                  : room.status === "occupied"
                  ? "Occupied"
                  : "Maintenance"}
              </Text>

            </View>

          </View>

          <Text style={styles.location}>
            📍 {room.building} · {room.location}
          </Text>

          <Text style={styles.capacity}>
            👥 {room.capacity} seats
          </Text>

          {/* TYPE */}
          <Text style={styles.type}>
            {room.type}
          </Text>

        </View>

      </Pressable>

    </Animated.View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,

    elevation: 3,
  },

  image: {
    width: "100%",
    height: 150,
  },

  content: {
    padding: 13,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#172554",
    marginRight: 8,
  },

  location: {
    marginTop: 8,
    color: "#64748B",
  },

  capacity: {
    marginTop: 5,
    color: "#64748B",
  },

  type: {
    marginTop: 7,
    color: "#3157C8",
    fontWeight: "700",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  available: {
    backgroundColor: "#DCFCE7",
  },

  unavailable: {
    backgroundColor: "#FEE2E2",
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },

  availableText: {
    color: "#15803D",
  },

  unavailableText: {
    color: "#B91C1C",
  },

});