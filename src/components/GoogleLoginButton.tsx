import * as React from "react";
import { FC, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { ActivityIndicator, IconButton, useTheme } from "react-native-paper";
import useToastNotification from "../hooks/useToastNotification";
import { Platform } from "react-native";
import { discovery } from "expo-auth-session/build/providers/Google";
import api, { baseURL } from "../services/api";
import useAuth from "../hooks/useAuth";
import * as SecureStore from "expo-secure-store";

const getClientId = () => {
  if (Platform.OS === "android")
    return "50737414415-mk2gbhhf7p3h86ti6mgvt4tp8tdmuipe.apps.googleusercontent.com";
  if (Platform.OS === "ios")
    return "50737414415-4agedachovminat47tvbvd91sqbnqj3v.apps.googleusercontent.com";
  return "50737414415-4s31f31a6jkcqj4kqa23qkihsvnfe8a9.apps.googleusercontent.com";
};

const getRedirectUri = () => {
  if (Platform.OS === "android")
    return "com.googleusercontent.apps.50737414415-mk2gbhhf7p3h86ti6mgvt4tp8tdmuipe:/oauth2redirect/google";

  if (Platform.OS === "ios")
    return "com.googleusercontent.apps.50737414415-4agedachovminat47tvbvd91sqbnqj3v:/oauth2redirect/google";

  return AuthSession.makeRedirectUri({});
};

WebBrowser.maybeCompleteAuthSession();

const GoogleLoginButton: FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { addNotification } = useToastNotification();
  const { getUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getClientId(),
      redirectUri: getRedirectUri(),
      scopes: ["profile", "email"],
      responseType: "code",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      setLoading(true);
      const { code } = response.params;
      console.log(code);
      api
        .get(
          `/auth/google/callback?code=${code}&codeVerifier=${request?.codeVerifier}&type=${Platform.OS}`
        )
        .then(async (res: any) => {
          console.log("User:", res);
          await SecureStore.setItemAsync("authToken", res.token);
          getUser();
          navigation.replace("Main");
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          addNotification({ message: "Authentication failed", error: true });
          setLoading(false);
        });
    } else if (response?.type === "error") {
      addNotification({ message: "Authentication failed", error: true });
    }
  }, [response]);

  return loading ? (
    <ActivityIndicator />
  ) : (
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
