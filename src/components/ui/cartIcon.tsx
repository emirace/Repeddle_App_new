import { StyleSheet, View } from "react-native"
import React from "react"
import { Badge, useTheme } from "react-native-paper"
import useCart from "../../hooks/useCart"
import { MaterialCommunityIcons } from "@expo/vector-icons"

type Props = {}

const cartIcon = (props: Props) => {
  const { cart } = useCart()
  const { colors } = useTheme()

  return (
    <View style={styles.item}>
      <MaterialCommunityIcons
        name="cart-outline"
        size={24}
        style={{ padding: 0 }}
        color={colors.onBackground}
      />
      <Badge
        visible={cart.length > 0}
        style={styles.badge}
        theme={{ colors: { background: "red" } }}
      >
        {cart.length}
      </Badge>
    </View>
  )
}

export default cartIcon

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 4,
    right: 0,
  },
  item: {
    position: "relative",
  },
})
