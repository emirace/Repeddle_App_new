import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Button, Icon, IconButton, useTheme } from "react-native-paper";
import useToastNotification from "../../hooks/useToastNotification";

const { width } = Dimensions.get("screen");

const ToastNotification: React.FC = () => {
  const { notifications, removeNotification } = useToastNotification();
  const { colors } = useTheme();

  useEffect(() => {
    const notificationTimeouts: Record<string, NodeJS.Timeout> = {};

    notifications.forEach((notification) => {
      if (!notification.action) {
        const timeoutId = setTimeout(() => {
          removeNotification(notification.id);
        }, 5000); // Adjust the duration as needed
        notificationTimeouts[notification.id] = timeoutId;
      }
    });

    return () => {
      // Clear timeouts on unmount
      Object.values(notificationTimeouts).forEach((timeoutId) =>
        clearTimeout(timeoutId)
      );
    };
  }, [notifications, removeNotification]);

  const notificationsWithAction = notifications.filter(
    (notification) => notification.action
  );
  const notificationsWithoutAction = notifications.filter(
    (notification) => !notification.action
  );

  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 70,
          right: 20,
          zIndex: 100,
        }}
      >
        {/* Notifications with actions */}
        {notificationsWithAction.map((notification) => (
          <View
            key={notification.id}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              padding: 16,
              marginVertical: 8,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Icon source={"bell"} size={20} color="white" />
            <View style={{ marginLeft: 8 }}>
              <Text
                style={{
                  color: "white",
                  marginBottom: 20,
                  fontSize: 20,
                }}
              >
                {notification.message}
              </Text>

              <Button
                mode="contained"
                contentStyle={{ backgroundColor: "white" }}
                labelStyle={{ color: colors.primary }}
                onPress={() => {
                  notification.action && notification.action();
                  removeNotification(notification.id);
                }}
              >
                {notification.buttonText}
              </Button>
            </View>

            <IconButton
              icon={"close"}
              size={20}
              onPress={() => removeNotification(notification.id)}
              iconColor="white"
              style={{ margin: 0 }}
            />
          </View>
        ))}
      </View>
      <View
        style={{
          position: "absolute",
          top: 110,
          zIndex: 100,
          justifyContent: "center",
          alignItems: "center",
          width,
        }}
      >
        {/* Notifications without actions */}
        {notificationsWithoutAction.map((notification) => (
          <View
            key={notification.id}
            style={{
              backgroundColor: colors.primary, // Adjust the color as needed
              borderRadius: 8,
              padding: 16,
              marginVertical: 8,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
            }}
          >
            <Text style={{ color: "white" }}>{notification.message}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

export default ToastNotification;
