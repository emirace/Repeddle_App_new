import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

interface FormProps {
  setScreen: (screen: string) => void;
  loginGuest: (value: { email: string; fullName: string }) => void;
}

const Form: React.FC<FormProps> = ({ setScreen, loginGuest }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    fullName: "",
    email: "",
    error: "",
  });

  const handleContinue = async () => {
    setLoading(true);
    if (!fullName) {
      setFormError((prev) => ({
        ...prev,
        fullName: "Please enter your full name",
      }));
      setLoading(false);
      return;
    }
    if (!email) {
      setFormError((prev) => ({ ...prev, email: "Please enter your email" }));
      setLoading(false);
      return;
    }
    try {
      await loginGuest({ email, fullName });
      setScreen("chat");
    } catch (error) {
      setFormError((prev) => ({ ...prev, error: error as string }));
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
        {formError.fullName ? (
          <Text style={styles.errorText}>{formError.fullName}</Text>
        ) : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {formError.email ? (
          <Text style={styles.errorText}>{formError.email}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={[styles.button, (!email || !fullName) && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!email || !fullName || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
      {formError.error ? (
        <Text style={styles.errorText}>{formError.error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#ff6600",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default Form;
