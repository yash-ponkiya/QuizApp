import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import AppHeader from "./ViewAllHeader";

export default function DiscoverTest() {
  const navigation: any = useNavigation();
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const loadQuizzes = async () => {
    const usersData = await AsyncStorage.getItem("users");
    const quizzesData = await AsyncStorage.getItem("quizzes");

    const users = usersData ? JSON.parse(usersData) : [];
    const quizzesList = quizzesData ? JSON.parse(quizzesData) : [];

    if (!quizzesList.length) {
      setQuizzes([]);
      return;
    }

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
  };

  useFocusEffect(
    useCallback(() => {
      loadQuizzes();
    }, [])
  );

  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("TestScreen", { quiz: item })}
    >
      <Image
        source={{
          uri:
            item.image ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        }}
        style={styles.image}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.authorName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Discover" />

      {quizzes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No quizzes found</Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  card: {
    flex: 1,
    height: 130,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    bottom: 6,
    left: 8,
    right: 8,
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  cardSubtitle: {
    color: "#eee",
    fontSize: 11,
    marginTop: 2,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#999",
    fontSize: 14,
  },
});
