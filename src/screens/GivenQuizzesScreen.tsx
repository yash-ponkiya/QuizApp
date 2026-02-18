import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "./ViewAll/ViewAllHeader";

export default function GivenQuizzesScreen() {
  const navigation: any = useNavigation();
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await AsyncStorage.getItem("quizResults");
    setResults(data ? JSON.parse(data).reverse() : []);
  };

  return (
    <SafeAreaView style={styles.container}>
        <AppHeader title="Given Quizzes" showBack/>
        
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.quiz}>{item.quizTitle}</Text>
            <Text style={styles.score}>
              {item.score}/{item.total}
            </Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No attempts yet</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: { fontSize: 18, fontWeight: "700" },

  card: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  quiz: { fontWeight: "700", marginBottom: 4 },
  score: { color: "#6C4EFF", fontWeight: "700" },
  date: { color: "#777", fontSize: 12 },

  empty: { textAlign: "center", marginTop: 40, color: "#999" },
});
