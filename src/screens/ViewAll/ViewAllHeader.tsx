import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export default function AppHeader({ title, showBack = true }: Props) {
  const navigation: any = useNavigation();

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 22 }} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={{ width: 22 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
});
