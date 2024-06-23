import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useMemo, useState } from "react"
import { IProduct } from "../types/product"
import { FontAwesome } from "@expo/vector-icons"
import { IUser } from "../types/user"
import { currency } from "../utils/common"
import { lightTheme } from "../constant/theme"
import { Text } from "react-native-paper"
import useAuth from "../hooks/useAuth"
import useProducts from "../hooks/useProducts"

type Props = {
  navigate: (slug: string) => void
  product: IProduct
}

const ProductItem = ({ navigate, product }: Props) => {
  const { user, addToWishlist, error: wishlistError } = useAuth()
  const { likeProduct, unlikeProduct, error } = useProducts()

  const [liking, setLiking] = useState(false)
  const [addToWish, setAddToWish] = useState(false)

  const liked = useMemo(() => {
    return !!product?.likes.find((like) => like === user?._id)
  }, [product?.likes, user?._id])
  const saved = useMemo(
    () => user && user.wishlist.find((x) => x === product._id),
    [product, user]
  )

  const discount = () => {
    return (
      ((product.sellingPrice - (product.costPrice ?? 0)) /
        product.sellingPrice) *
      100
    )
  }

  const toggleLikes = async () => {
    if (!user) {
      // TODO: add notification
      Alert.alert("Sign in /  Sign Up to like")
      return
    }

    if (!product) return

    if (product.seller._id === user._id) {
      // TODO: add notification
      Alert.alert("You can't like your product")
      return
    }

    setLiking(true)

    if (liked) {
      const res = await unlikeProduct(product._id)
      if (res)
        // TODO: add notification
        Alert.alert(res.message)
      // TODO: add notification
      else Alert.alert(error)
    } else {
      const res = await likeProduct(product._id)
      if (res)
        // TODO: add notification
        Alert.alert(res.message)
      // TODO: add notification
      else Alert.alert(error)
    }

    setLiking(false)
  }

  const saveItem = async () => {
    if (!product) return

    if (!user) {
      // TODO: add notification
      Alert.alert("Sign In/ Sign Up to add an item to wishlist")
      return
    }

    if (product.seller._id === user._id) {
      // TODO: add notification
      Alert.alert("You can't add your product to wishlist")
      return
    }

    setAddToWish(true)

    const res = await addToWishlist(product._id)
    if (res)
      // TODO: add notification
      Alert.alert(res)
    // TODO: add notification
    else Alert.alert(wishlistError ?? "Failed to add to wishlist")

    setAddToWish(false)
  }

  return (
    <Pressable
      onPress={() => navigate(product.slug)}
      style={[styles.container]}
    >
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <TouchableOpacity
        style={styles.likeButton}
        onPress={toggleLikes}
        disabled={liking}
      >
        <FontAwesome
          name={liked ? "thumbs-up" : "thumbs-o-up"}
          size={24}
          color={liked ? "red" : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wishlistButton}
        onPress={saveItem}
        disabled={addToWish}
      >
        <FontAwesome
          name={saved ? "heart" : "heart-o"}
          size={24}
          color={saved ? lightTheme.colors.primary : "#fff"}
        />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>
        {product.sold ? (
          <View style={[styles.shades, { backgroundColor: "grey" }]}>
            <Text style={styles.shadesText}>SOLD</Text>
          </View>
        ) : (
          <View style={styles.shades}>
            {discount() ? (
              <Text style={styles.shadesText}>{discount()}% Discount</Text>
            ) : null}
          </View>
        )}
        <Text numberOfLines={1} style={styles.name}>
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          {product.costPrice && (
            <Text style={styles.price}>
              {currency(product.region)}
              {product.costPrice}
            </Text>
          )}
          {product.sellingPrice !== product.costPrice ? (
            <Text style={styles.discountPrice}>
              {currency(product.region)}
              {product.sellingPrice}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  )
}

export default ProductItem

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    marginBottom: 16,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  likeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 8,
    borderRadius: 50,
  },
  wishlistButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 8,
    borderRadius: 50,
  },
  detailsContainer: {
    paddingVertical: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 16,
    marginRight: 8,
  },
  discountPrice: {
    fontSize: 16,
    color: lightTheme.colors.primary,
    textDecorationLine: "line-through",
  },
  shades: {
    backgroundColor: lightTheme.colors.secondary,
    paddingHorizontal: 5,
    position: "absolute",
    top: -30,
    right: 0,
    zIndex: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  shadesText: {
    color: "white",
    fontSize: 11,
  },
})
