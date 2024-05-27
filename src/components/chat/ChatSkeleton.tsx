import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { useTheme } from "react-native-paper";

const ChatSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  const skeletonItems = Array.from({ length: 5 });

  return (
    <View style={styles.container}>
      {skeletonItems.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.messageContainer,
            { opacity },
            index % 2 !== 0 && { justifyContent: "flex-end" },
          ]}
        >
          {index % 2 === 0 && (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.elevation.level5 },
              ]}
            />
          )}
          <View
            style={[
              styles.messagePlaceholder,
              { backgroundColor: colors.elevation.level5 },
            ]}
          ></View>
        </Animated.View>
      ))}
    </View>
  );
};

const WIDTH = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },
  avatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  messagePlaceholder: {
    marginLeft: 10,
    width: "80%",
    borderRadius: 5,
    height: 40,
  },
});

export default ChatSkeleton;
