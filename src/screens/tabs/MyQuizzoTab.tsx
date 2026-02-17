import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function MyQuizzoTab() {
  const navigation: any = useNavigation();

  const [active, setActive] = useState<"Quizzo" | "Collections">("Collections");
  const [collections, setCollections] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [active]);

  const loadData = async () => {
    if (active === "Collections") {
      const data = await AsyncStorage.getItem("collections");
      setCollections(data ? JSON.parse(data) : []);
    } else {
      const data = await AsyncStorage.getItem("quizzes");
      setQuizzes(data ? JSON.parse(data) : []);
    }
  };

  const renderCard = ({ item }: any) => {
    const isQuiz = active === "Quizzo";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={isQuiz ? 0.8 : 1}
        onPress={() => {
          if (isQuiz) {
            navigation.navigate("TestScreen", { quiz: item });
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
      {/* TOGGLE */}
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

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.count}>
          {dataToShow.length} {active}
        </Text>
        <Text style={styles.sort}>Newest ⥮</Text>
      </View>

      {/* CONTENT */}
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
    </View>
  );
}

const styles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
});
