import { View, Text, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Appbar, Button, TextInput } from "react-native-paper";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import useAuth from "../../../../hooks/useAuth";

interface Props {
  back: () => void;
  onSuccess: () => void;
  token: string;
}
const Password: React.FC<Props> = ({ back, onSuccess, token }) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  const { createUserChangePassword, error: regError } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>("");
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

  const handleRegister = async () => {
    setLoading(true);
    const result = await createUserChangePassword({ password, token });
    if (result) {
      onSuccess();
    } else {
      setError(regError);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            back();
          }}
        />
        <Appbar.Content title="Create New Password" />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 20, justifyContent: "space-between" }}>
        <View>
          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="visible-password"
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.signInButton}
          uppercase
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: "800" }}
          loading={loading}
          disabled={loading}
        >
          Create Password
        </Button>
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

export default Password;
