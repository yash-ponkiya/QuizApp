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
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const currentUser = await AsyncStorage.getItem("currentUser");
    const storedUsers = await AsyncStorage.getItem("users");

    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const loggedUser = users.find(
      (user: any) =>
        user.email === currentUser || user.username === currentUser
    );

    setUserData(loggedUser);
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

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}>
          Here is your profile information
        </Text>

        {userData && (
          <>
            <InfoRow label="Account Type" value={userData.accountType} />
            <InfoRow label="Workplace" value={userData.workplace} />
            <InfoRow label="Full Name" value={userData.fullName} />
            <InfoRow label="Date of Birth" value={userData.dob} />
            <InfoRow label="Phone" value={userData.phone} />
            <InfoRow label="Country" value={userData.country} />
            <InfoRow label="Age" value={userData.age} />
            <InfoRow label="Username" value={userData.username} />
            <InfoRow label="Email" value={userData.email} />
          </>
        )}

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
};

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  </View>
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: "#777",
    marginBottom: 30,
  },

  infoContainer: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 6,
    color: "#333",
  },

  inputRow: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 8,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
  },

  button: {
    marginTop: 40,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
