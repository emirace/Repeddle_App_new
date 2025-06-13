import { Pressable, StyleSheet } from "react-native"
import React, { useEffect } from "react"
import { Badge, IconButton, useTheme } from "react-native-paper"
import useCart from "../../hooks/useCart"
import useNotification from "../../hooks/useNotification"

type Props = {
  onPress?: () => void
  iconColor?: string
}

const CartIcon = ({ onPress, iconColor }: Props) => {
  const { cart } = useCart()
  const { colors } = useTheme()
  const { fetchNotifications, notifications } = useNotification()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadNotifications = notifications.filter((not) => !not.read)

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <IconButton icon="bell-outline" iconColor={colors.onBackground} />
      <Badge
        visible={unreadNotifications.length > 0}
        style={[styles.badge, { backgroundColor: colors.primary }]}
      >
        {unreadNotifications.length}
      </Badge>
    </Pressable>
  )
}

export default CartIcon

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
})
