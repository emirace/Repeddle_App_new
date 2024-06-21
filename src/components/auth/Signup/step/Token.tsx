import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Text,
  useTheme,
} from "react-native-paper";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import useAuth from "../../../../hooks/useAuth";

interface TokenComponentProps {
  onVerify: () => void;
  back: () => void;
  email: string;
  token: string;
  setToken: (value: (prevToken: string) => string) => void;
}

const Token: React.FC<TokenComponentProps> = ({
  onVerify,
  email,
  back,
  setToken,
  token,
}) => {
  const { sendVerifyOtp, verifyEmail, error } = useAuth();
  const { colors } = useTheme();
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const inputRefs: React.RefObject<TextInput>[] = Array.from(
    { length: 5 },
    () => React.createRef()
  );

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

  useEffect(() => {
    // Focus the first input when the component mounts
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    // Decrease the countdown timer every second
    const timerInterval = setInterval(() => {
      setResendTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(timerInterval);
  }, []);

  const handleInputChange = (index: number, text: string) => {
    setToken((prevToken) => {
      // Copy the previous token to modify the character at the current index
      const newToken = prevToken.split("");
      newToken[index] = text;

      // Join the modified characters to form the updated token
      const updatedToken = newToken.join("");

      // If the current input is not empty, move focus to the next input
      if (text && index < 4) {
        inputRefs[index + 1].current?.focus();
      }

      // Notify the parent component of the updated token
      // onTokenChange(updatedToken);

      return updatedToken;
    });
  };

  const handleInputKeyPress = (index: number, key: string) => {
    // If the backspace key is pressed and the current input is empty,
    // move focus to the previous input and delete the character there
    if (key === "Backspace" && !token[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
      handleInputChange(index - 1, "");
    }
  };

  const handleResend = async () => {
    setSendingOtp(true);
    const result = await sendVerifyOtp({ email });
    if (result) {
      setResendTimer(60);
    }
    setSendingOtp(false);
    // Add logic to resend the OTP
  };

  const handleVerify = async () => {
    setLoading(true);
    const result = await verifyEmail({ token });
    if (result) {
      onVerify();
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            back();
          }}
        />
        <Appbar.Content title="Verify Token" />
      </Appbar.Header>
      <View style={styles.content}>
        <View>
          <Text style={{ fontWeight: "600", fontSize: 17, marginBottom: 5 }}>
            Enter OTP
          </Text>
          <Text style={{ marginBottom: 10 }}>
            We have send you an OTP on {email}
          </Text>
          <View style={styles.inputContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[
                  styles.input,
                  {
                    borderColor: colors.onBackground,
                    color: colors.onBackground,
                    fontSize: 30,
                  },
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={token[index]}
                onChangeText={(text) => handleInputChange(index, text)}
                cursorColor={"red"}
                onKeyPress={({ nativeEvent }) =>
                  handleInputKeyPress(index, nativeEvent.key)
                }
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
              />
            ))}
          </View>
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
          <View style={styles.count}>
            {sendingOtp ? (
              <ActivityIndicator />
            ) : resendTimer > 0 ? (
              <Text>
                Resend OTP in{" "}
                <Text style={{ fontWeight: "bold", color: colors.primary }}>
                  {`${Math.floor(resendTimer / 60)
                    .toString()
                    .padStart(2, "0")}:${(resendTimer % 60)
                    .toString()
                    .padStart(2, "0")}`}
                </Text>{" "}
                seconds
              </Text>
            ) : (
              <Button
                onPress={handleResend}
                labelStyle={{ fontWeight: "bold" }}
              >
                Resend OTP
              </Button>
            )}
          </View>
        </View>
        {/* Add a button or any other UI element for verifying the token */}
        <Button
          mode="contained"
          contentStyle={{ height: 50 }}
          style={styles.verifyButton}
          uppercase
          onPress={handleVerify}
          loading={loading}
          disabled={token.length < 5 || loading}
        >
          Verify
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 16,
    // padding: 20,
    flex: 1,
  },
  content: { justifyContent: "space-between", flex: 1, padding: 20 },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
  },
  count: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 30,
  },
  verifyButton: {
    marginVertical: 20,
    borderRadius: 5,
  },
});

export default Token;
