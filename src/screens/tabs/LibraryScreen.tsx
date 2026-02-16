import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import LibraryHeader from "../../components/LibraryHeader";
import LibraryTabs from "../../components/LibraryTabs";
import { SafeAreaView } from "react-native-safe-area-context";
import MyQuizzoTab from "../tabs/MyQuizzoTab";
import FavoritesTab from "../tabs/FavoritesTab";
import CollaborationTab from "../tabs/CollaborationTab";

const TABS = ["My Quizzo", "Favorites", "Collaboration"];

const LibraryScreen = () => {
  const [activeTab, setActiveTab] = useState("Collaboration");

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
});
