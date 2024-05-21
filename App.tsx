import "react-native-gesture-handler";
import Main from "./src";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "./src/contexts/ThemeContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
