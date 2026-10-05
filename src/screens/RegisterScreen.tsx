import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Easing,
} from "react-native";
import { signUp } from "../services/authService";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [loading, setLoading] = useState(false);

  // =====================================
  // ANIMATION VALUES
  // =====================================
  const fadeAnim = useRef(new Animated.Value(0)).current; // Hiện từ từ
  const slideAnim = useRef(new Animated.Value(40)).current; // Trượt từ dưới lên
  const floatAnim = useRef(new Animated.Value(0)).current; // Icon bay nhấp nhô
  const buttonScale = useRef(new Animated.Value(1)).current; // Hiệu ứng bấm nút

  useEffect(() => {
    // 1. Hiệu ứng xuất hiện cho Form (Fade + Slide)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Hiệu ứng bay nhấp nhô liên tục cho Header Icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animation khi nhấn nút Đăng ký
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // =====================================
  // XỬ LÝ ĐĂNG KÝ
  // =====================================
  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password, name.trim(), role);

      Alert.alert(
        "Đăng ký thành công 🎉",
        "Tài khoản của bạn đã được tạo thành công. Đăng nhập ngay!",
        [
          {
            text: "Đăng nhập ngay",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Đăng ký thất bại",
        error.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.innerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* LOGO / HEADER */}
            <View style={styles.headerBox}>
              <Animated.View
                style={[
                  styles.iconCircle,
                  { transform: [{ translateY: floatAnim }] },
                ]}
              >
                <Text style={styles.logoIcon}>🎓</Text>
              </Animated.View>

              <Text style={styles.title}>Tạo tài khoản mới</Text>
              <Text style={styles.subtitle}>
                Điền thông tin để bắt đầu trải nghiệm đặt phòng
              </Text>
            </View>

            {/* FORM INPUTS */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@vku.udn.vn"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mật khẩu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* TÙY CHỌN LOẠI TÀI KHOẢN */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bạn là?</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.roleButton,
                      role === "student" && styles.selectedRole,
                    ]}
                    onPress={() => setRole("student")}
                  >
                    <Text style={styles.roleIcon}>👨‍🎓</Text>
                    <Text
                      style={[
                        styles.roleText,
                        role === "student" && styles.selectedRoleText,
                      ]}
                    >
                      Sinh viên
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.roleButton,
                      role === "teacher" && styles.selectedRole,
                    ]}
                    onPress={() => setRole("teacher")}
                  >
                    <Text style={styles.roleIcon}>👨‍🏫</Text>
                    <Text
                      style={[
                        styles.roleText,
                        role === "teacher" && styles.selectedRoleText,
                      ]}
                    >
                      Giảng viên
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* NÚT ĐĂNG KÝ CÓ ANIMATION */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleRegister}
                disabled={loading}
              >
                <Animated.View
                  style={[
                    styles.button,
                    loading && styles.disabledButton,
                    { transform: [{ scale: buttonScale }] },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.buttonText}>Đăng ký ngay</Text>
                  )}
                </Animated.View>
              </TouchableOpacity>

              {/* CHUYỂN SANG ĐĂNG NHẬP */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.loginBox}
              >
                <Text style={styles.loginText}>
                  Đã có tài khoản?{" "}
                  <Text style={styles.loginTextBold}>Đăng nhập</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 24,
  },
  innerContainer: {
    paddingHorizontal: 28,
  },
  headerBox: {
    alignItems: "center",
    marginBottom: 28,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#dbeafe",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 38,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#0f172a",
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  selectedRole: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  roleIcon: {
    fontSize: 18,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  selectedRoleText: {
    color: "#2563eb",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  loginBox: {
    marginTop: 22,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#64748b",
  },
  loginTextBold: {
    color: "#2563eb",
    fontWeight: "700",
  },
});