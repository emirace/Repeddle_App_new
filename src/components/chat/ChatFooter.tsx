import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useTheme, ActivityIndicator } from "react-native-paper";
import { IConversation } from "../../types/message";

interface ISending {
  value: boolean;
  message: string;
  failed: boolean;
}

interface IChatFooterProps {
  isTypingList: { id: string }[];
  currentConversation: IConversation | null;
  sending: ISending;
  handleRetry: () => void;
}

const ChatFooter: React.FC<IChatFooterProps> = ({
  isTypingList,
  currentConversation,
  sending,
  handleRetry,
}) => {
  const { colors } = useTheme();

  const bounceAnim1 = useRef(new Animated.Value(0)).current;
  const bounceAnim2 = useRef(new Animated.Value(0)).current;
  const bounceAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = (anim: Animated.Value, delay: number) => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: -3,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 3,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    };

    bounce(bounceAnim1, 0);
    bounce(bounceAnim2, 150);
    bounce(bounceAnim3, 300);
  }, [bounceAnim1, bounceAnim2, bounceAnim3]);

  return (
    <View>
      {isTypingList.find((type) => type.id === currentConversation?._id) && (
        <View style={styles.typingIndicatorContainer}>
          <View
            style={[
              styles.typingIndicator,
              { backgroundColor: colors.background },
            ]}
          >
            <Animated.View
              style={[
                styles.typingDot,
                { transform: [{ translateY: bounceAnim1 }] },
                { backgroundColor: colors.onBackground },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                { transform: [{ translateY: bounceAnim2 }] },
                { backgroundColor: colors.onBackground },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                { transform: [{ translateY: bounceAnim3 }] },
                { backgroundColor: colors.onBackground },
              ]}
            />
          </View>
        </View>
      )}
      {sending.value && (
        <View style={styles.sendingContainer}>
          <View
            style={[styles.sendingMessage, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.sendingMessageText}>{sending.message}</Text>
            <View style={styles.sendingStatusText}>
              {sending.failed ? (
                <Text style={styles.failedText}>
                  Failed{" "}
                  <Text style={styles.retryText} onPress={handleRetry}>
                    Retry
                  </Text>
                </Text>
              ) : (
                <ActivityIndicator color={colors.onBackground} size={10} />
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  typingIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 4,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 50,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 2,
  },
  sendingContainer: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  sendingMessage: {
    maxWidth: "80%",
    padding: 8,
    borderRadius: 10,
  },
  sendingMessageText: {
    color: "#fff",
  },
  sendingStatusText: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  failedText: {
    color: "#ff0000",
  },
  retryText: {
    textDecorationLine: "underline",
  },
});

export default ChatFooter;
