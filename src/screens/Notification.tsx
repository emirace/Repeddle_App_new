import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import moment from "moment";
import useNotification from "../hooks/useNotification";
import { baseURL } from "../services/api";
import { Notification } from "../types/conversation";
import { NotificationNavigationProp } from "../types/navigation/stack";
import { Appbar, useTheme } from "react-native-paper";

const MobileNotification: React.FC<NotificationNavigationProp> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const { fetchNotifications, notifications } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOnClick = (not: any) => {
    navigation.navigate(not.link);
  };

  const renderItem = ({ item: not }: { item: Notification }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleOnClick(not)}
    >
      <Image source={{ uri: baseURL + not.user.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.message}>{not.message}</Text>
        <Text style={styles.time}>{moment(not.createdAt).fromNow()}</Text>
      </View>
      {!not.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Notifications" />
      </Appbar.Header>
      {notifications.length === 0 ? (
        <Text style={styles.noNotification}>No Notification</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noNotification: {
    textAlign: "center",
    marginTop: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  message: {
    fontSize: 14,
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#f57c00",
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    backgroundColor: "#f57c00",
    borderRadius: 5,
  },
});

export default MobileNotification;
