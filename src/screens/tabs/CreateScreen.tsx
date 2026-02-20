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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../ViewAll/ViewAllHeader";

export default function CreateScreen() {
  const navigation: any = useNavigation();

  const [title, setTitle] = useState("");
  const [quizImage, setQuizImage] = useState<string | null>(null);

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", ""], correctIndex: 0 },
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

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) return;
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const setCorrect = (qIndex: number, index: number) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = index;
    setQuestions(updated);
  };

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

    questions.forEach((q, qi) => {
      if (!q.question.trim()) {
        newErrors[`q_${qi}`] = "Question required";
        valid = false;
      }
      q.options.forEach((opt: string, oi: number) => {
        if (!opt.trim()) {
          newErrors[`q_${qi}_o_${oi}`] = "Option required";
          valid = false;
        }
      });
    });

    if (questions.length === 0) {
      newErrors.questions = "Add at least one question";
      valid = false;
    }

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
      authorUsername: currentUser.username,
      authorEmail: currentUser.email,
      createdBy: currentUser.email,
    };

    quizzes.push(newQuiz);
    await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));

    Alert.alert("Quiz created");

    resetQuiz(); // ⭐ stay on screen ready for next quiz
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Create Quiz" showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ⭐ CREATE NEW QUIZ BUTTON */}
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

        {/* COLLECTION */}
        <Text style={styles.label}>Collection</Text>

        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text>
              {selectedCollection
                ? selectedCollection.title
                : "Select collection"}
            </Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {errors.collection && (
            <Text style={styles.error}>{errors.collection}</Text>
          )}

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

            <TextInput
              placeholder={`Question ${qi + 1}`}
              style={styles.qInput}
              value={q.question}
              onChangeText={(t) => updateQuestion(qi, t)}
            />
            {errors[`q_${qi}`] && (
              <Text style={styles.error}>{errors[`q_${qi}`]}</Text>
            )}

            {q.options.map((opt: string, oi: number) => (
              <View key={oi}>
                <View style={styles.optionRow}>
                  <TouchableOpacity onPress={() => setCorrect(qi, oi)}>
                    <Ionicons
                      name={
                        q.correctIndex === oi
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
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

                  {q.options.length > 2 && (
                    <TouchableOpacity onPress={() => removeOption(qi, oi)}>
                      <Ionicons name="close" size={18} color="#F44336" />
                    </TouchableOpacity>
                  )}
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
              <Text style={styles.addOptionText}>+ Add option</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.saveWrap} onPress={saveQuiz}>
          <LinearGradient
            colors={["#7B5CFF", "#5E3DF0"]}
            style={styles.saveBtn}
          >
            <Text style={styles.saveText}>Create Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  newQuizBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  newQuizText: {
    color: "#6C4EFF",
    fontWeight: "700",
    marginLeft: 6,
  },

  coverBox: {
    height: 150,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#6C4EFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#F8F7FF",
    overflow: "hidden",
  },

  coverPreview: { width: "100%", height: "100%" },
  addCover: { color: "#6C4EFF", marginTop: 6 },

  label: { fontWeight: "600", marginBottom: 6 },

  input: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    marginBottom: 4,
    paddingVertical: 8,
  },

  dropdownWrapper: {
    marginBottom: 20,
    position: "relative",
  },

  dropdown: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dropdownMenu: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 10,
    backgroundColor: "#fff",
    zIndex: 999,
    elevation: 5,
  },

  dropdownItem: { padding: 10 },

  qHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  addBtn: { color: "#6C4EFF", fontWeight: "600" },

  qCard: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },

  qTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  qNumber: { fontWeight: "700", color: "#6C4EFF" },

  qInput: {
    borderBottomWidth: 1,
    borderColor: "#DDD",
    marginBottom: 4,
    paddingVertical: 6,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 6,
  },

  optionInput: {
    flex: 1,
    paddingVertical: 6,
    marginLeft: 6,
  },

  addOptionBtn: { marginTop: 8 },

  addOptionText: {
    color: "#6C4EFF",
    fontWeight: "600",
  },

  saveWrap: { marginTop: 30, marginBottom: 40 },

  saveBtn: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  error: {
    color: "#F44336",
    fontSize: 12,
    marginBottom: 6,
    marginTop: 2,
  },
});