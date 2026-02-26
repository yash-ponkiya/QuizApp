import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  inviteCount?: number;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
};

export default function HomeHeader({
  title = "Quizzo",
  showSearch = true,
  showNotifications = true,
  inviteCount = 0,
  onSearchPress,
  onNotificationsPress,
}: Props) {
  return (
    <View style={styles.header}>
      {/* Logo + Title */}
      <View style={styles.logoRow}>
        <Ionicons name="help-circle" size={26} color="#6C4EFF" />
        <Text style={styles.logoText}>{title}</Text>
      </View>

      {/* Right Icons */}
      <View style={styles.headerIcons}>
        {showSearch && (
          <TouchableOpacity onPress={onSearchPress}>
            <Ionicons name="search" size={22} />
          </TouchableOpacity>
        )}

        {showNotifications && (
          <TouchableOpacity onPress={onNotificationsPress}>
            <View>
              <Ionicons name="notifications-outline" size={22} />

              {inviteCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{inviteCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  logoText: {
    fontSize: 20,
    fontWeight: "700",
  },

  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});