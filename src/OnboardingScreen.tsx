import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles/styles";
const { width, height } = Dimensions.get("window");

const DATA = [
  {
    id: "1",
    image: require("../assets/slide1.png"),
    title:
      "Create, share and play quizzes whenever and wherever you want",
  },
  {
    id: "2",
    image: require("../assets/slide2.png"),
    title:
      "Find fun and interesting quizzes to boost up your knowledge",
  },
  {
    id: "3",
    image: require("../assets/slide3.png"),
    title:
      "Play and take quiz challenges together with your friends.",
  },
];

export default function OnboardingScreen() {
  const flatListRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= DATA.length) nextIndex = 0;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Animated.FlatList
        ref={flatListRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
      />

      <View style={styles.dotWrapper}>
        {DATA.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <LinearGradient
            colors={["#7B5CFF", "#5E3DF0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.primaryText}>GET STARTED</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>
            I ALREADY HAVE AN ACCOUNT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

