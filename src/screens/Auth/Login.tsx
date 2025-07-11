import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  IconButton,
} from "react-native-paper";
import { LoginNavigationProp } from "../../types/navigation/stack";
import useAuth from "../../hooks/useAuth";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import FacebookLoginButton from "../../components/FacebookLoginButton";

const Login: React.FC<LoginNavigationProp> = ({ navigation, route }) => {
  const { login, error: loginError } = useAuth();
  const { colors, dark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { navigate } = navigation;

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    // Basic email and password validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
    } else {
      setLoading(true);
      const result = await login({
        email: email.trim().toLowerCase(),
        password,
      });
      if (result) {
        route.params?.back ? navigation.pop() : navigate("Main");
      } else {
        setError(loginError || "");
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.push("ForgetPassword");
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: dark
            ? require("../../../assets/images/white_anime_logo.gif")
            : require("../../../assets/images/black_anime_logo.gif"),
        }}
        style={styles.logo}
        alt="logo"
      />
      {navigation.canGoBack() && route.params?.back ? (
        <IconButton
          icon={"close"}
          style={{ position: "absolute", top: 0, right: 0 }}
          onPress={() => navigation.pop()}
        />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.header}>Log In</Text>
        <Text style={styles.description}>
          Enter your email and password to continue.
        </Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          // onFocus={handleOnFocus}
          // onBlur={handleOnBlur}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={handleTogglePasswordVisibility}
            />
          }
          style={styles.input}
          secureTextEntry={!showPassword}
          // onFocus={handleOnFocus}
          // onBlur={handleOnBlur}
        />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleLogin}
          uppercase
          style={styles.loginButton}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: "800" }}
          loading={loading}
          disabled={loading}
        >
          Sign in
        </Button>
        <Text style={styles.registerText}>
          Don't have an account{" "}
          <Text
            style={{ color: colors.primary, fontWeight: "600" }}
            onPress={() => navigate("SignUp")}
          >
            Sign Up
          </Text>
        </Text>

        <View style={styles.socialIconsContainer}>
          <FacebookLoginButton />
          <GoogleLoginButton navigation={navigation} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: "center",
    // alignItems: "center",
    paddingTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: "contain",
    marginBottom: 40,
    alignSelf: "center",
  },
  content: { width: "100%" },
  header: {
    fontSize: 28,
    fontFamily: "absential-sans-bold",
    marginBottom: 10,
  },
  registerText: { textAlign: "center", marginTop: 20 },
  description: {
    fontSize: 16,
    opacity: 0.5,
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
  },
  forgotPasswordText: {
    marginTop: -5,
    marginBottom: 16,
    textAlign: "right",
    textDecorationLine: "underline",
    fontSize: 18,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default Login;
