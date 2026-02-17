import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from "../ViewAll/ViewAllHeader";

export default function TestScreen() {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const { quiz } = route.params;

  const [answers, setAnswers] = useState<number[]>(
    Array(quiz.questions.length).fill(-1)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const selectOption = (qIndex: number, oIndex: number) => {
    if (submitted) return;
    const updated = [...answers];
    updated[qIndex] = oIndex;
    setAnswers(updated);
  };

  /* SAVE RESULT */
  const saveResult = async (sc: number) => {
    const existing = await AsyncStorage.getItem("quizResults");
    const results = existing ? JSON.parse(existing) : [];

    results.push({
      id: Date.now().toString(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: sc,
      total: quiz.questions.length,
      date: new Date().toLocaleDateString(),
    });

    await AsyncStorage.setItem("quizResults", JSON.stringify(results));
  };

  const submitQuiz = () => {
    let sc = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctIndex) sc++;
    });

    setScore(sc);
    setSubmitted(true);
    setModalVisible(true);
    animateIn();

    saveResult(sc); // ✅ store result
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={quiz.title} showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        {quiz.questions.map((q: any, qi: number) => (
          <View key={qi} style={styles.qCard}>
            <Text style={styles.question}>
              {qi + 1}. {q.question}
            </Text>

            {q.options.map((opt: string, oi: number) => {
              const selected = answers[qi] === oi;
              const correct = q.correctIndex === oi;

              return (
                <TouchableOpacity
                  key={oi}
                  style={[
                    styles.option,
                    selected && styles.selected,
                    submitted && correct && styles.correct,
                    submitted && selected && !correct && styles.wrong,
                  ]}
                  onPress={() => selectOption(qi, oi)}
                >
                  <Text style={styles.optText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {!submitted && (
          <TouchableOpacity style={styles.submitBtn} onPress={submitQuiz}>
            <Text style={styles.submitText}>Submit Quiz</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* RESULT MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <Animated.View
            style={[styles.modalBox, { transform: [{ scale: scaleAnim }] }]}
          >
            <Ionicons name="trophy" size={48} color="#FFD700" />

            <Text style={styles.modalTitle}>Quiz Completed</Text>

            <Text style={styles.scoreText}>
              {score} / {quiz.questions.length}
            </Text>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => {
                setModalVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  qCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 14,
  },

  question: { fontWeight: "700", marginBottom: 10 },

  option: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },

  selected: { borderColor: "#6C4EFF", backgroundColor: "#F4F2FF" },
  correct: { borderColor: "#4CAF50", backgroundColor: "#E8F5E9" },
  wrong: { borderColor: "#F44336", backgroundColor: "#FFEBEE" },

  optText: { fontSize: 14 },

  submitBtn: {
    backgroundColor: "#6C4EFF",
    padding: 16,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 40,
  },

  submitText: { color: "#fff", fontWeight: "700" },

  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },

  modalTitle: { fontSize: 18, fontWeight: "700", marginTop: 10 },

  scoreText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#6C4EFF",
    marginVertical: 12,
  },

  doneBtn: {
    backgroundColor: "#6C4EFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 6,
  },

  doneText: { color: "#fff", fontWeight: "700" },
});
