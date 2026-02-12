import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const OtpScreen = () => {
  const navigation: any = useNavigation();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(55);

  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const savedOTP = await AsyncStorage.getItem("resetOTP");
    const enteredOtp = otp.join("");

    if (enteredOtp === savedOTP) {
      navigation.reset({
        index: 0,
        routes: [{ name: "CreateNewPassword" }],
      });
    } else {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>You've got mail 💌</Text>
      <Text style={styles.subtitle}>
        We have sent the OTP verification code to your email.
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            style={[
              styles.otpBox,
              digit && styles.activeBox
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      <Text style={styles.resendText}>
        You can resend code in <Text style={{ color: "#6C4EFF" }}>{timer}s</Text>
      </Text>

      <TouchableOpacity onPress={handleConfirm}>
        <LinearGradient
          colors={["#7B5CFF", "#5E3DF0"]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },

  subtitle: { color: "#777", marginBottom: 30 },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  otpBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    textAlign: "center",
    fontSize: 22,
  },

  activeBox: {
    borderWidth: 2,
    borderColor: "#6C4EFF",
    backgroundColor: "#fff",
  },

  resendText: {
    textAlign: "center",
    marginBottom: 30,
    color: "#777",
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
