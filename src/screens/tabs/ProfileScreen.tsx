import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const navigation: any = useNavigation();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
    loadMyData();
  }, []);

  const loadUserData = async () => {
    const currentUserString = await AsyncStorage.getItem("currentUser");
    if (!currentUserString) {
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      return;
    }
    setUserData(JSON.parse(currentUserString));
    setLoading(false);
  };

  const loadMyData = async () => {
    const q = await AsyncStorage.getItem("quizzes");
    const c = await AsyncStorage.getItem("collections");

    setQuizzes(q ? JSON.parse(q) : []);
    setCollections(c ? JSON.parse(c) : []);
  };

  const deleteQuiz = async (id: string) => {
    const updated = quizzes.filter((q) => q.id !== id);
    setQuizzes(updated);
    await AsyncStorage.setItem("quizzes", JSON.stringify(updated));
  };

  const deleteCollection = async (id: string) => {
    const updated = collections.filter((c) => c.id !== id);
    setCollections(updated);
    await AsyncStorage.setItem("collections", JSON.stringify(updated));
  };

  const confirmDeleteQuiz = (id: string) =>
    Alert.alert("Delete Quiz", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteQuiz(id) },
    ]);

  const confirmDeleteCollection = (id: string) =>
    Alert.alert("Delete Collection", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteCollection(id) },
    ]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6C4EFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* PROFILE CARD */}
        {!showDetails && userData && (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setShowDetails(true)}
          >
            <Text style={styles.name}>{userData.fullName}</Text>
            <Text style={styles.email}>{userData.email}</Text>

            <View style={styles.row}>
              <Text style={styles.cardLabel}>Username:</Text>
              <Text style={styles.cardValue}>{userData.username}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.cardLabel}>Country:</Text>
              <Text style={styles.cardValue}>{userData.country}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* DETAILS */}
        {showDetails && userData && (
          <>
            <Text style={styles.subtitle}>Full profile information</Text>

            <InfoRow label="Account Type" value={userData.accountType} />
            <InfoRow label="Workplace" value={userData.workplace} />
            <InfoRow label="Full Name" value={userData.fullName} />
            <InfoRow label="Date of Birth" value={userData.dob} />
            <InfoRow label="Phone" value={userData.phone} />
            <InfoRow label="Country" value={userData.country} />
            <InfoRow label="Age" value={userData.age} />
            <InfoRow label="Username" value={userData.username} />
            <InfoRow label="Email" value={userData.email} />

            <TouchableOpacity onPress={() => setShowDetails(false)}>
              <Text style={styles.back}>← Back to Profile</Text>
            </TouchableOpacity>
          </>
        )}

        {/* MY QUIZZES */}
        <Text style={styles.sectionTitle}>My Quizzes</Text>
        {quizzes.length === 0 ? (
          <Text style={styles.empty}>No quizzes</Text>
        ) : (
          quizzes.map((q) => (
            <View key={q.id} style={styles.itemRow}>
              <Text style={styles.itemTitle}>{q.title}</Text>
              <TouchableOpacity onPress={() => confirmDeleteQuiz(q.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* MY COLLECTIONS */}
        <Text style={styles.sectionTitle}>My Collections</Text>
        {collections.length === 0 ? (
          <Text style={styles.empty}>No collections</Text>
        ) : (
          collections.map((c) => (
            <View key={c.id} style={styles.itemRow}>
              <Text style={styles.itemTitle}>{c.title}</Text>
              <TouchableOpacity
                onPress={() => confirmDeleteCollection(c.id)}
              >
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* LOGOUT */}
        <TouchableOpacity onPress={handleLogout}>
          <LinearGradient
            colors={["#7B5CFF", "#5E3DF0"]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  subtitle: { color: "#777", marginBottom: 30 },

  card: {
    backgroundColor: "#F4F2FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  name: { fontSize: 18, fontWeight: "700", color: "#222" },
  email: { color: "#666", marginBottom: 12 },
  row: { flexDirection: "row", marginTop: 4 },
  cardLabel: { fontWeight: "600", color: "#555", marginRight: 6 },
  cardValue: { color: "#333" },

  infoContainer: { marginBottom: 20 },
  label: { marginBottom: 6, color: "#333" },
  inputRow: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 8,
  },
  value: { fontSize: 15, fontWeight: "600" },

  back: { color: "#6C4EFF", fontWeight: "600", marginTop: 10 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  itemTitle: { fontSize: 15, color: "#333" },
  delete: { color: "#FF4D4D", fontWeight: "600" },

  empty: { color: "#999", marginBottom: 10 },

  button: {
    marginTop: 30,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
