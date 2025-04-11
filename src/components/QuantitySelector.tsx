import { StyleSheet, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { ActivityIndicator, Text, useTheme } from "react-native-paper"
import { CartItem } from "../contexts/CartContext"
import useCart from "../hooks/useCart"
import useProducts from "../hooks/useProducts"

type Props = {
  quantity: number
  item: CartItem
}

const QuantitySelector = ({ item, quantity }: Props) => {
  const { colors } = useTheme()
  const { addToCart, cart, removeFromCart } = useCart()
  const { fetchProductBySlug } = useProducts()

  const [addLoading, setAddLoading] = useState(false)

  const cartHandler = async (type: "add" | "subtract") => {
    setAddLoading(true)
    const data = await fetchProductBySlug(item.slug)
    if (!data) return removeFromCart(item._id)

    const existItem = cart.find((x) => x._id === item._id)

    if (!existItem) return

    const quantity =
      type === "add" ? existItem.quantity + 1 : existItem.quantity - 1

    if (quantity < 1) return removeFromCart(item._id)

    addToCart({ ...existItem, quantity })
    setAddLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greytext}>Qty</Text>
      <TouchableOpacity
        onPress={() => cartHandler("subtract")}
        style={[styles.button, { backgroundColor: colors.elevation.level2 }]}
        disabled={addLoading}
      >
        <Text style={[styles.text]}>-</Text>
      </TouchableOpacity>
      {addLoading ? (
        <ActivityIndicator size={15} />
      ) : (
        <Text style={[styles.text]}>{quantity}</Text>
      )}
      <TouchableOpacity
        onPress={() => cartHandler("add")}
        style={[styles.button, { backgroundColor: colors.elevation.level2 }]}
        disabled={addLoading}
      >
        <Text style={[styles.text]}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

export default QuantitySelector

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  greytext: {
    color: "grey",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#f3f3f3",
    borderRadius: 50,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  text: { fontSize: 18 },
})
