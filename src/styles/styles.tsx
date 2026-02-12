import { StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    
    container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 30,
  },

  slide: {
    width: width,
    alignItems: "center",
    paddingHorizontal: 25,
  },

  image: {
    width: width * 0.9,
    height: height * 0.45,
    resizeMode: "contain",
    marginBottom: 35,
  },

  title: {
    fontSize: 30,
    textAlign: "center",
    color: "#1E1E1E",
    fontWeight: "700",
    lineHeight: 45,
    paddingHorizontal: 10,
  },

  dotWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#DADADA",
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: "#6C4EFF",
    width: 18,
  },

  buttonContainer: {
    paddingHorizontal: 25,
    marginBottom: 40,
  },

  primaryButton: {
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 16,
  },

  gradientButton: {
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 30,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 1,
  },

  secondaryButton: {
    backgroundColor: "#F3F3F8",
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: "center",
  },

  secondaryText: {
    color: "#6C4EFF",
    fontWeight: "600",
    fontSize: 14,
  },
})