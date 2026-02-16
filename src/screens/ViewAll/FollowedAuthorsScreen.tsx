import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "./ViewAllHeader";

export default function FollowedAuthorsScreen() {
  const [authors, setAuthors] = useState<any[]>([]);

  const getAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    const usersData = await AsyncStorage.getItem("users");
    const followedData = await AsyncStorage.getItem("followedUsers");

    if (!usersData || !followedData) {
      setAuthors([]);
      return;
    }

    const users = JSON.parse(usersData);
    const followed = JSON.parse(followedData);

    const list = users.filter((u: any) =>
      followed.includes(u.email)
    );

    setAuthors(list);
  };

  const unfollow = async (email: string) => {
    const data = await AsyncStorage.getItem("followedUsers");
    if (!data) return;

    const followed = JSON.parse(data);
    const updated = followed.filter((e: string) => e !== email);

    await AsyncStorage.setItem("followedUsers", JSON.stringify(updated));

    setAuthors(prev => prev.filter(u => u.email !== email));
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <Image
        source={{ uri: getAvatar(item.email) }}
        style={styles.avatar}
      />

      <Text style={styles.name}>{item.fullName}</Text>

      <TouchableOpacity
        style={styles.unfollowBtn}
        onPress={() => unfollow(item.email)}
      >
        <Text style={styles.unfollowText}>Unfollow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Followed Authors" />

      <FlatList
        data={authors}
        keyExtractor={(item) => item.email}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  name: {
    flex: 1,
    fontWeight: "600",
    fontSize: 15,
  },

  unfollowBtn: {
    backgroundColor: "#E5E5E5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },

  unfollowText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 12,
  },
});
