import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";


export default function QuizDetail() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { quiz } = route.params;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [followed, setFollowed] = useState<string[]>([]);

  const pin = quiz.id?.slice(-6) || "123456";

  const getAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;

  useEffect(() => {
    loadUser();
    loadFavorite();
    loadFollowed();
  }, []);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem("currentUser");
    if (data) setCurrentUser(JSON.parse(data));
  };

  const loadFavorite = async () => {
    const data = await AsyncStorage.getItem("favoriteQuizzes");
    const favs = data ? JSON.parse(data) : [];
    setIsFavorite(favs.some((q: any) => q.id === quiz.id));
  };

  const loadFollowed = async () => {
    const data = await AsyncStorage.getItem("followedUsers");
    if (data) setFollowed(JSON.parse(data));
  };

  const toggleFavorite = async () => {
    const data = await AsyncStorage.getItem("favoriteQuizzes");
    let favs = data ? JSON.parse(data) : [];

    const exists = favs.some((q: any) => q.id === quiz.id);

    if (exists) {
      favs = favs.filter((q: any) => q.id !== quiz.id);
      setIsFavorite(false);
    } else {
      favs.push(quiz);
      setIsFavorite(true);
    }

    await AsyncStorage.setItem("favoriteQuizzes", JSON.stringify(favs));
  };

  const toggleFollow = async () => {
    let updated: string[];

    if (followed.includes(quiz.authorEmail)) {
      updated = followed.filter((e) => e !== quiz.authorEmail);
    } else {
      updated = [...followed, quiz.authorEmail];
    }

    setFollowed(updated);
    await AsyncStorage.setItem("followedUsers", JSON.stringify(updated));
  };

  const shareQuiz = async () => {
    await Share.share({
      message: `Join my quiz "${quiz.title}" using PIN: ${pin}`,
    });
  };

  const isAuthor = currentUser?.email === quiz.authorEmail;
  const isFollowing = followed.includes(quiz.authorEmail);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={26} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "star" : "star-outline"}
                size={22}
                color={isFavorite ? "#FFD700" : "#333"}
                style={{ marginRight: 16 }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="ellipsis-horizontal" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {/* COVER */}
        {quiz.image && (
          <Image source={{ uri: quiz.image }} style={styles.cover} />
        )}

        {/* TITLE */}
        <Text style={styles.title}>{quiz.title}</Text>

        {/* AUTHOR */}
        <View style={styles.authorRow}>
          <View style={styles.authorLeft}>
            <Image
              source={{
                uri: getAvatar(quiz.authorEmail || quiz.authorUsername),
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.authorName}>{quiz.authorUsername}</Text>
              <Text style={styles.authorHandle}>
                @{quiz.authorUsername}
              </Text>
            </View>
          </View>

          {isAuthor ? (
            <View style={styles.youBadge}>
              <Text style={styles.youText}>You</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.followBtn,
                isFollowing && styles.followingBtn,
              ]}
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
          )}
        </View>
      </ScrollView>

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.playSolo}
          onPress={() => navigation.navigate("TestScreen", { quiz })}
        >
          <Text style={styles.playSoloText}>Play Solo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playFriends}
          onPress={() => navigation.navigate("TestScreen", { quiz })}
        >
          <Text style={styles.playFriendsText}>Play with Friends</Text>
        </TouchableOpacity>
      </View>

      {/* MENU */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuBox}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                shareQuiz();
              }}
            >
              <Ionicons name="share-outline" size={18} />
              <Text style={styles.menuText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                setQrVisible(true);
              }}
            >
              <Ionicons name="qr-code-outline" size={18} />
              <Text style={styles.menuText}>
                Generate PIN & QR Code
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* CENTER QR MODAL */}
      <Modal visible={qrVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setQrVisible(false)}>
          <View style={styles.qrOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.qrBox}>
                <TouchableOpacity
                  style={styles.qrClose}
                  onPress={() => setQrVisible(false)}
                >
                  <Ionicons name="close" size={20} />
                </TouchableOpacity>

                <Text style={styles.qrTitle}>Join Quiz</Text>

                <QRCode value={quiz.id} size={220} />

                <Text style={styles.pinLabel}>PIN</Text>
                <Text style={styles.pin}>{pin}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 120 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  cover: {
    width: "92%",
    height: 180,
    borderRadius: 16,
    alignSelf: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 12,
  },

  authorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  authorLeft: { flexDirection: "row", alignItems: "center" },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  authorName: { fontWeight: "700", fontSize: 14 },
  authorHandle: { color: "#777", fontSize: 12 },

  followBtn: {
    backgroundColor: "#6C4EFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },

  followText: { color: "#fff", fontWeight: "600" },

  followingBtn: {
    backgroundColor: "#E5E5E5",
  },

  followingText: {
    color: "#333",
  },

  youBadge: {
    borderWidth: 1,
    borderColor: "#6C4EFF",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
  },

  youText: {
    color: "#6C4EFF",
    fontWeight: "600",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  playSolo: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#6C4EFF",
    padding: 12,
    borderRadius: 30,
    marginRight: 10,
    alignItems: "center",
  },

  playSoloText: { color: "#6C4EFF", fontWeight: "700" },

  playFriends: {
    flex: 1,
    backgroundColor: "#6C4EFF",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },

  playFriendsText: { color: "#fff", fontWeight: "700" },

  menuOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 20,
  },

  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    width: 200,
    elevation: 4,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },

  menuText: {
    marginLeft: 10,
    fontSize: 14,
  },

  qrOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },

  qrBox: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  qrTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 14,
  },

  qrClose: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
  },

  pinLabel: {
    marginTop: 14,
    color: "#777",
  },

  pin: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 4,
  },
});
