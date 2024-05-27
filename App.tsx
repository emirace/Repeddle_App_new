import "react-native-gesture-handler";
import Main from "./src";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Main />
        </KeyboardAvoidingView>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
