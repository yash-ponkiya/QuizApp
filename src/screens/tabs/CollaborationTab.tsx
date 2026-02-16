import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const DATA = [
  {
    id: "1",
    title: "Guess the Names of Stars",
    subtitle: "5 days ago • 837 plays",
    collaborators: 6,
    img: "https://picsum.photos/200/200?1",
  },
  {
    id: "2",
    title: "Let's Play and Count Numbers",
    subtitle: "3 weeks ago • 1.3K plays",
    collaborators: 10,
    img: "https://picsum.photos/200/200?2",
  },
  {
    id: "3",
    title: "Genius is Created, Not Born",
    subtitle: "1 month ago • 1.7K plays",
    collaborators: 6,
    img: "https://picsum.photos/200/200?3",
  },
];

const CollaborationTab = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.thumbnail} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        <Text style={styles.collab}>
          {item.collaborators} collaborations
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>12 Collaborations</Text>
        <Text style={styles.sort}>Newest ⥮</Text>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CollaborationTab;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  sort: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F7F7FB",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },
  subtitle: {
    fontSize: 12,
    color: "#777",
    marginVertical: 2,
  },
  collab: {
    fontSize: 12,
    color: "#777",
  },
});
