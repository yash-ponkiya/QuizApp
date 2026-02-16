import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FollowedCollectionsScreen() {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const data = await AsyncStorage.getItem("collections"); // ✅ ALL collections
    if (data) setCollections(JSON.parse(data));
    else setCollections([]);
  };

  const renderCard = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.img ||
            item.image ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        }}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>All Collections</Text>

      {collections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No collections found</Text>
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item, i) => i.toString()}
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

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },

  card: {
    flex: 1,
    height: 110,
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
  },

  cardTitle: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
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
