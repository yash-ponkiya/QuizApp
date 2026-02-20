import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function MyQuizzoTab() {
  const navigation: any = useNavigation();
  const route: any = useRoute();

  const profileUser = route.params?.user;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [active, setActive] = useState<"Quizzo" | "Collections">("Collections");
  const [collections, setCollections] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  // ✅ MODAL STATE
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [associatedQuizzes, setAssociatedQuizzes] = useState<any[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    loadData();
  }, [active]);

  const loadUser = async () => {
    const cu = await AsyncStorage.getItem("currentUser");
    if (cu) setCurrentUser(JSON.parse(cu));
  };

  const loadData = async () => {
    if (active === "Collections") {
      const data = await AsyncStorage.getItem("collections");
      const list = data ? JSON.parse(data) : [];

      if (profileUser) {
        setCollections(list.filter((i: any) => i.createdBy === profileUser.email));
      } else {
        setCollections(list);
      }
    } else {
      const data = await AsyncStorage.getItem("quizzes");
      const list = data ? JSON.parse(data) : [];

      if (profileUser) {
        setQuizzes(list.filter((i: any) => i.createdBy === profileUser.email));
      } else {
        setQuizzes(list);
      }
    }
  };

  // ✅ OPEN COLLECTION MODAL
  const openCollection = async (collection: any) => {
    const data = await AsyncStorage.getItem("quizzes");
    const list = data ? JSON.parse(data) : [];

    const related = list.filter(
      (q: any) => q.collectionId === collection.id
    );

    setSelectedCollection(collection);
    setAssociatedQuizzes(related);
    setModalVisible(true);
  };

  const isOwner =
    currentUser?.email &&
    profileUser?.email &&
    currentUser.email === profileUser.email;

  const renderCard = ({ item }: any) => {
    const isQuiz = active === "Quizzo";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => {
          if (isQuiz) {
            navigation.navigate("QuizDetail", { quiz: item });
          } else {
            openCollection(item);
          }
        }}
      >
        <Image
          source={{
            uri:
              item.image ||
              item.img ||
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
          }}
          style={styles.image}
        />

        <View style={styles.overlay}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const dataToShow = active === "Collections" ? collections : quizzes;

  return (
    <View style={{ flex: 1 }}>
      {isOwner && (
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, active === "Quizzo" && styles.toggleActive]}
          onPress={() => setActive("Quizzo")}
        >
          <Text
            style={[
              styles.toggleText,
              active === "Quizzo" && styles.toggleTextActive,
            ]}
          >
            Quizzo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            active === "Collections" && styles.toggleActive,
          ]}
          onPress={() => setActive("Collections")}
        >
          <Text
            style={[
              styles.toggleText,
              active === "Collections" && styles.toggleTextActive,
            ]}
          >
            Collections
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.count}>
          {dataToShow.length} {active}
        </Text>
        <Text style={styles.sort}>Newest ⥮</Text>
      </View>

      {dataToShow.length > 0 ? (
        <FlatList
          data={dataToShow}
          keyExtractor={(item, i) => i.toString()}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No {active === "Quizzo" ? "Quizzo" : "Collections"} yet
          </Text>
        </View>
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              {selectedCollection?.title}
            </Text>

            {associatedQuizzes.length > 0 ? (
              <FlatList
                data={associatedQuizzes}
                keyExtractor={(item, i) => i.toString()}
                style={{ maxHeight: 220 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.quizItem}
                    onPress={() =>
                      navigation.navigate("QuizDetail", { quiz: item })
                    }
                  >
                    <Text style={styles.quizTitle}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={{ color: "#777", marginBottom: 10 }}>
                No quizzes in this collection
              </Text>
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  editText: {
    color: "#6C63FF",
    fontWeight: "700",
  },

  toggle: {
    flexDirection: "row",
    backgroundColor: "#F1EEFF",
    borderRadius: 30,
    padding: 4,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#6C63FF",
  },
  toggleText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  count: {
    fontWeight: "700",
    color: "#222",
  },
  sort: {
    color: "#6C63FF",
    fontWeight: "600",
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
    backgroundColor: "rgba(0,0,0,0.30)",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },

  quizItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  quizTitle: {
    fontWeight: "600",
    color: "#333",
  },

  closeBtn: {
    marginTop: 20,
    backgroundColor: "#6C63FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "82%",
    height: "50%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    elevation: 6,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
});