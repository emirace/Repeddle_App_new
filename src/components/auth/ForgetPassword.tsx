import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, useTheme, Icon } from "react-native-paper";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import useAuth from "../../hooks/useAuth";

const ForgetPassword: React.FC<{ gotoLogin: () => void }> = ({ gotoLogin }) => {
  const { user, sendForgetPasswordEmail, error: forgetError } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);

  const handleOnFocus = useCallback(() => {
    shouldHandleKeyboardEvents.value = true;
  }, [shouldHandleKeyboardEvents]);
  const handleOnBlur = useCallback(() => {
    shouldHandleKeyboardEvents.value = false;
  }, [shouldHandleKeyboardEvents]);

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
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
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
            onPress={gotoLogin}
          >
            Log in
          </Text>
        </Text>
      </>
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
  },
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
