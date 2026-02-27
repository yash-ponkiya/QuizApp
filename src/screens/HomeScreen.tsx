import React, { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import HomeTab from "./tabs/HomeTab";
import LibraryScreen from "./tabs/LibraryScreen";
import JoinScreen from "./tabs/JoinScreen";
import CreateScreen from "./tabs/CreateScreen";
import ProfileScreen from "./tabs/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => sub.remove();
    }, [])
  );

  return (
    <Tab.Navigator
      backBehavior="none"  
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6C4EFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 70, paddingBottom: 8 },

        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Library") iconName = "grid";
          else if (route.name === "Join") iconName = "add-circle";
          else if (route.name === "Create") iconName = "create";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeTab} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Join" component={JoinScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}