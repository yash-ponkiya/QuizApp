import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeTab from "./tabs/HomeTab";
import LibraryScreen from "./tabs/LibraryScreen";
import JoinScreen from "./tabs/JoinScreen";
import CreateScreen from "./tabs/CreateScreen";
import ProfileScreen from "./tabs/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6C4EFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 70, paddingBottom: 8 },
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";

          if (route.name === "Home") iconName = "home";
          if (route.name === "Library") iconName = "grid";
          if (route.name === "Join") iconName = "add-circle";
          if (route.name === "Create") iconName = "create";
          if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Hometab" component={HomeTab} options={{title:"Home"}}/>
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Join" component={JoinScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
