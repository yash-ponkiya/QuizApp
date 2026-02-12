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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = () => {
  const navigation: any = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Enter valid email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Password is required");
      return;
    }

    const storedUsers = await AsyncStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const matchedUser = users.find(
      (user: any) =>
        user.email === email && user.password === password
    );

    if (matchedUser) {
      if (remember) {
        await AsyncStorage.setItem("currentUser", email);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ✅ BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          navigation.navigate(("Onboarding"))
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.hello}>Hello there 👋</Text>

      {/* EMAIL */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* PASSWORD */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#6C4EFF"
          />
        </TouchableOpacity>
      </View>

      {/* REMEMBER */}
      <View style={styles.rememberRow}>
        <Switch value={remember} onValueChange={setRemember} />
        <Text style={{ marginLeft: 8 }}>Remember me</Text>
      </View>

      {/* FORGOT PASSWORD */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* SIGN IN BUTTON */}
      <TouchableOpacity onPress={handleLogin}>
        <LinearGradient
          colors={["#7B5CFF", "#5E3DF0"]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>SIGN IN</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backBtn: {
    marginBottom: 20,
  },
  hello: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 40,
  },
  label: {
    marginTop: 15,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  forgot: {
    textAlign: "center",
    marginTop: 20,
    color: "#6C4EFF",
  },
  button: {
    marginTop: 40,
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
