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
import AppHeader from "./ViewAll/ViewAllHeader";

export default function NotificationsScreen() {
  const navigation: any = useNavigation();

  const [invites, setInvites] = useState<any[]>([]);

  const loadInvites = async () => {
    const invitesData = await AsyncStorage.getItem("quizInvites");
    const currentUserData = await AsyncStorage.getItem("currentUser");

    const invitesAll = invitesData ? JSON.parse(invitesData) : [];
    const currentUser = currentUserData
      ? JSON.parse(currentUserData)
      : null;

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

  const renderInvite = ({ item }: any) => (
    <View style={styles.inviteCard}>
      <Text style={styles.inviteText}>
        <Text style={styles.bold}>{item.fromName}</Text> invited you to{" "}
        <Text style={styles.bold}>{item.quizTitle}</Text>
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.accept}
          onPress={() => updateInvite(item, "accepted")}
        >
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reject}
          onPress={() => updateInvite(item, "rejected")}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="Notifications" showBack />

      <FlatList
        data={invites}
        keyExtractor={(item) => item.id}
        renderItem={renderInvite}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No invitations</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff",paddingHorizontal: 16,
    paddingTop: 10, },

  inviteCard: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    marginLeft: -10,
    
  },

  inviteText: { fontSize: 14, marginBottom: 8 },

  bold: { fontWeight: "700", color: "#6C4EFF" },

  actions: { flexDirection: "row", gap: 10 },

  accept: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  reject: {
    backgroundColor: "#F44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  btnText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 14,
  },
});