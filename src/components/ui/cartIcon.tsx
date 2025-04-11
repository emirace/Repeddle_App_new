import { Pressable, StyleSheet } from "react-native"
import React from "react"
import { Badge, IconButton, useTheme } from "react-native-paper"
import useCart from "../../hooks/useCart"

type Props = {
  onPress?: () => void
  iconColor?: string
}

const CartIcon = ({ onPress, iconColor }: Props) => {
  const { cart } = useCart()
  const { colors } = useTheme()

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <IconButton
        icon="cart-outline"
        iconColor={iconColor ?? colors.onBackground}
      />
      <Badge
        visible={cart.length > 0}
        style={styles.badge}
        theme={{ colors: { background: "red" } }}
      >
        {cart.length}
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
