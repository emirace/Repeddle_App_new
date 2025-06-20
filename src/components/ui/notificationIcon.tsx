import { Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Badge, IconButton, useTheme } from "react-native-paper";
import useNotification from "../../hooks/useNotification";

type Props = {
  onPress?: () => void;
  iconColor?: string;
};

const NotificationIcon = ({ onPress, iconColor }: Props) => {
  const { notifications, fetchNotifications } = useNotification();
  const { colors } = useTheme();

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <IconButton
        icon="bell-outline"
        iconColor={iconColor ?? colors.onBackground}
      />
      <Badge
        visible={unreadNotifications.length > 0}
        style={styles.badge}
        theme={{ colors: { background: colors.primary } }}
      >
        {unreadNotifications.length}
      </Badge>
    </Pressable>
  );
};

export default NotificationIcon;

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 4,
    right: 0,
  },
  item: {
    position: "relative",
    // marginLeft: "auto",
  },
});
