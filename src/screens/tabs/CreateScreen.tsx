// CreateScreen.tsx
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

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const data = await AsyncStorage.getItem("collections");
    if (data) setCollections(JSON.parse(data));
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
      {
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
      },
    ]);
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

  const saveQuiz = async () => {
    if (!title.trim()) return Alert.alert("Title required");
    if (!selectedCollection) return Alert.alert("Select collection");
    if (questions.length === 0)
      return Alert.alert("Add at least one question");

    const currentUserStr = await AsyncStorage.getItem("currentUser");
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

    if (!currentUser) {
      Alert.alert("User not found");
      return;
    }

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
    };

    quizzes.push(newQuiz);
    await AsyncStorage.setItem("quizzes", JSON.stringify(quizzes));

    Alert.alert("Quiz created");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Reusable Header */}
      <AppHeader title="Create Quiz" showBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
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

        {/* COLLECTION */}
        <Text style={styles.label}>Collection</Text>

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

        {/* QUESTIONS */}
        <View style={styles.qHeader}>
          <Text style={styles.label}>Questions</Text>
          <TouchableOpacity onPress={addQuestion}>
            <Text style={styles.addBtn}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {questions.map((q, qi) => (
          <View key={qi} style={styles.qCard}>
            <TextInput
              placeholder={`Question ${qi + 1}`}
              style={styles.qInput}
              value={q.question}
              onChangeText={(t) => updateQuestion(qi, t)}
            />

            {q.options.map((opt: string, oi: number) => (
              <TouchableOpacity
                key={oi}
                style={[
                  styles.optionRow,
                  q.correctIndex === oi && styles.correct,
                ]}
                onPress={() => setCorrect(qi, oi)}
              >
                <TextInput
                  placeholder={`Option ${oi + 1}`}
                  style={styles.optionInput}
                  value={opt}
                  onChangeText={(t) => updateOption(qi, oi, t)}
                />
                {q.correctIndex === oi && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#6C4EFF"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* SAVE */}
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
    marginBottom: 20,
    paddingVertical: 8,
  },

  dropdown: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 20,
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

  qInput: {
    borderBottomWidth: 1,
    borderColor: "#DDD",
    marginBottom: 10,
    paddingVertical: 6,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
  },

  optionInput: { flex: 1, paddingVertical: 6 },

  correct: {
    borderColor: "#6C4EFF",
    backgroundColor: "#F4F2FF",
  },

  saveWrap: { marginTop: 30, marginBottom: 40 },

  saveBtn: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
