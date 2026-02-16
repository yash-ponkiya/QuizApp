import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import UniversalCard from "../../components/UniversalCard";
import AppHeader from "./ViewAllHeader";

export default function DiscoverTest() {
    const [quizzes, setQuizzes] = useState<any[]>([]);

    const loadQuizzes = async () => {
        const usersData = await AsyncStorage.getItem("users");
        const quizzesData = await AsyncStorage.getItem("quizzes");

        const users = usersData ? JSON.parse(usersData) : [];
        const quizzesList = quizzesData ? JSON.parse(quizzesData) : [];

        if (!quizzesList.length) {
            setQuizzes([]);
            return;
        }

        const enriched = quizzesList.map((q: any) => {
            const user = users.find(
                (u: any) =>
                    u.email === q.authorEmail ||
                    u.username === q.authorUsername ||
                    u.username === q.author
            );

            return {
                ...q,
                authorName:
                    user?.username ||
                    q.authorUsername ||
                    q.author ||
                    "Unknown",
            };
        });

        setQuizzes(enriched);
    };

    useFocusEffect(
        useCallback(() => {
            loadQuizzes();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader title="Discover" />

            {quizzes.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No quizzes found</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                >
                    {quizzes.map((q, i) => (
                        <UniversalCard
                            key={i}
                            variant="discover"
                            image={
                                q.image ||
                                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                            }
                            title={q.title}
                            subtitle={q.authorName}
                            avatar={`https://i.pravatar.cc/100?u=${q.authorName}`}
                        />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20
    },

    list: {
        paddingBottom: 40,
        gap: 14,
    },

    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyText: {
        color: "#999",
        fontSize: 14,
    },
});
