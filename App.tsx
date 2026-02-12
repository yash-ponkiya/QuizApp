import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingScreen from "./src/OnboardingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import OtpScreen from "./src/screens/OtpScreen";
import CreateNewPasswordScreen from "./src/screens/CreateNewPasswordScreen";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const currentUser = await AsyncStorage.getItem("currentUser");

    if (currentUser) {
      setInitialRoute("Home");
    } else {
      setInitialRoute("Onboarding");
    }
  };

  // 🔥 Show loading while checking
  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#6C4EFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen
          name="CreateNewPassword"
          component={CreateNewPasswordScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>

      <Toast />
    </NavigationContainer>
  );
}
