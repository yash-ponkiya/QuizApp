import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void; // ✅ This allows the TestScreen to pass its custom logic
};

export default function AppHeader({ title, showBack = true, onBack }: Props) {
  const navigation: any = useNavigation();

  const handlePress = () => {
    if (onBack) {
      // ✅ If TestScreen (or any other screen) provides a custom function, run it
      onBack();
    } else {
      // ✅ Default behavior for all other screens
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={handlePress}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 22 }} />
      )}

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={{ width: 22 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
});