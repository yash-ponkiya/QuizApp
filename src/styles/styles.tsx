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

  containert: { flex: 1, backgroundColor: "#fff", padding: 20 },

  qCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 14,
  },

  unattemptedQ: {
    backgroundColor: "#FFEDEE",
    borderColor: "#FFB3B3",
  },

  question: { fontWeight: "700", marginBottom: 10 },

  option: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },

  selected: { borderColor: "#6C4EFF", backgroundColor: "#F4F2FF" },
  correct: { borderColor: "#4CAF50", backgroundColor: "#E8F5E9" },
  wrong: { borderColor: "#F44336", backgroundColor: "#FFEBEE" },

  optText: { fontSize: 14 },

  submitBtn: {
    backgroundColor: "#6C4EFF",
    padding: 16,
    borderRadius: 28,
    alignItems: "center",
  },

  submitText: { color: "#fff", fontWeight: "700" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  startBox: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },

  startTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },

  startCount: {
    fontSize: 42,
    fontWeight: "800",
    color: "#6C4EFF",
    marginVertical: 6,
  },

  startSub: {
    color: "#777",
    fontSize: 13,
  },

  modalBox: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },

  modalTitle: { fontSize: 18, fontWeight: "700", marginTop: 10 },

  scoreText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#6C4EFF",
    marginVertical: 10,
  },

  resultRow: {
    marginTop: 6,
    marginBottom: 10,
    alignItems: "center",
    gap: 2,
  },

  correctText: { color: "#4CAF50", fontWeight: "700" },
  wrongText: { color: "#F44336", fontWeight: "700" },
  unText: { color: "#FF3B30", fontWeight: "800" },

  doneBtn: {
    backgroundColor: "#6C4EFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 6,
  },

  doneText: { color: "#fff", fontWeight: "700" },

  skelCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 14,
  },

  skelLineLarge: {
    height: 14,
    backgroundColor: "#EEE",
    borderRadius: 6,
    marginBottom: 10,
    width: "80%",
  },

  skelLine: {
    height: 12,
    backgroundColor: "#EEE",
    borderRadius: 6,
    marginBottom: 8,
    width: "90%",
  },
})