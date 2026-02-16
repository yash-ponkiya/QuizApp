import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LibraryHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Ionicons name="library-outline" size={22} color="#6C63FF" />
        <Text style={styles.title}>Library</Text>
      </View>

      <Ionicons name="search-outline" size={22} color="#333" />
    </View>
  );
};

export default LibraryHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
});
