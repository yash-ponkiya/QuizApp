import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "./ViewAllHeader";

export default function FollowedCollectionsScreen() {
  const navigation: any = useNavigation();

  const [collections, setCollections] = useState<any[]>([]);

  // ✅ ADDITIONS — COLLECTION MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [collectionQuizzes, setCollectionQuizzes] = useState<any[]>([]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const data = await AsyncStorage.getItem("collections");
    if (data) setCollections(JSON.parse(data));
    else setCollections([]);
  };

  // ✅ ADDITION — OPEN COLLECTION
  const openCollection = async (collection: any) => {
    const data = await AsyncStorage.getItem("quizzes");
    const all = data ? JSON.parse(data) : [];

    const related = all.filter(
      (q: any) => q.collectionId === collection.id
    );

    setSelectedCollection(collection);
    setCollectionQuizzes(related);
    setModalVisible(true);
  };

  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => openCollection(item)}   // ✅ ADDITION
    >
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="All Collections" />

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

      {/* ✅ COLLECTION MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>
                  {selectedCollection?.title}
                </Text>

                <FlatList
                  data={collectionQuizzes}
                  keyExtractor={(item, i) => i.toString()}
                  style={{ maxHeight: 260 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalCard}
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate("QuizDetail", { quiz: item });
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            item.image ||
                            item.img ||
                            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                        }}
                        style={styles.modalImage}
                      />

                      <View style={styles.modalOverlayText}>
                        <Text style={styles.modalCardTitle}>
                          {item.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={{ color: "#777", marginBottom: 10 }}>
                      No quizzes in this collection
                    </Text>
                  }
                />

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  cardTitle: {
    color: "#ffffff",
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

  // ✅ MODAL STYLES (same as other screens)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "82%",
    maxHeight: "60%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  modalCard: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },

  modalImage: {
    width: "100%",
    height: "100%",
  },

  modalOverlayText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  modalCardTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  closeBtn: {
    marginTop: 14,
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
});