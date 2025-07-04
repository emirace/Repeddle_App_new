import * as React from "react";
import { FC, useEffect } from "react";
import { Button, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import axios from "axios";
import { discovery } from "expo-auth-session/build/providers/Facebook";
import { IconButton, useTheme } from "react-native-paper";

// Complete the authentication when the browser redirects back
WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email?: string;
  name: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

const FacebookLoginButton: FC = () => {
  const { colors } = useTheme();
  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "1298755690808700",
      redirectUri,
      scopes: ["public_profile", "email"],
      responseType: "code",
      extraParams: {
        display: "popup",
      },
    },
    discovery
  );

  useEffect(() => {
    console.log("Redirect URI:", redirectUri);
    if (response?.type === "success") {
      const { code } = response.params;
      axios
        .post<AuthResponse>("http://localhost:5000/auth/facebook/mobile", {
          code,
          redirectUri,
        })
        .then((res) => {
          console.log("User:", res.data.user);
          // TODO: Store tokens, update UI
        })
        .catch((error) => {
          console.error("Error:", error);
          Alert.alert("Error", "Authentication failed");
        });
    } else if (response?.type === "error") {
      console.error("Auth error:", response.params);
      Alert.alert(
        "Error",
        "Authentication failed: " + response.params.error_description
      );
    }
  }, [response]);

  return (
    <IconButton
      disabled={!request}
      icon="facebook"
      onPress={() => promptAsync()}
      size={28}
      iconColor={colors.primary}
      style={{ marginHorizontal: 10 }}
    />
  );
};

export default FacebookLoginButton;
