import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function CreateCollections() {
  const navigation: any = useNavigation();

  const [title, setTitle] = useState("");
  const [visibleTo, setVisibleTo] = useState("Only Me");
  const [showDropdown, setShowDropdown] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // 📸 PICK IMAGE
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  // ✅ CREATE COLLECTION
  const createCollection = async () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Please enter collection title");
      return;
    }

    if (!coverImage) {
      Alert.alert("Cover required", "Please add cover image");
      return;
    }

    try {
      const existing = await AsyncStorage.getItem("collections");
      const collections = existing ? JSON.parse(existing) : [];

      const newCollection = {
        id: Date.now().toString(),
        title,
        image: coverImage,
        visibleTo,
      };

      collections.push(newCollection);

      await AsyncStorage.setItem("collections", JSON.stringify(collections));

      Alert.alert("Success", "Collection created");

      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Failed to create collection");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="close"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Create New Collection</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* COVER IMAGE */}
      <TouchableOpacity style={styles.coverBox} onPress={pickImage}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.coverPreview} />
        ) : (
          <>
            <Ionicons name="image-outline" size={34} color="#6C4EFF" />
            <Text style={styles.addCover}>Add Cover Image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* TITLE */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Enter a Collection Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      {/* VISIBLE */}
      <Text style={styles.label}>Visible to</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.dropdownText}>{visibleTo}</Text>
        <Ionicons name="chevron-down" size={18} color="#333" />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setVisibleTo("Only Me");
              setShowDropdown(false);
            }}
          >
            <Text>Only Me</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setVisibleTo("Public");
              setShowDropdown(false);
            }}
          >
            <Text>Public</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CREATE BUTTON */}
      <TouchableOpacity style={styles.buttonWrapper} onPress={createCollection}>
        <LinearGradient
          colors={["#7B5CFF", "#5E3DF0"]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Create</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  coverBox: {
    borderWidth: 2,
    borderColor: "#6C4EFF",
    borderRadius: 14,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#F8F7FF",
    overflow: "hidden",
  },

  coverPreview: { width: "100%", height: "100%" },

  addCover: {
    color: "#6C4EFF",
    marginTop: 8,
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 8,
    marginBottom: 25,
  },

  dropdown: {
    borderBottomWidth: 1,
    borderColor: "#6C4EFF",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: { fontSize: 15 },

  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },

  dropdownItem: { padding: 12 },

  buttonWrapper: { marginTop: "auto" },

  button: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
