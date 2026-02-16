import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import UniversalCard from "../../components/UniversalCard";

export default function HomeTab() {
  const navigation: any = useNavigation();

  const [authors, setAuthors] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const getAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;

  const loadData = async () => {
    const usersData = await AsyncStorage.getItem("users");
    const followedData = await AsyncStorage.getItem("followedUsers");
    const collectionsData = await AsyncStorage.getItem("collections");
    const quizzesData = await AsyncStorage.getItem("quizzes");

    const users = usersData ? JSON.parse(usersData) : [];
    const followed = followedData ? JSON.parse(followedData) : [];
    const quizzesList = quizzesData ? JSON.parse(quizzesData) : [];

    /* ================= AUTHORS ================= */
    if (users.length && followed.length) {
      const list = users.filter((u: any) => followed.includes(u.email));
      setAuthors(list);
    } else {
      setAuthors([]);
    }

    /* ================= COLLECTIONS ================= */
    if (collectionsData) {
      const all = JSON.parse(collectionsData);
      const publicCollections = all.filter(
        (c: any) => c.visibleTo === "Public"
      );
      setCollections(publicCollections);
    } else {
      setCollections([]);
    }

    /* ================= QUIZZES + USERNAME ================= */
    if (quizzesList.length) {
      const enriched = quizzesList.map((q: any) => {
        const user = users.find(
          (u: any) =>
            u.email === q.authorEmail ||
            u.username === q.authorUsername ||
            u.username === q.author
        );

        return {
          ...q,
          authorName:
            user?.username ||
            q.authorUsername ||
            q.author ||
            "Unknown",
        };
      });

      setQuizzes(enriched);
    } else {
      setQuizzes([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Ionicons name="help-circle" size={26} color="#6C4EFF" />
              <Text style={styles.logoText}>Quizzo</Text>
            </View>

            <View style={styles.headerIcons}>
              <Ionicons name="search" size={22} />
              <Ionicons name="notifications-outline" size={22} />
            </View>
          </View>

          {/* HERO */}
          <LinearGradient
            colors={["#8E7CFF", "#6C4EFF"]}
            style={styles.hero}
          >
            <Text style={styles.heroText}>
              Play quiz together with{"\n"}your friends now!
            </Text>

            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => navigation.navigate("FindFriends")}
            >
              <Text style={styles.heroBtnText}>Find Friends</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* DISCOVER */}
          {quizzes.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Discover</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("DiscoverTest")}
                >
                  <Text style={styles.viewAll}>View all →</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {quizzes.map((q, i) => (
                  <UniversalCard
                    key={i}
                    variant="discover"
                    image={
                      q.image ||
                      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                    }
                    title={q.title}
                    subtitle={q.authorName}
                    avatar={`https://i.pravatar.cc/100?u=${q.authorName}`}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* TOP AUTHORS */}
          {authors.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Top Authors</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("FollowedAuthors")}
                >
                  <Text style={styles.viewAll}>View all →</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {authors.map((u, i) => (
                  <UniversalCard
                    key={i}
                    variant="author"
                    image={getAvatar(u.email)}
                    title={u.fullName}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* TOP COLLECTIONS */}
          {collections.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Top Collections</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Collections")}
                >
                  <Text style={styles.viewAll}>View all →</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {collections.map((c, i) => (
                  <UniversalCard
                    key={i}
                    variant="collection"
                    image={
                      c.image ||
                      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                    }
                    title={c.title}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  container: { paddingHorizontal: 20, paddingTop: 10 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  logoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoText: { fontSize: 20, fontWeight: "700" },
  headerIcons: { flexDirection: "row", gap: 16 },

  hero: {
    borderRadius: 18,
    padding: 20,
    height: 150,
    marginBottom: 20,
  },

  heroText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },

  heroBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  heroBtnText: { color: "#6C4EFF", fontWeight: "600" },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 6,
  },

  sectionTitle: { fontSize: 18, fontWeight: "700" },
  viewAll: { color: "#6C4EFF", fontWeight: "600" },
});
