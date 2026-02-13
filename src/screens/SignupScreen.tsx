import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

const SignupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [showDate, setShowDate] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);

  const countries = ["India", "United States", "United Kingdom", "Canada", "Australia"];

  const [form, setForm] = useState({
    accountType: "",
    workplace: "",
    fullName: "",
    dob: "",
    phone: "",
    country: "",
    age: "",
    username: "",
    email: "",
    password: "",
  });

  /* ================= EMAIL CHECK ================= */

  const checkEmailExists = async (email: string) => {
    const existing = await AsyncStorage.getItem("users");
    const users = existing ? JSON.parse(existing) : [];
    return users.some(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase()
    );
  };

  /* ================= VALIDATION ================= */

  const validateStep3 = async () => {
    let newErrors: any = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.dob.trim()) newErrors.dob = "Date of Birth is required";
    if (!form.phone.match(/^[0-9]{10}$/)) newErrors.phone = "Phone must be 10 digits";
    if (!form.country.trim()) newErrors.country = "Country is required";
    if (!form.age.match(/^[0-9]+$/)) newErrors.age = "Enter valid age";

    if (!form.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Invalid email";
    } else {
      const exists = await checkEmailExists(form.email);
      if (exists) newErrors.email = "Email already registered";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(4);
    }
  };

  const validateStep4 = async () => {
    let newErrors: any = {};

    if (!form.username.trim()) newErrors.username = "Username required";
    if (form.password.length < 6) newErrors.password = "Password must be 6+ characters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await saveUser();
    }
  };

  /* ================= SAVE ================= */

  const saveUser = async () => {
    const existing = await AsyncStorage.getItem("users");
    const users = existing ? JSON.parse(existing) : [];

    users.push(form);
    await AsyncStorage.setItem("users", JSON.stringify(users));

    Alert.alert("Success", "Account Created Successfully!", [
      { text: "OK", onPress: () => navigation.replace("Home") },
    ]);
  };

  const progressWidth = `${(step / 4) * 100}%` as `${number}%`;

  const OptionCard = ({ title, color, icon, field }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setForm({ ...form, [field]: title });
        setStep(step + 1);
      }}
    >
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color="#fff" />
      </View>
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ paddingTop: insets.top + 8, flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.headerRow}>
            {step > 1 && (
              <TouchableOpacity onPress={() => setStep(step - 1)} style={{ paddingRight: 8 }}>
                <Ionicons name="arrow-back" size={22} />
              </TouchableOpacity>
            )}
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
          </View>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Text style={styles.title}>What type of account do you like to create? 🤔</Text>
              <Text style={styles.subtitle}>You can skip it if you're not sure.</Text>

              <OptionCard title="Personal" color="#4D96FF" icon="person" field="accountType" />
              <OptionCard title="Teacher" color="#FF9F1C" icon="school" field="accountType" />
              <OptionCard title="Student" color="#00C897" icon="book" field="accountType" />
              <OptionCard title="Professional" color="#FF6B6B" icon="briefcase" field="accountType" />

              <TouchableOpacity onPress={() => setStep(2)}>
                <Text style={styles.skip}>Skip</Text>
              </TouchableOpacity>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Text style={styles.title}>Describe a workplace that suits you 💼</Text>
              <Text style={styles.subtitle}>You can skip it if you're not sure.</Text>

              <OptionCard title="School" color="#4D96FF" icon="school" field="workplace" />
              <OptionCard title="Higher Education" color="#FF9F1C" icon="library" field="workplace" />
              <OptionCard title="Teams" color="#00C897" icon="people" field="workplace" />
              <OptionCard title="Business" color="#FF6B6B" icon="business" field="workplace" />

              <TouchableOpacity onPress={() => setStep(3)}>
                <Text style={styles.skip}>Skip</Text>
              </TouchableOpacity>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <Text style={styles.title}>Create an account ✏️</Text>
              <Text style={styles.subtitleCenter}>
                Please complete your profile.{"\n"}
                Don't worry, your data will remain private.
              </Text>

              <LabelInput label="Full Name" value={form.fullName}
                onChange={(t: string) => setForm({ ...form, fullName: t })}
              />
              {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

              <TouchableOpacity onPress={() => setShowDate(true)}>
                <LabelInput label="Date of Birth" value={form.dob} icon="calendar-outline" onChange={() => {}} />
              </TouchableOpacity>
              {errors.dob && <Text style={styles.error}>{errors.dob}</Text>}

              {showDate && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  maximumDate={new Date()}
                  display="default"
                  onChange={(e, d) => {
                    setShowDate(false);
                    if (d) setForm({ ...form, dob: d.toDateString() });
                  }}
                />
              )}

              <LabelInput label="Phone Number" value={form.phone}
                onChange={(t: string) => setForm({ ...form, phone: t.replace(/[^0-9]/g, "").slice(0, 10) })}
              />
              {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

              <TouchableOpacity onPress={() => setShowCountryList(!showCountryList)}>
                <LabelInput label="Country" value={form.country} icon="chevron-down-outline" onChange={() => {}} />
              </TouchableOpacity>

              {showCountryList && countries.map((c) => (
                <TouchableOpacity key={c} onPress={() => {
                  setForm({ ...form, country: c });
                  setShowCountryList(false);
                }}>
                  <Text style={{ padding: 8 }}>{c}</Text>
                </TouchableOpacity>
              ))}
              {errors.country && <Text style={styles.error}>{errors.country}</Text>}

              <LabelInput label="Age" value={form.age}
                onChange={(t: string) => setForm({ ...form, age: t.replace(/[^0-9]/g, "") })}
              />
              {errors.age && <Text style={styles.error}>{errors.age}</Text>}

              {/* EMAIL */}
              <LabelInput label="Email" value={form.email}
                onChange={(t: string) => setForm({ ...form, email: t })}
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <GradientButton text="Continue" onPress={validateStep3} />
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <Text style={styles.title}>Create an account ✏️</Text>
              <Text style={styles.subtitle}>
                Please enter your username and password.
              </Text>

              {renderInput("Username", (t: string) => setForm({ ...form, username: t }))}
              {errors.username && <Text style={styles.error}>{errors.username}</Text>}

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  onChangeText={(t) => setForm({ ...form, password: t })}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={18} color="#6C4EFF" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.error}>{errors.password}</Text>}

              <View style={styles.rememberRow}>
                <Switch value={remember} onValueChange={setRemember} />
                <Text style={{ marginLeft: 8 }}>Remember me</Text>
              </View>

              <GradientButton text="Sign up" onPress={validateStep4} />
            </>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

