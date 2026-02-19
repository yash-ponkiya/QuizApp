// ✅ ONLY ADDITIONS APPLIED — NOTHING REMOVED

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Pressable,
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
  const [inviteCount, setInviteCount] = useState(0);

  const [notifVisible, setNotifVisible] = useState(false);
  const [invites, setInvites] = useState<any[]>([]);

  const getAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;

  const loadData = async () => {
    const usersData = await AsyncStorage.getItem("users");
    const followedData = await AsyncStorage.getItem("followedUsers");
    const collectionsData = await AsyncStorage.getItem("collections");
    const quizzesData = await AsyncStorage.getItem("quizzes");
    const invitesData = await AsyncStorage.getItem("quizInvites");
    const currentUserData = await AsyncStorage.getItem("currentUser");

    const users = usersData ? JSON.parse(usersData) : [];
    const followed = followedData ? JSON.parse(followedData) : [];
    const quizzesList = quizzesData ? JSON.parse(quizzesData) : [];
    const invitesAll = invitesData ? JSON.parse(invitesData) : [];
    const currentUser = currentUserData
      ? JSON.parse(currentUserData)
      : null;

    if (users.length && followed.length) {
      setAuthors(users.filter((u: any) => followed.includes(u.email)));
    } else setAuthors([]);

    if (collectionsData) {
      const all = JSON.parse(collectionsData);
      setCollections(all.filter((c: any) => c.visibleTo === "Public"));
    } else setCollections([]);

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
    } else setQuizzes([]);

    if (currentUser) {
      const myInvites = invitesAll.filter(
        (i: any) =>
          i.toEmail === currentUser.email && i.status === "pending"
      );
      setInviteCount(myInvites.length);
      setInvites(myInvites);
    } else {
      setInviteCount(0);
      setInvites([]);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const updateInvite = async (invite: any, status: string) => {
    const data = await AsyncStorage.getItem("quizInvites");
    const all = data ? JSON.parse(data) : [];

    const updated = all.map((i: any) =>
      i.id === invite.id ? { ...i, status } : i
    );

    await AsyncStorage.setItem("quizInvites", JSON.stringify(updated));

    loadData();

    if (status === "accepted") {
      const quizzesData = await AsyncStorage.getItem("quizzes");
      const quizzes = quizzesData ? JSON.parse(quizzesData) : [];

      const quiz = quizzes.find((q: any) => q.id === invite.quizId);

      setNotifVisible(false);

      if (quiz) {
        navigation.navigate("TestScreen", { quiz });
      }
    }
  };

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
              <TouchableOpacity
                onPress={() => navigation.navigate("Search")}
              >
                <Ionicons name="search" size={22} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setNotifVisible(true)}>
                <View>
                  <Ionicons name="notifications-outline" size={22} />
                  {inviteCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {inviteCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
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
                    onPress={() => navigation.navigate("QuizDetail", { quiz: q })}
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
                    onPress={() =>
                      navigation.navigate("AuthorProfile", { user: u })
                    }
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

      {/* NOTIFICATION MODAL */}
      <Modal transparent visible={notifVisible} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setNotifVisible(false)}
        >
          <Pressable style={styles.modalBox}>
            <Text style={styles.modalTitle}>Invitations</Text>

            <FlatList
              data={invites}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 350 }}
              renderItem={({ item }) => (
                <View style={styles.inviteRow}>
                  <Text style={styles.inviteText}>
                    <Text style={styles.bold}>
                      {item.fromName}
                    </Text>{" "}
                    invited you to{" "}
                    <Text style={styles.bold}>
                      {item.quizTitle}
                    </Text>
                  </Text>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.accept}
                      onPress={() => updateInvite(item, "accepted")}
                    >
                      <Text style={styles.btnText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.reject}
                      onPress={() => updateInvite(item, "rejected")}
                    >
                      <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>No invites</Text>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
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

  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  hero: { borderRadius: 18, padding: 20, height: 150, marginBottom: 20 },
  heroText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  heroBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    maxHeight: 300,
  },

  modalTitle: { fontWeight: "700", fontSize: 16, marginBottom: 10 },
  empty: { textAlign: "center", marginTop: 20, color: "#999" },

  inviteRow: {
    borderBottomWidth: 1,
    borderColor: "#EEE",
    paddingVertical: 10,
  },

  inviteText: { fontSize: 13 },
  bold: { fontWeight: "700", color: "#6C4EFF" },

  actions: { flexDirection: "row", gap: 10, marginTop: 6 },

  accept: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  reject: {
    backgroundColor: "#F44336",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  btnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
