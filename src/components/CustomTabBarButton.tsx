// CustomTabBarButton.tsx
import React from "react";
import {
  Platform,
  View,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { lightTheme } from "../constant/theme";
import { Path, Svg } from "react-native-svg";

interface CustomTabBarButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
}

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ onPress }) => {
  const { colors } = useTheme();
  return (
    <View style={{ position: "relative" }}>
      <TabBarCurve
      // style={styles.curve}
      />
      <View
        style={{
          marginTop: - 36,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          left: 0,
          right: 0,
          // bottom: -5,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          style={[styles.button, styles.shadow]}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>SELL</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.gapFix, { backgroundColor: colors.background }]} />
    </View>
  );
};

const TabBarCurve = () => {
  const { colors } = useTheme();
  return (
    <Svg width={90} height={59} fill="none">
      <Path
        fill="#8a171930"
        d="M90 0v57H0V0a10.504 10.504 0 0 1 5.98 8.84C10.004 26.679 25.946 40 45 40c19.03 0 34.955-13.288 39.004-31.092A10.504 10.504 0 0 1 90 0z"
      />
      <Path
        fill={colors.background}
        d="M90 2v57H0V2a10.504 10.504 0 0 1 5.98 8.84C10.004 28.679 25.946 42 45 42c19.03 0 34.955-13.288 39.004-31.092A10.504 10.504 0 0 1 90 2z"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: lightTheme.colors.primary,
    borderRadius: 100,
    width: 73,
    height: 73,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
  },
  shadow: {
    shadowColor: lightTheme.colors.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 5,
  },
  curve: {
    position: "absolute",
    bottom: 0,
    zIndex: -1,
  },
  gapFix: {
    width: "100%",
    height: 50,
  },
});

export default CustomTabBarButton;
