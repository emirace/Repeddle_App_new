import React, { useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import moment from "moment"
import useNotification from "../hooks/useNotification"
import { baseURL } from "../services/api"
import { Notification } from "../types/conversation"
import { NotificationNavigationProp } from "../types/navigation/stack"
import { Appbar, useTheme } from "react-native-paper"

const MobileNotification: React.FC<NotificationNavigationProp> = ({
  navigation,
}) => {
  const { colors } = useTheme()
  const { fetchNotifications, notifications, markNotification, loading } =
    useNotification()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleOnClick = (not: any) => {
    console.log(not)
    markNotification(not._id)
    if (not.mobileLink) {
      console.log("Mobile Link", not.mobileLink);
      navigation.navigate(not.mobileLink.name, {
        ...not.mobileLink.params,
      })
    }
  }

  const RenderItem = ({ item: not }: { item: Notification }) => {
    const { colors } = useTheme()
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { backgroundColor: colors.elevation.level2 },
        ]}
        onPress={() => handleOnClick(not)}
      >
        <Image source={{ uri: baseURL + not.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.message,
              { color: colors.onBackground, marginBottom: 4 },
            ]}
          >
            {not.message}
          </Text>
          <Text style={styles.time}>{moment(not.createdAt).fromNow()}</Text>
        </View>
        {!not.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    )
  }

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
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotification}>No Notification</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <RenderItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 15 }}
        />
      )}
    </View>
  )
}

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
})

export default MobileNotification
