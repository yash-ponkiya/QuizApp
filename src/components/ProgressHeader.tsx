import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressHeader({ navigation, progress }: any) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} />
      </TouchableOpacity>

      <View style={styles.bar}>
        <View style={[styles.fill, { width: progress }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  bar: {
    flex: 1,
    height: 6,
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    marginLeft: 10
  },
  fill: {
    height: 6,
    backgroundColor: "#6C4EFF",
    borderRadius: 10
  }
});
