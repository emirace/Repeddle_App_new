// CustomTabBarButton.tsx
import React from "react";
import {
  Platform,
  View,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { lightTheme } from "../constant/theme";

interface CustomTabBarButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
}

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ onPress }) => (
  <View style={{ marginTop: -(Platform.OS === "ios" ? 60 : 30) }}>
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.button, styles.shadow]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>SELL</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: lightTheme.colors.primary,
    borderRadius: 100,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 25,
  },
  shadow: {
    shadowColor: lightTheme.colors.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default CustomTabBarButton;
