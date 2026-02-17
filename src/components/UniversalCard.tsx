import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  image: string;
  title?: string;
  subtitle?: string;
  avatar?: string;
  variant?: "discover" | "author" | "collection";
};

export default function UniversalCard({
  image,
  title,
  subtitle,
  avatar,
  variant = "discover",
}: Props) {
  return (
    <View style={[styles.card, variant === "author" && styles.authorCard]}>
      <Image source={{ uri: image }} style={styles.image} />

      {variant === "author" && (
        <Text style={styles.textPrimary} numberOfLines={1}>
          {title}
        </Text>
      )}

      {variant === "discover" && (
        <>
          <Text style={styles.textPrimary} numberOfLines={2}>
            {title}
          </Text>

          <View style={styles.row}>
            {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
            <Text style={styles.textSecondary} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </>
      )}

      {variant === "collection" && (
        <View style={styles.overlay}>
          <Text style={styles.textOverlay} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    width: 200,
    marginRight: 14,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "center",
  },

  image: {
    width: "100%",
    height: 100,
  },


  textPrimary: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginTop: 6,
  },

  textSecondary: {
    fontSize: 12,
    color: "#666",
  },

  textOverlay: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  avatar: {
    width: 15,
    height: 15,
    borderRadius: 9,
    marginRight: 6,
  },

  authorCard: {
    width: 70,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
});
