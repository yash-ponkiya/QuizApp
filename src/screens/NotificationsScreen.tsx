import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Added Icons
import AppHeader from "./ViewAll/ViewAllHeader";

export default function NotificationsScreen() {
  const navigation: any = useNavigation();
  const [invites, setInvites] = useState<any[]>([]);

  const loadInvites = async () => {
    const invitesData = await AsyncStorage.getItem("quizInvites");
    const currentUserData = await AsyncStorage.getItem("currentUser");

    const invitesAll = invitesData ? JSON.parse(invitesData) : [];
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

    if (!currentUser) {
      setInvites([]);
      return;
    }

    const myInvites = invitesAll.filter(
      (i: any) =>
        i.toEmail === currentUser.email && i.status === "pending"
    );

    setInvites(myInvites);
  };

  useFocusEffect(
    useCallback(() => {
      loadInvites();
    }, [])
  );

  const updateInvite = async (invite: any, status: string) => {
    const data = await AsyncStorage.getItem("quizInvites");
    const all = data ? JSON.parse(data) : [];

    const updated = all.map((i: any) =>
      i.id === invite.id ? { ...i, status } : i
    );

    await AsyncStorage.setItem("quizInvites", JSON.stringify(updated));

    if (status === "accepted") {
      const quizzesData = await AsyncStorage.getItem("quizzes");
      const quizzes = quizzesData ? JSON.parse(quizzesData) : [];
      const quiz = quizzes.find((q: any) => q.id === invite.quizId);

      if (quiz) {
        navigation.navigate("TestScreen", { quiz });
      }
    }
    loadInvites();
  };

  const renderInvite = ({ item }: any) => {
    // Get first letter for avatar
    const initial = item.fromName ? item.fromName.charAt(0).toUpperCase() : "?";

    return (
      <View style={styles.notificationItem}>
        <View style={styles.content}>
          <Text style={styles.message} numberOfLines={2}>
            <Text style={styles.userName}>{item.fromName}</Text> invited you to take the quiz{" "}
            <Text style={styles.quizName}>"{item.quizTitle}"</Text>
          </Text>
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => updateInvite(item, "accepted")}
            >
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => updateInvite(item, "rejected")}
            >
              <Text style={styles.rejectText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: Dot/Icon */}
        {/* <View style={styles.dotContainer}>
           <Ionicons name="mail-unread-outline" size={18} color="#6C4EFF" />
        </View> */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Notifications" showBack />
      
      <FlatList
        data={invites}
        keyExtractor={(item) => item.id}
        renderItem={renderInvite}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="#DDD" />
            <Text style={styles.empty}>You're all caught up!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 10,  
  },
  listPadding: { 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    alignItems: "flex-start",
    
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#6C4EFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
  },
  userName: {
    fontWeight: "700",
    color: "#000",
  },
  quizName: {
    fontWeight: "600",
    color: "#6C4EFF",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  acceptBtn: {
    backgroundColor: "#6C4EFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  acceptText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  rejectBtn: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  rejectText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  dotContainer: {
    paddingLeft: 8,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  empty: {
    marginTop: 15,
    color: "#999",
    fontSize: 16,
    fontWeight: "500",
  },
});