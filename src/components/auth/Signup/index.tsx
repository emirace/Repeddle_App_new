import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  IconButton,
  Icon,
} from "react-native-paper";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import useAuth from "../../../hooks/useAuth";

interface Props {
  gotoLogin: () => void;
  gotoToken: () => void;
  email: string;
  setEmail: (value: string) => void;
}

const SignUp: React.FC<Props> = ({ gotoLogin, gotoToken, email, setEmail }) => {
  const { sendVerifyOtp, error: signInError } = useAuth();
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  const { colors } = useTheme();
  const [error, setError] = useState("");
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

  const handleSignIn = async () => {
    // Basic email validation
    if (!email.trim()) {
      setError("Please enter your email.");
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
    } else {
      setLoading(true);
      const result = await sendVerifyOtp({ email });
      if (result) {
        gotoToken();
      } else {
        setError(signInError || "");
      }
      setLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <Text style={styles.description}>Enter your email to sign up.</Text>
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
        onPress={handleSignIn}
        style={styles.signInButton}
        uppercase
        contentStyle={{ height: 50 }}
        labelStyle={{ fontWeight: "800" }}
        loading={loading}
        disabled={loading}
      >
        Sign Up
      </Button>

      <Text style={styles.registerText}>
        Already have an account{" "}
        <Text
          style={{ color: colors.primary, fontWeight: "600" }}
          onPress={gotoLogin}
        >
          Log in
        </Text>
      </Text>

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
  signInButton: {
    marginTop: 16,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  registerText: { textAlign: "center", marginTop: 20 },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIcon: {
    marginHorizontal: 10,
  },

  successText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});

export default SignUp;
