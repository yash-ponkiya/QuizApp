import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const navigation: any = useNavigation();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false); // 👈 toggle

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const currentUserString = await AsyncStorage.getItem("currentUser");

    if (!currentUserString) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      return;
    }

    const user = JSON.parse(currentUserString);
    setUserData(user);
    setLoading(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
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

        {/* CARD VIEW */}
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

            {/* <Text style={styles.tapHint}>Tap to view full profile →</Text> */}
          </TouchableOpacity>
        )}

        {/* DETAILS VIEW */}
        {showDetails && userData && (
          <>
            <Text style={styles.subtitle}>
              Here is your full profile information
            </Text>

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

            <TouchableOpacity onPress={handleLogout}>
              <LinearGradient
                colors={["#7B5CFF", "#5E3DF0"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
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

  /* CARD */
  card: {
    backgroundColor: "#F4F2FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  email: {
    color: "#666",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  cardLabel: {
    fontWeight: "600",
    color: "#555",
    marginRight: 6,
  },
  cardValue: {
    color: "#333",
  },
  tapHint: {
    marginTop: 12,
    color: "#6C4EFF",
    fontWeight: "600",
  },

  /* DETAILS */
  infoContainer: { marginBottom: 20 },
  label: { marginBottom: 6, color: "#333" },
  inputRow: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 8,
  },
  value: { fontSize: 15, fontWeight: "600" },

  back: {
    color: "#6C4EFF",
    fontWeight: "600",
    marginTop: 10,
  },

  button: {
    marginTop: 30,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
