import React, { useState, useCallback } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeTab() {
  const navigation: any = useNavigation();
  const [authors, setAuthors] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  const getAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;

  const loadData = async () => {
    const usersData = await AsyncStorage.getItem("users");
    const followedData = await AsyncStorage.getItem("followedUsers");
    const collectionsData = await AsyncStorage.getItem("collections");

    // AUTHORS
    if (usersData && followedData) {
      const users = JSON.parse(usersData);
      const followed = JSON.parse(followedData);

      const list = users.filter((u: any) =>
        followed.includes(u.email)
      );

      setAuthors(list);
    }

    // COLLECTIONS (PUBLIC)
    if (collectionsData) {
      const all = JSON.parse(collectionsData);
      const publicCollections = all.filter(
        (c: any) => c.visibleTo === "Public"
      );
      setCollections(publicCollections);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons name="help-circle" size={26} color="#6C4EFF" />
          <Text style={styles.logoText}>Quizzo</Text>
        </View>

        <View style={styles.headerIcons}>
          <Ionicons name="search" size={22} color="#000" />
          <Ionicons name="notifications-outline" size={22} color="#000" />
        </View>
      </View>

      {/* PURPLE CARD */}
      <LinearGradient
        colors={["#8E7CFF", "#6C4EFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>
          Play quiz together with{"\n"}your friends now!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FindFriends")}
        >
          <Text style={styles.buttonText}>Find Friends</Text>
        </TouchableOpacity>

        <View style={styles.avatars}>
          <Image source={{ uri: "https://i.pravatar.cc/100?img=1" }} style={[styles.avatar, { top: 10, right: 20 }]} />
          <Image source={{ uri: "https://i.pravatar.cc/100?img=2" }} style={[styles.avatar, { top: 50, right: 60 }]} />
          <Image source={{ uri: "https://i.pravatar.cc/100?img=3" }} style={[styles.avatar, { top: 80, right: 10 }]} />
          <Image source={{ uri: "https://i.pravatar.cc/100?img=4" }} style={[styles.avatar, { top: 20, right: 90 }]} />
          <Image source={{ uri: "https://i.pravatar.cc/100?img=5" }} style={[styles.avatar, { top: 90, right: 80 }]} />
        </View>
      </LinearGradient>

      {/* TOP AUTHORS */}
      {authors.length > 0 && (
        <>
          <View style={styles.authorsHeader}>
            <Text style={styles.sectionTitle}>Top Authors</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("FollowedAuthors")}
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {authors.map((u, i) => (
              <View key={i} style={styles.authorItem}>
                <Image
                  source={{ uri: getAvatar(u.email) }}
                  style={styles.authorAvatar}
                />
                <Text style={styles.authorName} numberOfLines={1}>
                  {u.fullName}
                </Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* TOP COLLECTIONS */}
      {collections.length > 0 && (
        <>
          <View style={styles.collectionsHeader}>
            <Text style={styles.sectionTitle}>Top Collections</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Collections")}
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {collections.map((c, i) => (
              <View key={i} style={styles.collectionCard}>
                <Image
                  source={{
                    uri:
                      c.image ||
                      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                  }}
                  style={styles.collectionImage}
                />

                <View style={styles.collectionOverlay}>
                  <Text style={styles.collectionTitle}>
                    {c.title}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 10 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },

  logoRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  logoText: { fontSize: 20, fontWeight: "700", color: "#000" },

  headerIcons: { flexDirection: "row", gap: 16 },

  card: { borderRadius: 18, padding: 20, height: 180, overflow: "hidden" },

  cardTitle: { color: "#fff", fontSize: 22, fontWeight: "600", marginBottom: 10, marginTop: 8 },

  button: { backgroundColor: "#fff", paddingHorizontal: 16, marginTop: 17, paddingVertical: 8, borderRadius: 20, alignSelf: "flex-start" },

  buttonText: { color: "#6C4EFF", fontWeight: "600", fontSize: 16 },

  avatars: { position: "absolute", right: 0, top: 0, width: 150, height: 150 },

  avatar: {
    marginTop: 20,
    position: "absolute",
    width: 35,
    height: 35,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#fff",
  },

  authorsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  collectionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10, // ✅ smaller gap
    marginBottom: 10,
  },

  sectionTitle: { fontSize: 18, fontWeight: "700" },

  viewAll: { color: "#6C4EFF", fontWeight: "600" },

  authorItem: { alignItems: "center", marginRight: 16, width: 70 },

  authorAvatar: { width: 56, height: 56, borderRadius: 28, marginBottom: 6 },

  authorName: { fontSize: 12, textAlign: "center" },

  collectionCard: {
    width: 160,
    height: 90,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 14,
  },

  collectionImage: {
    width: "100%",
    height: "100%",
  },

  collectionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  collectionTitle: {
    color: "#fff",
    fontWeight: "600",
  },
});
