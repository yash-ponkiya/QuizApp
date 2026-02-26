import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeHeader from "./QuizzoCollectionsHeader";

type Props = {
  onSearch?: () => void;
};

const LibraryHeader = ({ onSearch }: Props) => {
  return (
    <View style={styles.container}>

      <HomeHeader title="Library" showNotifications={false} 
        showSearch={true} onSearchPress={onSearch}
      />
</View>
  );
};

export default LibraryHeader;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 4, paddingTop: 10 },
  
});
