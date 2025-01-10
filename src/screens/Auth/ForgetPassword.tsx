import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text, useTheme, Icon } from "react-native-paper";
import useAuth from "../../hooks/useAuth";
import { ForgetPasswordNavigationProp } from "../../types/navigation/stack";

const ForgetPassword: React.FC<ForgetPasswordNavigationProp> = ({
  navigation,
}) => {
  const { sendForgetPasswordEmail, error: forgetError } = useAuth();
  const { colors, dark } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    // Basic email validation
    if (!email.trim()) {
      setError("Please enter your email.");
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
    } else {
      setLoading(true);
      const result = await sendForgetPasswordEmail({ email });
      if (result) {
        setResetSuccess(true);
      }
      setLoading(false);
      // Reset error state
      setError(forgetError || "");
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return !resetSuccess ? (
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
        <Text style={styles.header}>Forgot Password</Text>
        <>
          <Text style={styles.description}>
            Enter your email to reset your password.
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
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            mode="contained"
            onPress={handleResetPassword}
            contentStyle={{ height: 50 }}
            uppercase
            style={styles.resetButton}
            labelStyle={{ color: "white" }}
            loading={loading}
            disabled={loading}
          >
            Reset Password
          </Button>

          <Text style={styles.registerText}>
            Remembered your password?{"  "}
            <Text
              style={{ color: colors.primary, fontWeight: "600" }}
              onPress={() => navigation.goBack()}
            >
              Log in
            </Text>
          </Text>
        </>
      </View>
    </View>
  ) : (
    <View
      style={{
        alignItems: "center",
        marginTop: 40,
        paddingHorizontal: 20,
        flex: 1,
      }}
    >
      <Icon source={"check-circle"} size={50} color={colors.primary} />
      <Text style={{ fontSize: 30, fontWeight: "600" }}>
        Email sent successfully
      </Text>
      <Text style={styles.successText}>
        Password reset email sent successfully. Check your email for further
        instructions.
      </Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 16,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  registerText: { textAlign: "center", marginTop: 20 },
});

export default ForgetPassword;
