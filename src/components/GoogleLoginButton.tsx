import * as React from "react";
import { FC, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import axios from "axios";
import { IconButton, useTheme } from "react-native-paper";
import useToastNotification from "../hooks/useToastNotification";
import { Platform } from "react-native";
import { discovery } from "expo-auth-session/build/providers/Google";

const getClientId = () => {
  if (Platform.OS === "android")
    return "50737414415-mk2gbhhf7p3h86ti6mgvt4tp8tdmuipe.apps.googleusercontent.com";
  if (Platform.OS === "ios")
    return "50737414415-4agedachovminat47tvbvd91sqbnqj3v.apps.googleusercontent.com";
  return "50737414415-4s31f31a6jkcqj4kqa23qkihsvnfe8a9.apps.googleusercontent.com";
};

WebBrowser.maybeCompleteAuthSession();

const GoogleLoginButton: FC = () => {
  const { colors } = useTheme();
  const { addNotification } = useToastNotification();
  console.log(
    AuthSession.makeRedirectUri({
      native: "repeddle-app://redirect",
    })
  );

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getClientId(),
      redirectUri: AuthSession.makeRedirectUri({
        native: "repeddle-app://redirect",
      }),
      scopes: ["profile", "email"],
      responseType: "code",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log(code);
      axios
        .post("http://localhost:5000/auth/google/callback", {
          code,
        })
        .then((res) => {
          console.log("User:", res);
        })
        .catch((error) => {
          console.error("Error:", error);
          addNotification({ message: "Authentication failed", error: true });
        });
    } else if (response?.type === "error") {
      addNotification({ message: "Authentication failed", error: true });
    }
  }, [response]);

  return (
    <IconButton
      disabled={!request}
      onPress={() => promptAsync()}
      icon="google-plus"
      size={28}
      iconColor={colors.primary}
      style={{ marginHorizontal: 10 }}
    />
  );
};

export default GoogleLoginButton;
