import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

import AppHeader from "./ViewAll/ViewAllHeader";

export default function SearchScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();

  const initialTab = route.params?.tab || "Quiz";

  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState("");

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  const TABS = ["Quiz", "People", "Collections"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const usersData = await AsyncStorage.getItem("users");
    const quizzesData = await AsyncStorage.getItem("quizzes");
    const collectionsData = await AsyncStorage.getItem("collections");
    const followedData = await AsyncStorage.getItem("followedUsers");

    setUsers(usersData ? JSON.parse(usersData) : []);
    setQuizzes(quizzesData ? JSON.parse(quizzesData) : []);
    setCollections(collectionsData ? JSON.parse(collectionsData) : []);
    setFollowed(followedData ? JSON.parse(followedData) : []);

    setLoading(false);
  };

  const toggleFollow = async (email: string) => {
    let updated: string[] = [];

    if (followed.includes(email)) {
      updated = followed.filter((e) => e !== email);
    } else {
      updated = [...followed, email];
    }

    setFollowed(updated);
    await AsyncStorage.setItem("followedUsers", JSON.stringify(updated));
  };

  const getFilteredData = () => {
    let list: any[] = [];

    if (tab === "Quiz") {
      list = quizzes.filter((q) =>
        q.title?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (tab === "People") {
      list = users.filter((u) =>
        u.fullName?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (tab === "Collections") {
      list = collections.filter((c) =>
        c.title?.toLowerCase().includes(query.toLowerCase())
      );
    }

    return list;
  };

  const filtered = getFilteredData();
  const data = filtered.slice(0, visibleCount);

  const loadMore = () => {
    if (visibleCount < filtered.length) {
      setVisibleCount((prev) => prev + 10);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AppHeader title="Search" />

        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Search"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.tab,
                tab === t && styles.activeTab,
              ]}
              onPress={() => {
                setTab(t);
                setVisibleCount(10);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === t && styles.activeText,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={data}
          keyExtractor={(item, i) => i.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (tab === "Quiz") {
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("TestScreen", {
                      quiz: item,
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        item.image ||
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                    }}
                    style={styles.thumb}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>
                      {item.authorName || "Unknown"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }

            if (tab === "People") {
              const isFollowing = followed.includes(item.email);

              return (
                <View style={styles.card}>
                  <Image
                    source={{
                      uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${item.email}`,
                    }}
                    style={styles.thumb}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>
                      {item.fullName}
                    </Text>
                    <Text style={styles.subtitle}>
                      @{item.username}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.followBtn,
                      isFollowing && styles.followingBtn,
                    ]}
                    onPress={() => toggleFollow(item.email)}
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
              );
            }

            if (tab === "Collections") {
              return (
                <View style={styles.card}>
                  <Image
                    source={{
                      uri:
                        item.image ||
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                    }}
                    style={styles.thumb}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>
                      {item.title}
                    </Text>
                  </View>
                </View>
              );
            }

            return null;
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No results found
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { paddingHorizontal: 20, paddingTop: 10 },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 14,
  },

  input: { marginLeft: 6, flex: 1 },

  tabs: { flexDirection: "row", marginBottom: 14 },

  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 24,
    marginHorizontal: 4,
  },

  activeTab: { backgroundColor: "#6C4EFF" },
  tabText: { color: "#6C4EFF", fontWeight: "600" },
  activeText: { color: "#fff" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  thumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginRight: 12,
  },

  title: { fontWeight: "700", marginBottom: 3 },
  subtitle: { color: "#777", fontSize: 12 },

  followBtn: {
    borderWidth: 1,
    borderColor: "#6C4EFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 22,
  },

  followText: {
    color: "#6C4EFF",
    fontWeight: "600",
    fontSize: 13,
  },

  followingBtn: {
    backgroundColor: "#6C4EFF",
  },

  followingText: {
    color: "#fff",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
