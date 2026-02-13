import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const CreateNewPasswordScreen = () => {
  const navigation: any = useNavigation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleContinue = async () => {
    if (!password || password.length < 6) {
      Alert.alert("Error", "Password must be 6+ characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const email = await AsyncStorage.getItem("resetEmail");
    const storedUsers = await AsyncStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const updatedUsers = users.map((user: any) =>
      user.email === email ? { ...user, password } : user
    );

    await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

    Alert.alert("Success", "Password updated successfully");

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate("Onboarding")}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Create new password 🔐</Text>
      <Text style={styles.subtitle}>
        Save the new password in a safe place.
      </Text>

      <Text style={styles.label}>Create a new password</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          secureTextEntry={!show1}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShow1(!show1)}>
          <Ionicons
            name={show1 ? "eye" : "eye-off"}
            size={20}
            color="#6C4EFF"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm a new password</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          secureTextEntry={!show2}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShow2(!show2)}>
          <Ionicons
            name={show2 ? "eye" : "eye-off"}
            size={20}
            color="#6C4EFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rememberRow}>
        <Switch value={remember} onValueChange={setRemember} />
        <Text style={{ marginLeft: 8 }}>Remember me</Text>
      </View>

      <TouchableOpacity onPress={handleContinue}>
        <LinearGradient
          colors={["#7B5CFF", "#5E3DF0"]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreateNewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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

  label: {
    marginBottom: 6,
  },

  inputRow: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },

  input: {
    flex: 1,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  button: {
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