/* reusable + styles unchanged */
const LabelInput = ({ label, value, onChange, icon }: any) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput style={styles.input} value={value} onChangeText={onChange} />
      {icon && <Ionicons name={icon} size={18} color="#6C4EFF" />}
    </View>
  </View>
);

const renderInput = (placeholder: string, onChange: any) => (
  <View style={styles.inputRow}>
    <TextInput placeholder={placeholder} style={styles.input} onChangeText={onChange} />
  </View>
);

const GradientButton = ({ text, onPress }: any) => (
  <TouchableOpacity style={styles.btnWrapper} onPress={onPress}>
    <LinearGradient colors={["#7B5CFF", "#5E3DF0"]} style={styles.gradientBtn}>
      <Text style={styles.btnText}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  progressBg: { flex: 1, height: 6, backgroundColor: "#E5E5E5", borderRadius: 10, marginLeft: 10 },
  progressFill: { height: 6, backgroundColor: "#6C4EFF", borderRadius: 10 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  subtitle: { color: "#777", marginBottom: 20, textAlign: "center" },
  subtitleCenter: { color: "#777", marginBottom: 25, textAlign: "center" },
  label: { fontSize: 13, color: "#333", marginBottom: 6 },
  card: { backgroundColor: "#F7F7F7", padding: 18, borderRadius: 15, flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardText: { fontSize: 15, fontWeight: "600" },
  skip: { textAlign: "center", color: "#6C4EFF", marginTop: 15 },
  inputRow: { borderBottomWidth: 1, borderColor: "#6C4EFF", paddingVertical: 6, flexDirection: "row", alignItems: "center" },
  input: { flex: 1, fontSize: 14 },
  rememberRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  btnWrapper: { borderRadius: 25, overflow: "hidden", marginTop: 10 },
  gradientBtn: { paddingVertical: 18, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  error: { color: "red", fontSize: 12, marginTop: -15, marginBottom: 10 },
});

export default SignupScreen;
