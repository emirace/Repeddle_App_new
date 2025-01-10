import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  IconButton,
} from "react-native-paper";
import { LoginNavigationProp } from "../../types/navigation/stack";
import useAuth from "../../hooks/useAuth";

const Login: React.FC<LoginNavigationProp> = ({ navigation }) => {
  const { login, error: loginError } = useAuth();
  const { colors, dark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const result = await login({ email, password });
      if (result) {
        navigation.navigate("Main");
      } else {
        setError(loginError || "");
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // gotoForgetPassword();
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: dark
            ? "https://res.cloudinary.com/emirace/image/upload/v1658136003/Reppedle_White_d56cic.gif"
            : "https://res.cloudinary.com/emirace/image/upload/v1658136004/Reppedle_Black_ebqmot.gif",
        }}
        style={styles.logo}
        alt="logo"
      />
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
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.socialIconsContainer}>
          <IconButton
            icon="facebook"
            size={28}
            iconColor={colors.primary}
            style={styles.socialIcon}
          />
          <IconButton
            icon="google-plus"
            size={28}
            iconColor={colors.primary}
            style={styles.socialIcon}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: "contain",
    marginBottom: 40,
    position: "absolute",
    top: 70,
    alignSelf: "center",
  },
  content: { width: "100%" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
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
    marginTop: 16,
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
