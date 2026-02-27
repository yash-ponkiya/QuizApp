import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Image, // ✅ added import
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../styles/styles";
import AppHeader from "../ViewAll/ViewAllHeader";

export default function TestScreen() {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const { quiz } = route.params;

  const hasTimer = quiz.timeMode === "limited";

  const [answers, setAnswers] = useState<number[]>(
    Array(quiz.questions.length).fill(-1)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [unattempted, setUnattempted] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [resultVisible, setResultVisible] = useState(false);

  const [startVisible, setStartVisible] = useState(true);
  const [countdown, setCountdown] = useState(10);

  const [timeLeft, setTimeLeft] = useState(
    hasTimer ? (quiz.timeLimit || 1) * 60 : 0
  );

  const scaleAnim = useRef(new Animated.Value(0)).current;

  const isLastMinute = hasTimer && timeLeft <= 60;
  const isLast10Sec = hasTimer && timeLeft <= 10;

  useEffect(() => {
    if (!startVisible) return;

    if (countdown === 0) {
      setStartVisible(false);
      return;
    }

    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, startVisible]);

  useEffect(() => {
    if (!hasTimer) return;
    if (startVisible || submitted) return;

    if (timeLeft === 0) {
      submitQuiz(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, startVisible, submitted, hasTimer]);

  const animateIn = () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const selectOption = (qIndex: number, oIndex: number) => {
    if (submitted || startVisible) return;
    const updated = [...answers];
    updated[qIndex] = oIndex;
    setAnswers(updated);
  };

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

  const submitQuiz = (auto = false) => {
    if (submitted) return;

    let sc = 0;
    let un = 0;
    let wr = 0;

    quiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === -1) un++;
      else if (answers[i] === q.correctIndex) sc++;
      else wr++;
    });

    setScore(sc);
    setUnattempted(un);
    setWrong(wr);

    setSubmitted(true);
    setResultVisible(true);
    animateIn();
    saveResult(sc);
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <SafeAreaView style={styles.containert}>
      <AppHeader title={quiz.title} showBack />

      {hasTimer && !startVisible && !submitted && (
        <View
          style={[
            local.timerBar,
            isLastMinute && local.timerBarRed,
            isLast10Sec && local.timerBarDarkRed,
          ]}
        >
          <Ionicons name="time" size={16} color="#fff" />
          <Text style={local.timerText}>{formatTime()}</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {startVisible &&
          Array.from({ length: 3 }).map((_, i) => (
            <View key={i} style={styles.skelCard}>
              <View style={styles.skelLineLarge} />
              <View style={styles.skelLine} />
              <View style={styles.skelLine} />
              <View style={styles.skelLine} />
            </View>
          ))}

        {!startVisible &&
          quiz.questions.map((q: any, qi: number) => {
            const unattemptedQ = submitted && answers[qi] === -1;

            return (
              <View
                key={qi}
                style={[
                  styles.qCard,
                  unattemptedQ && styles.unattemptedQ,
                ]}
              >
                <Text style={styles.question}>
                  {qi + 1}. {q.question}
                </Text>

                {/* ✅ IMAGE QUESTION FEATURE — SHOW QUESTION IMAGE */}
                {q.image && (
                  <Image
                    source={{ uri: q.image }}
                    style={local.qImage}
                  />
                )}

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
            );
          })}
      </ScrollView>

      {!submitted && !startVisible && (
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => submitQuiz(false)}
        >
          <Text style={styles.submitText}>Submit Quiz</Text>
        </TouchableOpacity>
      )}

      <Modal transparent visible={startVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.startBox}>
            <Ionicons name="play-circle" size={48} color="#6C4EFF" />
            <Text style={styles.startTitle}>Get Ready</Text>
            <Text style={styles.startCount}>{countdown}</Text>
            <Text style={styles.startSub}>Quiz starts soon…</Text>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={resultVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setResultVisible(false)}>
          <View style={styles.overlay}>
            <Animated.View
              style={[styles.modalBox, { transform: [{ scale: scaleAnim }] }]}
            >
              <Ionicons name="trophy" size={48} color="#FFD700" />
              <Text style={styles.modalTitle}>Quiz Completed</Text>

              <Text style={styles.scoreText}>
                {score} / {quiz.questions.length}
              </Text>

              <View style={styles.resultRow}>
                <Text style={styles.correctText}>Correct: {score}</Text>
                <Text style={styles.wrongText}>Wrong: {wrong}</Text>
                <Text style={styles.unText}>Unattempted: {unattempted}</Text>
              </View>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => {
                  setResultVisible(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  timerBar: {
    backgroundColor: "#6C4EFF",
    paddingVertical: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
    borderRadius: 20,
  },
  timerBarRed: {
    backgroundColor: "#FF3B30",
  },
  timerBarDarkRed: {
    backgroundColor: "#C62828",
  },
  timerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // ✅ IMAGE STYLE
  qImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 6,
  },
});