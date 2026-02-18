import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  RefreshControl,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../ViewAll/ViewAllHeader";

export default function JoinScreen() {
  const navigation: any = useNavigation();

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [followedAuthors, setFollowedAuthors] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [invitedMap, setInvitedMap] = useState<any>({}); // ✅ ADDED

  const getAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([
      loadQuizzes(),
      loadFavorites(),
      loadFollowedAuthors(),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const loadQuizzes = async () => {
    const data = await AsyncStorage.getItem("quizzes");
    if (data) setQuizzes(JSON.parse(data));
  };

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem("favoriteQuizzes");
    const favs = data ? JSON.parse(data) : [];
    setFavorites(favs);
  };

  const isFavorite = (quizId: string) =>
    favorites.some((q: any) => q.id === quizId);

  const toggleFavorite = async (quiz: any) => {
    let favs = [...favorites];

    if (isFavorite(quiz.id)) {
      favs = favs.filter((q) => q.id !== quiz.id);
    } else {
      favs.push(quiz);
    }

    setFavorites(favs);
    await AsyncStorage.setItem("favoriteQuizzes", JSON.stringify(favs));
  };

  const loadFollowedAuthors = async () => {
    const usersData = await AsyncStorage.getItem("users");
    const followedData = await AsyncStorage.getItem("followedUsers");

    if (!usersData || !followedData) {
      setFollowedAuthors([]);
      return;
    }

    const users = JSON.parse(usersData);
    const followed = JSON.parse(followedData);

    const list = users.filter((u: any) =>
      followed.includes(u.email)
    );

    setFollowedAuthors(list);
  };

  /* ✅ LOAD INVITES WHEN MODAL OPENS */
  const openInviteModal = async (quiz: any) => {
    setSelectedQuiz(quiz);

    const data = await AsyncStorage.getItem("quizInvites");
    const invites = data ? JSON.parse(data) : [];

    const map: any = {};
    invites
      .filter((i: any) => i.quizId === quiz.id && i.status === "pending")
      .forEach((i: any) => {
        map[i.toEmail] = true;
      });

    setInvitedMap(map);
    setModalVisible(true);
  };

  const shareQuiz = async (quiz: any) => {
    try {
      await Share.share({
        title: quiz.title,
        message: `🎯 Try this quiz: "${quiz.title}"\n${quiz.questions.length} questions`,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  /* ✅ TOGGLE INVITE */
  const inviteAuthor = async (author: any) => {
    const currentUserData = await AsyncStorage.getItem("currentUser");
    const currentUser = currentUserData
      ? JSON.parse(currentUserData)
      : null;

    const data = await AsyncStorage.getItem("quizInvites");
    let invites = data ? JSON.parse(data) : [];

    const existing = invites.find(
      (i: any) =>
        i.quizId === selectedQuiz.id &&
        i.toEmail === author.email &&
        i.status === "pending"
    );

    if (existing) {
      // cancel invite
      invites = invites.filter((i: any) => i.id !== existing.id);

      setInvitedMap((prev: any) => {
        const copy = { ...prev };
        delete copy[author.email];
        return copy;
      });
    } else {
      // send invite
      invites.push({
        id: Date.now().toString(),
        quizId: selectedQuiz.id,
        quizTitle: selectedQuiz.title,
        toEmail: author.email,
        fromEmail: currentUser?.email,
        fromName:
          currentUser?.username || currentUser?.fullName || "User",
        status: "pending",
        createdAt: Date.now(),
      });

      setInvitedMap((prev: any) => ({
        ...prev,
        [author.email]: true,
      }));
    }

    await AsyncStorage.setItem("quizInvites", JSON.stringify(invites));
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Join Quiz" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6C4EFF"]}
            tintColor="#6C4EFF"
          />
        }
      >
        {quizzes.length === 0 && (
          <Text style={styles.empty}>No quizzes available</Text>
        )}

        {quizzes.map((quiz) => (
          <View key={quiz.id} style={styles.card}>
            <TouchableOpacity
              style={{ flexDirection: "row", flex: 1 }}
              onPress={() =>
                navigation.navigate("TestScreen", { quiz })
              }
            >
              {quiz.image && (
                <Image source={{ uri: quiz.image }} style={styles.image} />
              )}

              <View style={styles.info}>
                <Text style={styles.title}>{quiz.title}</Text>
                <Text style={styles.meta}>
                  {quiz.questions.length} Questions
                </Text>
                <Text style={styles.author}>
                  by {quiz.authorUsername}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => toggleFavorite(quiz)}
            >
              <Ionicons
                name={
                  isFavorite(quiz.id) ? "heart" : "heart-outline"
                }
                size={20}
                color={
                  isFavorite(quiz.id) ? "#FF3B30" : "#6C4EFF"
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => openInviteModal(quiz)}
            >
              <Ionicons name="person-add" size={20} color="#6C4EFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => shareQuiz(quiz)}
            >
              <Ionicons
                name="share-social-outline"
                size={20}
                color="#6C4EFF"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Invite Followed Authors
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={22} />
              </TouchableOpacity>
            </View>

            {followedAuthors.length === 0 && (
              <Text style={styles.noAuthors}>
                You are not following anyone
              </Text>
            )}

            <FlatList
              data={followedAuthors}
              keyExtractor={(item) => item.email}
              renderItem={({ item }) => {
                const invited = invitedMap[item.email]; // ✅ ADDED

                return (
                  <View style={styles.authorRow}>
                    <View style={styles.authorLeft}>
                      <Image
                        source={{ uri: getAvatar(item.email) }}
                        style={styles.avatar}
                      />
                      <Text style={styles.authorName}>
                        {item.fullName}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.sendBtn,
                        invited && styles.invitingBtn,
                      ]}
                      onPress={() => inviteAuthor(item)}
                    >
                      <Text
                        style={[
                          styles.sendText,
                          invited && styles.invitingText,
                        ]}
                      >
                        {invited ? "Inviting" : "Invite"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },

  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  image: { width: 90, height: 90 },

  info: { flex: 1, padding: 10, justifyContent: "center" },

  title: { fontWeight: "700", fontSize: 16, marginBottom: 4 },
  meta: { color: "#666", fontSize: 12 },
  author: {
    marginTop: 4,
    color: "#6C4EFF",
    fontSize: 12,
    fontWeight: "600",
  },

  iconBtn: {
    padding: 8,
    marginRight: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "flex-end",
  },

  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    maxHeight: "65%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  modalTitle: { fontSize: 16, fontWeight: "700" },
  noAuthors: { textAlign: "center", marginTop: 20, color: "#999" },

  authorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  authorLeft: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  authorName: { fontSize: 14, fontWeight: "600" },

  sendBtn: {
    backgroundColor: "#6C4EFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },

  sendText: { color: "#fff", fontWeight: "600" },

  invitingBtn: {
    backgroundColor: "#E5E5EA",
  },

  invitingText: {
    color: "#333",
  },
});
