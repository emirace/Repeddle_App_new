import React, {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  themeMode: "dark" | "light";
  selectedThemeMode: "default" | "dark" | "light";
  toggleTheme: (value: "default" | "dark" | "light") => void;
};

interface Props {
  children?: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const colorScheme = useColorScheme();

  const loadThemeMode = async () => {
    try {
      const storedThemeMode = await SecureStore.getItemAsync(
        "selectedThemeMode"
      );
      const initialThemeMode = storedThemeMode
        ? (storedThemeMode as "default" | "dark" | "light")
        : "default";
      setSelectedThemeMode(initialThemeMode);
    } catch (error) {
      console.error("Error loading theme mode:", error);
    }
  };

  const saveThemeMode = async () => {
    try {
      await SecureStore.setItemAsync("selectedThemeMode", selectedThemeMode);
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  };

  const [selectedThemeMode, setSelectedThemeMode] = useState<
    "default" | "dark" | "light"
  >("default");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("light");

  const toggleTheme = (value: "default" | "dark" | "light") => {
    setSelectedThemeMode(value);
  };

  // Load initial theme mode on component mount
  useEffect(() => {
    loadThemeMode();
  }, []);

  // Save theme mode whenever it changes
  useEffect(() => {
    saveThemeMode();
  }, [selectedThemeMode]);

  // Listen for default appearance changes
  useEffect(() => {
    if (selectedThemeMode === "default") {
      setThemeMode(colorScheme as "dark" | "light");
    } else {
      setThemeMode(selectedThemeMode);
    }
  }, [selectedThemeMode]);

  return (
    <ThemeContext.Provider
      value={{ themeMode, toggleTheme, selectedThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
