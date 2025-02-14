import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { Appbar, Button, TextInput, useTheme } from "react-native-paper";
import useAuth from "../../../../hooks/useAuth";
import useToastNotification from "../../../../hooks/useToastNotification";

interface Props {
  back: () => void;
  onSuccess: () => void;
  token: string;
}
const Password: React.FC<Props> = ({ back, onSuccess, token }) => {
  const { registerUser, error: regError } = useAuth();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useToastNotification();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
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
    if (form["firstName"].length < 3) {
      setFormError({
        ...formError,
        firstName: `First name must be at least 3 characters`,
      });
      return false;
    }

    if (form["lastName"].length < 3) {
      setFormError({
        ...formError,
        lastName: `Last name must be at least 3 characters`,
      });
      return false;
    }

    if (form.username.length < 3) {
      setFormError({
        ...formError,
        username: `Username must be at least 3 characters`,
      });
      return false;
    }

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
    const { firstName, lastName, password, phone, username } = form;
    const result = await registerUser({
      password,
      token,
      firstName,
      lastName,
      phone,
      username,
    });
    if (result) {
      onSuccess();
    } else {
      addNotification({
        message: regError || "Failed to register",
        error: true,
      });
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
          iconColor={colors.onBackground}
        />
        <Appbar.Content
          titleStyle={{ color: colors.onBackground }}
          title="Create New Account"
        />
      </Appbar.Header>
      <ScrollView
        style={{ flex: 1, padding: 20, justifyContent: "space-between" }}
      >
        <View>
          <View>
            <TextInput
              label="First Name"
              value={form.firstName}
              onChangeText={(text) => {
                formChange("firstName", text);
                formErrorChange("firstName", "");
              }}
              style={styles.input}
            />
            {formError.firstName ? (
              <Text style={styles.errorText}>{formError.firstName}</Text>
            ) : null}
          </View>

          <View>
            <TextInput
              label="Last Name"
              value={form.lastName}
              onChangeText={(text) => {
                formChange("lastName", text);
                formErrorChange("lastName", "");
              }}
              style={styles.input}
            />
            {formError.lastName ? (
              <Text style={styles.errorText}>{formError.lastName}</Text>
            ) : null}
          </View>

          <View>
            <TextInput
              label="Username"
              value={form.username}
              onChangeText={(text) => {
                formChange("username", text);
                formErrorChange("username", "");
              }}
              style={styles.input}
            />
            {formError.username ? (
              <Text style={styles.errorText}>{formError.username}</Text>
            ) : null}
          </View>

          <View>
            <TextInput
              label="Phone"
              value={form.phone}
              onChangeText={(text) => {
                formChange("phone", text);
                formErrorChange("phone", "");
              }}
              style={styles.input}
            />
            {formError.phone ? (
              <Text style={styles.errorText}>{formError.phone}</Text>
            ) : null}
          </View>

          <View>
            <TextInput
              label="Password"
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
          Create Account
        </Button>
      </ScrollView>
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
