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

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!startVisible) return;

    if (countdown === 0) {
      setStartVisible(false);
      return;
    }

    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, startVisible]);

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

  const submitQuiz = () => {
    let sc = 0;
    let un = 0;
    let wr = 0;

    quiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === -1) {
        un++;
      } else if (answers[i] === q.correctIndex) {
        sc++;
      } else {
        wr++;
      }
    });

    setScore(sc);
    setUnattempted(un);
    setWrong(wr);

    setSubmitted(true);
    setResultVisible(true);
    animateIn();
    saveResult(sc);
  };

  return (
    <SafeAreaView style={styles.containert}>
      <AppHeader title={quiz.title} showBack />

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

        {!submitted && !startVisible && (
          <TouchableOpacity style={styles.submitBtn} onPress={submitQuiz}>
            <Text style={styles.submitText}>Submit Quiz</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* START MODAL */}
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

      {/* RESULT MODAL */}
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

