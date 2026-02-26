import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";


type Props = {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
};

const LibraryTabs: React.FC<Props> = ({
  tabs,
  activeTab,
  onChange,
}) => {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const active = activeTab === tab;

        return (
          <TouchableOpacity
            key={tab}
            style={styles.item}
            onPress={() => onChange(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {tab}
            </Text>

            {active && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default LibraryTabs;

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginBottom: 12,
  },

  item: {
    marginRight: 28,
    paddingBottom: 10,
    alignItems: "flex-start",
  },

  text: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },

  activeText: {
    color: "#6C63FF",
    fontWeight: "700",
  },

  indicator: {
    height: 3,
    backgroundColor: "#6C63FF",
    borderRadius: 2,
    marginTop: 6,
    width: "100%", // matches text width
  },
});
