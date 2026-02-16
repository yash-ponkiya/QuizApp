import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity,Text } from "react-native";
import LibraryHeader from "../../components/LibraryHeader";
import LibraryTabs from "../../components/LibraryTabs";
import { SafeAreaView } from "react-native-safe-area-context";
import MyQuizzoTab from "../tabs/MyQuizzoTab";
import FavoritesTab from "../tabs/FavoritesTab";
import CollaborationTab from "../tabs/CollaborationTab";
import { useNavigation } from "@react-navigation/native";

const TABS = ["My Quizzo", "Favorites", "Collaboration"];

const LibraryScreen = () => {
  const [activeTab, setActiveTab] = useState("Collaboration");
  const navigation: any = useNavigation();

  const renderTab = () => {
    if (activeTab === "My Quizzo") return <MyQuizzoTab />;
    if (activeTab === "Favorites") return <FavoritesTab />;
    return <CollaborationTab />;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <LibraryHeader />
        <LibraryTabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {renderTab()}
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateCollection")}
      >
        <Text style={{ color: "#fff", fontSize: 24 }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
fab: {
    position: "absolute",
    right: 15,
    bottom: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
