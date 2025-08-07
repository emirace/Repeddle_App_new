import * as React from "react";
import { FC, useEffect } from "react";
import { Button, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import axios from "axios";
import { discovery } from "expo-auth-session/build/providers/Facebook";
import { IconButton, useTheme } from "react-native-paper";
import api from "../services/api";
import useToastNotification from "../hooks/useToastNotification";
import useAuth from "../hooks/useAuth";

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

const FacebookLoginButton: FC<{ color: string }> = ({ color }) => {
  const { colors } = useTheme();
  const { addNotification } = useToastNotification();
  const { getUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "987624389041257",
      redirectUri: AuthSession.makeRedirectUri(),
      scopes: ["public_profile", "email"],
      responseType: "code",
      extraParams: {
        display: "popup",
      },
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      api
        .post(`http://localhost:5000/auth/facebook/callback`, {
          code,
          redirectUri,
        })
        .then((res) => {
          console.log("User:", res);
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
      iconColor={color}
      style={{ marginHorizontal: 10 }}
    />
  );
};

export default FacebookLoginButton;
