import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../screens/ViewAll/ViewAllHeader";

export default function AuthorProfileScreen() {
  const route: any = useRoute();
  const routeUser = route.params?.user;

  const [user, setUser] = useState<any>(routeUser);
  const [followed, setFollowed] = useState<string[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  const avatar = `https://api.dicebear.com/7.x/avataaars/png?seed=${user?.email}`;

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const cu = await AsyncStorage.getItem("currentUser");
    const f = await AsyncStorage.getItem("followedUsers");
    const q = await AsyncStorage.getItem("quizzes");
    const c = await AsyncStorage.getItem("collections");

    const current = cu ? JSON.parse(cu) : null;
    const allQuizzes = q ? JSON.parse(q) : [];
    const allCollections = c ? JSON.parse(c) : [];
    const followedList = f ? JSON.parse(f) : [];

    const profileUser = routeUser || current;

    setUser(profileUser);
    setFollowed(followedList);

    setQuizzes(
      allQuizzes.filter((item: any) => item.createdBy === profileUser.email)
    );

    setCollections(
      allCollections.filter(
        (item: any) => item.createdBy === profileUser.email
      )
    );
  };

  const toggleFollow = async () => {
    let updated = [...followed];

    if (updated.includes(user.email)) {
      updated = updated.filter((e) => e !== user.email);
    } else {
      updated.push(user.email);
    }

    setFollowed(updated);
    await AsyncStorage.setItem("followedUsers", JSON.stringify(updated));
  };

  const isFollowing = followed.includes(user?.email);

  const Stat = ({ label, value }: any) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Profile" showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* COVER */}
        <View style={styles.cover} />

        {/* PROFILE */}
        <View style={styles.profileRow}>
          <Image source={{ uri: avatar }} style={styles.avatar} />

          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.fullName}</Text>
              <Ionicons name="checkmark-circle" size={16} color="#4F8EF7" />
            </View>
            <Text style={styles.username}>@{user.username}</Text>
          </View>

          <TouchableOpacity
            style={[styles.followBtn, isFollowing && styles.followingBtn]}
            onPress={toggleFollow}
          >
            <Text
              style={[
                styles.followText,
                isFollowing && styles.followingText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <View style={styles.stats}>
          <Stat label="Quizzo" value={quizzes.length} />
          <Stat label="Plays" value="0" />
          <Stat label="Players" value="0" />
        </View>

        <View style={styles.stats}>
          <Stat label="Collections" value={collections.length} />
          <Stat label="Followers" value={followed.length} />
          <Stat label="Following" value="0" />
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  cover: {
    height: 120,
    borderRadius: 16,
    marginTop: 10,
    backgroundColor: "#C9C3FF",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    marginRight: 12,
  },

  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  name: { fontWeight: "700", fontSize: 16 },

  username: { color: "#777", fontSize: 12 },

  followBtn: {
    borderWidth: 1,
    borderColor: "#6C4EFF",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },

  followText: { color: "#6C4EFF", fontWeight: "600" },

  followingBtn: { backgroundColor: "#6C4EFF" },

  followingText: { color: "#fff" },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },

  statItem: { alignItems: "center" },

  statValue: { fontWeight: "700", fontSize: 16 },

  statLabel: { color: "#777", fontSize: 12 },

  about: { paddingVertical: 16 },

  aboutText: { color: "#555", lineHeight: 20 },
});
