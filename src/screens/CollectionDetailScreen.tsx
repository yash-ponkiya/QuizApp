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
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "./ViewAll/ViewAllHeader";

export default function CollectionDetailScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { collection } = route.params;

  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    loadCollectionData();
  }, []);

  const loadCollectionData = async () => {
    const quizzesData = await AsyncStorage.getItem("quizzes");
    const allQuizzes = quizzesData ? JSON.parse(quizzesData) : [];

    const related = allQuizzes.filter(
      (q: any) => q.collectionId === collection.id
    );

    setQuizzes(related);
  };

  const renderQuiz = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
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

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.quizGradient}
      >
        <Text style={styles.quizTitle}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={collection.title} showBack />

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        renderItem={renderQuiz}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* TOP BANNER CARD */}
            <View style={styles.bannerWrapper}>
              <Image
                source={{
                  uri:
                    collection.image ||
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                }}
                style={styles.banner}
              />

              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.6)"]}
                style={styles.bannerFade}
              />

              <View style={styles.bannerTextWrap}>
                <Text style={styles.bannerTitle}>{collection.title}</Text>
                <Text style={styles.totalText}>
              Total Quizzes: {quizzes.length}
            </Text>
              </View>
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingTop: 10,
    paddingHorizontal: 16,
  },

  /* BANNER */
  bannerWrapper: {
    height: 200,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
  },

  banner: {
    width: "100%",
    height: "100%",
  },

  bannerFade: {
    ...StyleSheet.absoluteFillObject,
  },

  bannerTextWrap: {
    position: "absolute",
    bottom: 14,
    left: 14,
  },

  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  /* DIVIDER */
  divider: {
    height: 1,
    backgroundColor: "#E6E8F0",
    marginVertical: 10,
  },

  /* TOTAL TEXT */
  totalText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },

  /* QUIZ CARD */
  quizCard: {
    height: 130,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: "#eee",
  },

  quizImage: {
    width: "100%",
    height: "100%",
  },

  quizGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },

  quizTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});