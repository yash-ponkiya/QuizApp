import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from "./ViewAll/ViewAllHeader";

const FindFriendsScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [followed, setFollowed] = useState<string[]>([]);

  useEffect(() => {
    loadUsers();
    loadFollowed();
  }, []);

  const loadUsers = async () => {
    const storedUsers = await AsyncStorage.getItem("users");
    if (storedUsers) setUsers(JSON.parse(storedUsers));
  };

  const loadFollowed = async () => {
    const data = await AsyncStorage.getItem("followedUsers");
    if (data) setFollowed(JSON.parse(data));
  };

  const toggleFollow = async (email: string) => {
    let updated: string[];

    if (followed.includes(email)) {
      updated = followed.filter((e) => e !== email);
    } else {
      updated = [...followed, email];
    }

    setFollowed(updated);
    await AsyncStorage.setItem("followedUsers", JSON.stringify(updated));
  };

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const getAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;

  const inviteFriends = async () => {
    await Share.share({
      message:
        "🎉 Join me on Quizzo! Play fun quizzes with friends. Download now: https://quizzo.app",
    });
  };

  const renderUser = ({ item }: any) => {
    const isFollowed = followed.includes(item.email);

    return (
      <View style={styles.userRow}>
        <Image source={{ uri: getAvatar(item.email) }} style={styles.avatar} />
        <Text style={styles.userName}>{item.fullName}</Text>

        <TouchableOpacity
          style={[
            styles.followBtn,
            isFollowed && { backgroundColor: "#E5E5E5" },
          ]}
          onPress={() => toggleFollow(item.email)}
        >
          <Text
            style={[
              styles.followText,
              isFollowed && { color: "#333" },
            ]}
          >
            {isFollowed ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Back always visible */}
      <AppHeader
        title="Find Friends"
        showBack={true}
      />

      {/* Search box */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search email, name, or phone number"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setIsSearchMode(true);
          }}
          style={styles.searchInput}
        />
      </View>

      {isSearchMode ? (
        <FlatList
          data={search.length ? filteredUsers : users}
          keyExtractor={(item, i) => i.toString()}
          renderItem={renderUser}
        />
      ) : (
        <>
          <View style={styles.card}>
            <OptionRow
              icon="book-outline"
              title="Search Contact"
              subtitle="Find friends by phone number"
              onPress={() => setIsSearchMode(true)}
            />
            <OptionRow
              icon="logo-facebook"
              title="Connect to Facebook"
              subtitle="Find contacts via Facebook"
            />
            <OptionRow
              icon="paper-plane-outline"
              title="Invite Friends"
              subtitle="Invite friends to play together"
              onPress={inviteFriends}
            />
          </View>

          <View style={styles.peopleHeader}>
            <Text style={styles.peopleTitle}>People you may know</Text>
            <TouchableOpacity onPress={() => setIsSearchMode(true)}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={users.slice(0, 10)}
            keyExtractor={(item, i) => i.toString()}
            renderItem={renderUser}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const OptionRow = ({ icon, title, subtitle, onPress }: any) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#6C4EFF" />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSub}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 20,
  },

  searchInput: { flex: 1, marginLeft: 6 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 24,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  optionTitle: { fontWeight: "600" },
  optionSub: { fontSize: 12, color: "#777" },

  peopleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  peopleTitle: { fontSize: 16, fontWeight: "700" },
  viewAll: { color: "#6C4EFF", fontWeight: "600" },

  userRow: {
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

  userName: { flex: 1, fontWeight: "600" },

  followBtn: {
    backgroundColor: "#6C4EFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },

  followText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default FindFriendsScreen;
