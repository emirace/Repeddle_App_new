import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useState } from "react"
import { WishlistNavigationProp } from "../types/navigation/stack"
import { IProduct } from "../types/product"
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  useTheme,
} from "react-native-paper"
import useCart from "../hooks/useCart"
import useToastNotification from "../hooks/useToastNotification"
import useAuth from "../hooks/useAuth"
import useProducts from "../hooks/useProducts"
import { Ionicons } from "@expo/vector-icons"
import { currency, region } from "../utils/common"
import SizeSelection from "./SizeSelection"
import { baseURL } from "../services/api"
import { lightTheme } from "../constant/theme"

type Props = {
  item: IProduct
  navigation: WishlistNavigationProp["navigation"]
  removeWish: (id: string) => void
}

const WishlistItem = ({ item, navigation, removeWish }: Props) => {
  const { colors } = useTheme()
  const { addToCart, cart } = useCart()
  const { addNotification } = useToastNotification()
  const { removeFromWishlist, user } = useAuth()
  const { fetchProductBySlug } = useProducts()

  const [removingFromWish, setRemovingFromWish] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedSize, setSelectSize] = useState("")
  const [showSize, setShowSize] = useState(false)
  const [size, setSize] = useState("")

  const discount = () => {
    if (!item.costPrice) return null
    if (item.costPrice === item.sellingPrice) {
      return null
    }
    return ((item.costPrice - item.sellingPrice) / item.costPrice) * 100
  }

  const sizeHandler = (itemSize: string) => {
    const current = item.sizes.filter((s) => s.size === itemSize)
    if (current.length > 0) {
      setSize(`${itemSize} ( ${current[0].quantity} left)`)
      setSelectSize(itemSize)
    } else {
      setSize("Out of stock")
      setSelectSize("")
    }
  }

  const onAddToCart = async () => {
    setAddingToCart(true)

    const existItem = cart.find((x) => x._id === item._id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    if (!selectedSize && item.sizes.length > 0) {
      addNotification({ message: "Select Size", error: true })
      if (!showSize) setShowSize(true)
      return
    }

    if (user && item.seller._id === user._id) {
      addNotification({ message: "You can't buy your product", error: true })
    }

    const data = await fetchProductBySlug(item.slug)
    if (!data?.countInStock || data?.countInStock < quantity) {
      addNotification({
        message: "Sorry. Product is out of stock",
        error: true,
      })
      return
    }

    addNotification({ message: "item added to cart" })

    addToCart({
      ...item,
      quantity,
      selectedSize,
      // selectedColor?: string;
    })

    setAddingToCart(false)
  }

  const onRemoveFromWish = async () => {
    setRemovingFromWish(true)

    const res = await removeFromWishlist(item._id)

    if (res) {
      addNotification({ message: res })
      removeWish(item._id)
    } else addNotification({ message: "Failed to remove item" })

    setRemovingFromWish(false)
    setShowRemove(false)
  }

  return (
    <>
      <TouchableOpacity
        style={styles.itemStyles}
        onPress={() => navigation.navigate("Product", { slug: item.slug })}
      >
        <View style={styles.itemImageCont}>
          <Image
            style={styles.itemImage}
            source={{ uri: baseURL + item.images[0] }}
            resizeMode="cover"
          />
          {item.sold || item.countInStock === 0 ? (
            <View style={[styles.shades, { backgroundColor: "gray" }]}>
              <Text style={styles.shadesText}>SOLD</Text>
            </View>
          ) : discount() ? (
            <View style={styles.shades}>
              <Text style={styles.shadesText}>{discount()}% OFF</Text>
            </View>
          ) : null}
        </View>
        <View style={{ rowGap: 6, flex: 1 }}>
          <Text style={styles.titleText}>{item.name}</Text>
          <Text>
            Review (<Ionicons name="star" color={colors.primary} />
            {item.rating})
          </Text>
          {item.costPrice && item.sellingPrice < item.costPrice ? (
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={[styles.titleText, styles.discount]}>
                {currency(region())} {item.costPrice}
              </Text>
              <Text style={styles.titleText}>
                {currency(region())}
                {item.sellingPrice}
              </Text>
            </View>
          ) : (
            <Text style={styles.titleText}>
              {currency(region())}
              {item.sellingPrice}
            </Text>
          )}

          <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
            <IconButton
              icon={"cart-outline"}
              mode="contained"
              onPress={onAddToCart}
              style={{
                borderRadius: 5,
                flex: 1,
              }}
              iconColor="white"
              containerColor={colors.primary}
              disabled={
                item.sold ||
                item.countInStock === 0 ||
                removingFromWish ||
                addingToCart
              }
              loading={addingToCart}
            />

            <IconButton
              mode="contained"
              icon={"trash-can-outline"}
              onPress={() => setShowRemove(true)}
              style={{
                borderRadius: 5,
                flex: 1,
              }}
              iconColor="white"
              containerColor={colors.secondary}
              disabled={removingFromWish || addingToCart}
            />
          </View>
        </View>
      </TouchableOpacity>
      <Portal>
        <Dialog
          visible={showSize}
          style={{ borderRadius: 5 }}
          onDismiss={() => setShowSize(false)}
        >
          <Dialog.Title>Select Size</Dialog.Title>
          <Dialog.Content style={{ borderRadius: 5, gap: 6 }}>
            <Text>{size}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {item.sizes.map(
                (size) =>
                  size.quantity > 0 && (
                    <SizeSelection
                      key={size.size}
                      selectedSize={selectedSize}
                      symbol={size.size}
                      sizeHandler={sizeHandler}
                    />
                  )
              )}

              <Pressable
                onPress={() => navigation.push("SizeChart")}
                style={{ marginLeft: 20 }}
              >
                <Text
                  style={{
                    textDecorationLine: "underline",
                  }}
                >
                  size chart{" "}
                </Text>
              </Pressable>
            </View>
          </Dialog.Content>
          <Dialog.Actions style={{ gap: 8 }}>
            <Button
              labelStyle={{ fontSize: 15 }}
              onPress={onAddToCart}
              loading={addingToCart}
              disabled={addingToCart}
            >
              Select
            </Button>
            <Button
              textColor={colors.secondary}
              labelStyle={{ fontSize: 15 }}
              disabled={addingToCart}
              onPress={() => setShowSize(false)}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          visible={showRemove}
          style={{ borderRadius: 5 }}
          onDismiss={() => setShowRemove(false)}
        >
          <Dialog.Title>Remove From Wishlist</Dialog.Title>
          <Dialog.Content style={{ borderRadius: 5, gap: 6 }}>
            <Text>Do you want to remove item from wishlist</Text>
          </Dialog.Content>
          <Dialog.Actions style={{ gap: 8 }}>
            <Button
              labelStyle={{ fontSize: 15 }}
              onPress={onRemoveFromWish}
              loading={removingFromWish}
              disabled={removingFromWish}
            >
              Yes
            </Button>
            <Button
              textColor={colors.secondary}
              labelStyle={{ fontSize: 15 }}
              disabled={removingFromWish}
              onPress={() => setShowRemove(false)}
            >
              No
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

export default WishlistItem

const styles = StyleSheet.create({
  itemStyles: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
  },
  itemImageCont: {
    position: "relative",
    height: "auto",
    aspectRatio: 0.9,
    borderRadius: 10,
    // overflow: "hidden",
  },
  itemImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  shades: {
    backgroundColor: lightTheme.colors.secondary,
    paddingHorizontal: 5,
    position: "absolute",
    bottom: 10,
    right: 0,
    zIndex: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  shadesText: {
    color: "white",
    fontSize: 11,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  discount: {
    textDecorationLine: "line-through",
    color: lightTheme.colors.secondary,
  },
})
