// ✅ ONLY ADDITIONS MARKED WITH: IMAGE QUESTION FEATURE

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import HomeHeader from "../../components/QuizzoCollectionsHeader";

export default function CreateScreen() {
  const [title, setTitle] = useState("");
  const [quizImage, setQuizImage] = useState<string | null>(null);

  const [timeMode, setTimeMode] = useState<"limited" | "none">("none");
  const [timeLimit, setTimeLimit] = useState("");

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // ✅ IMAGE QUESTION FEATURE — ADD
  // ✅ IMAGE QUESTION FEATURE — ADD
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCollections();
    setRefreshing(false);
  };

  const [questions, setQuestions] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const data = await AsyncStorage.getItem("collections");
    if (data) setCollections(JSON.parse(data));
  };

  const resetQuiz = () => {
    setTitle("");
    setQuizImage(null);
    setSelectedCollection(null);
    setQuestions([]);
    setTimeLimit("");
    setTimeMode("none");
    setErrors({});
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setQuizImage(result.assets[0].uri);
    }
  };

  // ✅ IMAGE QUESTION FEATURE
  const pickQuestionImage = async (qIndex: number) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const updated = [...questions];
      updated[qIndex].image = result.assets[0].uri;
      setQuestions(updated);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", ""], correctIndex: 0, type: "text", image: null }, // ✅ added fields
    ]);
  };

  const removeQuestion = (qIndex: number) => {
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  const updateQuestion = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const setCorrect = (qIndex: number, index: number) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = index;
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  // ✅ IMAGE QUESTION FEATURE
  const setQuestionType = (qIndex: number, type: "text" | "image") => {
    const updated = [...questions];
    updated[qIndex].type = type;
    setQuestions(updated);
  };

  // VALIDATION
  const validate = () => {
    let valid = true;
    let newErrors: any = {};

    if (!title.trim()) {
      newErrors.title = "Title required";
      valid = false;
    }

    if (!selectedCollection) {
      newErrors.collection = "Select collection";
      valid = false;
    }

    if (timeMode === "limited") {
      if (!timeLimit || Number(timeLimit) <= 0) {
        newErrors.time = "Enter valid time";
        valid = false;
      }
    }

    if (questions.length === 0) {
      newErrors.questions = "Add at least one question";
      valid = false;
    }

    questions.forEach((q, qi) => {
      if (q.type === "text" && !q.question.trim()) {
        newErrors[`q_${qi}`] = "Question required";
        valid = false;
      }

      if (q.type === "image" && !q.image) {
        newErrors[`q_${qi}`] = "Image required";
        valid = false;
      }

      q.options.forEach((opt: string, oi: number) => {
        if (!opt.trim()) {
          newErrors[`q_${qi}_o_${oi}`] = "Option required";
          valid = false;
        }
      });
    });

    setErrors(newErrors);
    return valid;
  };

  const saveQuiz = async () => {
    if (!validate()) return;

    const currentUserStr = await AsyncStorage.getItem("currentUser");
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

    const existing = await AsyncStorage.getItem("quizzes");
    const quizzes = existing ? JSON.parse(existing) : [];

    const newQuiz = {
      id: Date.now().toString(),
      title,
      image: quizImage,
      collectionId: selectedCollection.id,
      questions,
      timeMode,
      timeLimit: timeMode === "limited" ? Number(timeLimit) : null,
      authorUsername: currentUser.username,
      authorEmail: currentUser.email,
      createdBy: currentUser.email,
    };

    quizzes.push(newQuiz);
    await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));

    Alert.alert("Quiz created");
    resetQuiz();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader title="Create Quiz" showNotifications={false} showSearch={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6C4EFF"]}
            tintColor="#6C4EFF"
          />
        }
      >

        <TouchableOpacity style={styles.newQuizBtn} onPress={resetQuiz}>
          <Ionicons name="add-circle" size={18} color="#6C4EFF" />
          <Text style={styles.newQuizText}>Create New Quiz</Text>
        </TouchableOpacity>

        {/* COVER */}
        <TouchableOpacity style={styles.coverBox} onPress={pickImage}>
          {quizImage ? (
            <Image source={{ uri: quizImage }} style={styles.coverPreview} />
          ) : (
            <>
              <Ionicons name="image-outline" size={34} color="#6C4EFF" />
              <Text style={styles.addCover}>Add Quiz Image</Text>
            </>
          )}
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.label}>Quiz Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quiz title"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={styles.error}>{errors.title}</Text>}

        {/* TIME MODE */}
        <Text style={styles.label}>Time Mode</Text>
        <View style={styles.timeModeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, timeMode === "limited" && styles.modeActive]}
            onPress={() => setTimeMode("limited")}
          >
            <Ionicons name="time" size={16} color={timeMode === "limited" ? "#fff" : "#6C4EFF"} />
            <Text style={[styles.modeText, timeMode === "limited" && { color: "#fff" }]}>
              Limited
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, timeMode === "none" && styles.modeActive]}
            onPress={() => setTimeMode("none")}
          >
            <Ionicons name="infinite" size={16} color={timeMode === "none" ? "#fff" : "#6C4EFF"} />
            <Text style={[styles.modeText, timeMode === "none" && { color: "#fff" }]}>
              No Limit
            </Text>
          </TouchableOpacity>
        </View>

        {timeMode === "limited" && (
          <>
            <Text style={styles.label}>Time Limit</Text>
            <View style={styles.timeBox}>
              <Ionicons name="time-outline" size={18} color="#6C4EFF" />
              <TextInput
                style={styles.timeInput}
                placeholder="10"
                keyboardType="numeric"
                value={timeLimit}
                onChangeText={setTimeLimit}
              />
              <Text style={styles.timeUnit}>min</Text>
            </View>
            {errors.time && <Text style={styles.error}>{errors.time}</Text>}
          </>
        )}

        {/* COLLECTION */}
        <Text style={styles.label}>Collection</Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text>
              {selectedCollection ? selectedCollection.title : "Select collection"}
            </Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {errors.collection && <Text style={styles.error}>{errors.collection}</Text>}

          {showDropdown && (
            <View style={styles.dropdownMenu}>
              {collections.map((c: any) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCollection(c);
                    setShowDropdown(false);
                  }}
                >
                  <Text>{c.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* QUESTIONS */}
        <View style={styles.qHeader}>
          <Text style={styles.label}>Questions</Text>
          <TouchableOpacity onPress={addQuestion}>
            <Text style={styles.addBtn}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {errors.questions && (
          <Text style={styles.error}>{errors.questions}</Text>
        )}

        {questions.map((q, qi) => (
          <View key={qi} style={styles.qCard}>
            <View style={styles.qTopRow}>
              <Text style={styles.qNumber}>Q{qi + 1}</Text>
              <TouchableOpacity onPress={() => removeQuestion(qi)}>
                <Ionicons name="trash" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>

            {/* ✅ IMAGE QUESTION FEATURE */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 6 }}>
              <TouchableOpacity onPress={() => setQuestionType(qi, "text")} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name={q.type === "image" ? "radio-button-off" : "radio-button-on"} size={18} color="#6C4EFF" />
                <Text>Text</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setQuestionType(qi, "image")} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name={q.type === "image" ? "radio-button-on" : "radio-button-off"} size={18} color="#6C4EFF" />
                <Text>Image + Text</Text>
              </TouchableOpacity>
            </View>

            {/* ✅ IMAGE QUESTION FEATURE — ADDITION: text also in image mode */}
            {q.type === "image" && (
              <TextInput
                placeholder={`Question ${qi + 1}`}
                style={styles.qInput}
                value={q.question}
                onChangeText={(t) => updateQuestion(qi, t)}
              />
            )}

            {q.type === "image" && (
              <TouchableOpacity style={styles.qImageBox} onPress={() => pickQuestionImage(qi)}>
                {q.image ? (
                  <Image source={{ uri: q.image }} style={styles.qImage} />
                ) : (
                  <>
                    <Ionicons name="image-outline" size={28} color="#6C4EFF" />
                    <Text style={{ color: "#6C4EFF" }}>Pick Question Image</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {errors[`q_${qi}`] && (
              <Text style={styles.error}>{errors[`q_${qi}`]}</Text>
            )}

            {q.options.map((opt: string, oi: number) => (
              <View key={oi}>
                <View style={styles.optionRow}>
                  <TouchableOpacity onPress={() => setCorrect(qi, oi)}>
                    <Ionicons
                      name={q.correctIndex === oi ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={q.correctIndex === oi ? "#6C4EFF" : "#AAA"}
                    />
                  </TouchableOpacity>

                  <TextInput
                    placeholder={`Option ${oi + 1}`}
                    style={styles.optionInput}
                    value={opt}
                    onChangeText={(t) => updateOption(qi, oi, t)}
                  />
                </View>

                {errors[`q_${qi}_o_${oi}`] && (
                  <Text style={styles.error}>
                    {errors[`q_${qi}_o_${oi}`]}
                  </Text>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={styles.addOptionBtn}
              onPress={() => addOption(qi)}
            >
              <Ionicons name="add-circle-outline" size={18} color="#6C4EFF" />
              <Text style={styles.addOptionText}>Add Option</Text>
            </TouchableOpacity>

          </View>
        ))}

      </ScrollView>

      <TouchableOpacity style={styles.saveWrap} onPress={saveQuiz}>
        <LinearGradient colors={["#7B5CFF", "#5E3DF0"]} style={styles.saveBtn}>
          <Text style={styles.saveText}>Create Quiz</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 10 },
  newQuizBtn: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  newQuizText: { color: "#6C4EFF", fontWeight: "700", marginLeft: 6 },
  coverBox: { height: 150, borderRadius: 14, borderWidth: 2, borderColor: "#6C4EFF", justifyContent: "center", alignItems: "center", marginBottom: 20, backgroundColor: "#F8F7FF", overflow: "hidden" },
  coverPreview: { width: "100%", height: "100%" },
  addCover: { color: "#6C4EFF", marginTop: 6 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: { borderBottomWidth: 1, borderColor: "#6C4EFF", marginBottom: 4, paddingVertical: 8 },
  timeModeRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  modeBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1.5, borderColor: "#6C4EFF", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  modeActive: { backgroundColor: "#6C4EFF" },
  modeText: { color: "#6C4EFF", fontWeight: "600" },
  timeBox: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#6C4EFF", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6, backgroundColor: "#F8F7FF" },
  timeInput: { flex: 1, fontSize: 16, marginLeft: 8, color: "#333" },
  timeUnit: { color: "#6C4EFF", fontWeight: "600" },
  dropdownWrapper: { marginBottom: 20, position: "relative" },
  dropdown: { borderBottomWidth: 1, borderColor: "#6C4EFF", paddingVertical: 10, flexDirection: "row", justifyContent: "space-between" },
  dropdownMenu: { position: "absolute", top: 40, left: 0, right: 0, borderWidth: 1, borderColor: "#EEE", borderRadius: 10, backgroundColor: "#fff", zIndex: 999, elevation: 5 },
  dropdownItem: { padding: 10 },
  qHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  addBtn: { color: "#6C4EFF", fontWeight: "600" },
  qCard: { borderWidth: 1, borderColor: "#EEE", borderRadius: 12, padding: 12, marginBottom: 14 },
  qTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  qNumber: { fontWeight: "700", color: "#6C4EFF" },
  qInput: { borderBottomWidth: 1, borderColor: "#DDD", marginBottom: 6, paddingVertical: 6 },
  optionRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#EEE", borderRadius: 8, paddingHorizontal: 8, marginTop: 6 },
  optionInput: { flex: 1, paddingVertical: 6, marginLeft: 6 },
  addOptionBtn: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 6 },
  addOptionText: { color: "#6C4EFF", fontWeight: "600" },
  saveWrap: { marginTop: 10 },
  saveBtn: { paddingVertical: 16, borderRadius: 28, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  error: { color: "#F44336", fontSize: 12, marginBottom: 6, marginTop: 2 },

  // IMAGE QUESTION
  qImageBox: { height: 120, borderWidth: 1.5, borderColor: "#6C4EFF", borderRadius: 10, justifyContent: "center", alignItems: "center", marginBottom: 6, backgroundColor: "#F8F7FF" },
  qImage: { width: "100%", height: "100%", borderRadius: 10 }
});