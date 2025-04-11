import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, TextInput, useTheme, Text } from "react-native-paper";
import useAuth from "../../../hooks/useAuth";
import useToastNotification from "../../../hooks/useToastNotification";

interface Props {
  back: () => void;
  onSuccess: () => void;
  token: string;
}
const Password: React.FC<Props> = ({ back, onSuccess, token }) => {
  const { resetPassword, error: regError } = useAuth();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useToastNotification();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: "",
  });

  const formChange = (key: keyof typeof form, val: string) => {
    setForm({ ...form, [key]: val });
  };

  const formErrorChange = (key: keyof typeof formError, val: string) => {
    setFormError({ ...formError, [key]: val });
  };

  const validateForm = () => {
    if (form.password.length < 6) {
      setFormError({
        ...formError,
        password: "Password must be at least 6 characters",
      });
      return false;
    }
    if (form.password.search(/[a-z]/i) < 0) {
      setFormError({
        ...formError,
        password:
          "Password must contain at least 1 lowercase alphabetical character",
      });
      return false;
    }
    if (form.password.search(/[A-Z]/) < 0) {
      setFormError({
        ...formError,
        password:
          "Password must contain at least 1 uppercase alphabetical character",
      });
      return false;
    }
    if (form.password.search(/[0-9]/) < 0) {
      setFormError({
        ...formError,
        password: "Password must contain at least 1 digit",
      });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setFormError({
        ...formError,
        confirmPassword: "Confirm password must equal password",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const { password } = form;
    const result = await resetPassword(password, token);
    if (result) {
      onSuccess();
    } else {
      addNotification({
        message: regError || "Failed to reset password",
        error: true,
      });
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, justifyContent: "space-between" }}>
        <View>
          <Text
            style={{ fontSize: 35, marginBottom: 20, fontWeight: "medium" }}
          >
            Reset Password
          </Text>
          <View>
            <TextInput
              label="New Password"
              value={form.password}
              onChangeText={(text) => {
                formChange("password", text);
                formErrorChange("password", "");
              }}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="visible-password"
            />
            {formError.password ? (
              <Text style={styles.errorText}>{formError.password}</Text>
            ) : null}
          </View>
          <View>
            <TextInput
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(text) => {
                formChange("confirmPassword", text);
                formErrorChange("confirmPassword", "");
              }}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="visible-password"
            />
            {formError.confirmPassword ? (
              <Text style={styles.errorText}>{formError.confirmPassword}</Text>
            ) : null}
          </View>
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
          Reset
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
    fontFamily: "absential-sans-bold",
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
