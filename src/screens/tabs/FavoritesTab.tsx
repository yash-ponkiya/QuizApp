import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import AppHeader from "../ViewAll/ViewAllHeader";

export default function FavoritesTab() {
  const navigation: any = useNavigation();
  const [favorites, setFavorites] = useState<any[]>([]);

  /* LOAD FAVORITES */
  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem("favoriteQuizzes");
    const favs = data ? JSON.parse(data) : [];
    setFavorites(favs);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  /* REMOVE FAVORITE */
  const removeFavorite = async (quizId: string) => {
    const updated = favorites.filter((q) => q.id !== quizId);
    setFavorites(updated);
    await AsyncStorage.setItem(
      "favoriteQuizzes",
      JSON.stringify(updated)
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flexDirection: "row", flex: 1 }}
        onPress={() => navigation.navigate("TestScreen", { quiz: item })}
      >
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}

        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.questions.length} Questions
          </Text>
          <Text style={styles.author}>
            by {item.authorUsername || "Author"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* REMOVE FAVORITE */}
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFavorite(item.id)}
      >
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <AppHeader title="Favorites" showBack={false} /> */}

      {favorites.length === 0 ? (
        <Text style={styles.empty}>No favorite quizzes yet</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff",marginTop: -10 },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },

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

  image: {
    width: 90,
    height: 90,
  },

  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },

  meta: {
    color: "#666",
    fontSize: 12,
  },

  author: {
    marginTop: 4,
    color: "#6C4EFF",
    fontSize: 12,
    fontWeight: "600",
  },

  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#FFE5E5",
  },

  removeText: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 12,
  },
});
