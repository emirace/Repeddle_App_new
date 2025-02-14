import "react-native-gesture-handler";
import Main from "./src";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { useFonts } from "expo-font";

export default function App() {
  const [fontsLoaded] = useFonts({
    "chronicle-text": require("./assets/fonts/ChronicleText.otf"),
    "chronicle-text-bold": require("./assets/fonts/ChronicleTextBold.otf"),
    "chronicle-text-medium": require("./assets/fonts/ChronicleTextMedium.otf"),
    "absential-sans-bold": require("./assets/fonts/AbsentiaSansBold.ttf"),
    "absential-sans-light": require("./assets/fonts/AbsentiaSansLight.ttf"),
    "absential-sans-medium": require("./assets/fonts/AbsentiaSansMedium.ttf"),
    "absential-sans-regular": require("./assets/fonts/AbsentiaSansRegular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
