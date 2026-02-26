import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "./ViewAll/ViewAllHeader";

export default function CollectionDetailScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();

  const { collection } = route.params;

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [author, setAuthor] = useState<any>(null);

  useEffect(() => {
    loadCollectionData();
  }, []);

  const loadCollectionData = async () => {
    const quizzesData = await AsyncStorage.getItem("quizzes");
    const usersData = await AsyncStorage.getItem("users");

    const allQuizzes = quizzesData ? JSON.parse(quizzesData) : [];
    const users = usersData ? JSON.parse(usersData) : [];

    const related = allQuizzes.filter(
      (q: any) => q.collectionId === collection.id
    );

    setQuizzes(related);

    if (collection.createdBy) {
      const u = users.find((x: any) => x.email === collection.createdBy);
      setAuthor(u);
    }
  };

  const renderQuiz = ({ item }: any) => (
    <TouchableOpacity
      style={styles.quizCard}
      onPress={() => navigation.navigate("QuizDetail", { quiz: item })}
    >
      <Image
        source={{
          uri:
            item.image ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        }}
        style={styles.quizImage}
      />

      <View style={styles.quizOverlay}>
        <Text style={styles.quizTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
        <AppHeader title={collection.title} showBack />
      {/* HEADER IMAGE */}
      <View style={styles.bannerWrapper}>
        <Image
          source={{
            uri:
              collection.image ||
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
          }}
          style={styles.banner}
        />

        {/* TOP BAR */}
        {/* <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={26} color="#000" />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 14 }}>
            <Ionicons name="star-outline" size={22} color="#000" />
            <Ionicons name="ellipsis-horizontal" size={22} color="#000" />
          </View>
        </View> */}
        
      </View>

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>{collection.title}</Text>

        {author && (
          <View style={styles.authorRow}>
            <Image
              source={{
                uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${author.email}`,
              }}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.authorName}>{author.username}</Text>
              <Text style={styles.handle}>@{author.username}</Text>
            </View>

            <View style={styles.youBadge}>
              <Text style={styles.youText}>You</Text>
            </View>
          </View>
        )}
      </View>

      {/* QUIZ LIST */}
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        renderItem={renderQuiz}
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTTOM BUTTONS */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 10, paddingHorizontal: 16 },

  bannerWrapper: { height: 220 },
  banner: { width: "100%", height: "100%" },

  topBar: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoBox: { padding: 20 },

  title: { fontSize: 22, fontWeight: "700", marginBottom: 14 },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: { width: 42, height: 42, borderRadius: 21 },

  authorName: { fontWeight: "700" },
  handle: { color: "#777", fontSize: 12 },

  youBadge: {
    marginLeft: "auto",
    borderWidth: 1,
    borderColor: "#6C4EFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  youText: { color: "#6C4EFF", fontWeight: "600" },

  quizCard: {
    height: 120,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
  },

  quizImage: { width: "100%", height: "100%" },

  quizOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 8,
  },

  quizTitle: { color: "#fff", fontWeight: "700" },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#fff",
  },

  soloBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#6C4EFF",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },

  soloText: { color: "#6C4EFF", fontWeight: "700" },

  multiBtn: {
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
  },

  multiText: { color: "#fff", fontWeight: "700" },
});