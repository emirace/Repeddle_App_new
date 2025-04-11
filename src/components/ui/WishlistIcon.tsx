import { Pressable, StyleSheet } from "react-native"
import React from "react"
import { Badge, IconButton, useTheme } from "react-native-paper"
import useAuth from "../../hooks/useAuth"

type Props = {
  onPress?: () => void
  iconColor?: string
}

const WishlistIcon = ({ onPress, iconColor }: Props) => {
  const { user } = useAuth()
  const { colors } = useTheme()

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <IconButton
        icon="heart-outline"
        iconColor={iconColor ?? colors.background}
      />
      {user?.wishlist.length ? (
        <Badge
          visible={user?.wishlist && user.wishlist.length > 0}
          style={styles.badge}
          theme={{ colors: { background: "red" } }}
        >
          {user?.wishlist.length}
        </Badge>
      ) : null}
    </Pressable>
  )
}

export default WishlistIcon

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 4,
    right: 0,
  },
  item: {
    position: "relative",
    marginLeft: "auto",
  },
})
