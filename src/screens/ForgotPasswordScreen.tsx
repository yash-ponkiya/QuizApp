import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

const ForgotPasswordScreen = () => {
  const navigation: any = useNavigation();
  const [email, setEmail] = useState("");

  const handleContinue = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Email is required",
      });
      return;
    }

    const storedUsers = await AsyncStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const matchedUser = users.find(
      (user: any) => user.email === email
    );

    if (!matchedUser) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Email not found",
      });
      return;
    }

    // Generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await AsyncStorage.setItem("resetOTP", otp);
    await AsyncStorage.setItem("resetEmail", email);

    // ✅ Show OTP in Toast
    Toast.show({
      type: "success",
      text1: "OTP Sent",
      text2: `Your OTP is ${otp}`,
      visibilityTime: 4000,
    });

    setTimeout(() => {
      navigation.navigate("Otp");
    }, 5000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Forgot Password 🔑</Text>
      <Text style={styles.subtitle}>
        Enter your email address to get an OTP code
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

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

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    color: "#777",
    marginBottom: 30,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    marginBottom: 40,
    paddingVertical: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
