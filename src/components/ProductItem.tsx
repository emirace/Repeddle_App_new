import {
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
import { IconButton, Text } from "react-native-paper"
import useAuth from "../hooks/useAuth"
import useProducts from "../hooks/useProducts"
import { baseURL } from "../services/api"
import useToastNotification from "../hooks/useToastNotification"

type Props = {
  navigate: (slug: string) => void
  product: IProduct
}

const ProductItem = ({ navigate, product: product1 }: Props) => {
  const {
    user,
    addToWishlist,
    error: wishlistError,
    removeFromWishlist,
  } = useAuth()
  const { likeProduct, unlikeProduct, error } = useProducts()
  const { addNotification } = useToastNotification()
  const [product, setProduct] = useState(product1)

  const [liking, setLiking] = useState(false)
  const [addToWish, setAddToWish] = useState(false)

  const liked = useMemo(() => {
    return !!product?.likes.find((like) => like === user?._id)
  }, [product?.likes, user?._id])

  const saved = useMemo(
    () => !!user?.wishlist.find((x) => x === product._id),
    [product, user]
  )

  const discount = () => {
    if (!product.costPrice) return null
    if (product.costPrice === product.sellingPrice) {
      return null
    }
    return (
      ((product.costPrice - product.sellingPrice) / product.costPrice) * 100
    )
  }

  const toggleLikes = async () => {
    if (!user) {
      addNotification({ message: "Sign in /  Sign Up to like" })
      return
    }

    if (!product) return

    if (product.seller._id === user._id) {
      addNotification({ message: "You can't like your product", error: true })
      return
    }

    setLiking(true)

    if (liked) {
      const res = await unlikeProduct(product._id)
      if (res) {
        const newProd = product
        newProd.likes = res.likes
        setProduct(newProd)
        addNotification({ message: res.message })
      } else addNotification({ message: error, error: true })
    } else {
      const res = await likeProduct(product._id)
      if (res) {
        const newProd = product
        newProd.likes = res.likes
        setProduct(newProd)
        addNotification({ message: res.message })
      } else addNotification({ message: error, error: true })
    }

    setLiking(false)
  }

  const saveItem = async () => {
    if (!product) return

    if (!user) {
      addNotification({
        message: "Sign In/ Sign Up to add an item to wishlist",
        error: true,
      })
      return
    }

    if (product.seller._id === user._id) {
      addNotification({
        message: "You can't add your product to wishlist",
        error: true,
      })
      return
    }

    setAddToWish(true)
    if (saved) {
      const res = await removeFromWishlist(product._id)
      if (res) addNotification({ message: res })
      else
        addNotification({
          message: wishlistError ?? "Failed to add to wishlist",
          error: true,
        })
    } else {
      const res = await addToWishlist(product._id)
      if (res) addNotification({ message: res })
      else
        addNotification({
          message: wishlistError ?? "Failed to add to wishlist",
          error: true,
        })
    }

    setAddToWish(false)
  }

  return (
    <Pressable
      onPress={() => navigate(product.slug)}
      style={[styles.container]}
    >
      <Image
        source={{ uri: baseURL + product.images[0] }}
        style={styles.image}
      />
      <TouchableOpacity
        style={styles.likeButton}
        onPress={toggleLikes}
        disabled={liking}
      >
        <IconButton
          icon={liked ? "thumb-up" : "thumb-up-outline"}
          iconColor={liked ? "red" : "white"}
          size={24}
          style={{ margin: 0 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wishlistButton}
        onPress={saveItem}
        disabled={addToWish}
      >
        <IconButton
          icon={saved ? "cards-heart" : "cards-heart-outline"}
          iconColor={saved ? lightTheme.colors.primary : "#fff"}
          size={24}
          style={{ margin: 0 }}
        />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>
        {product.sold ? (
          <View style={[styles.shades, { backgroundColor: "grey" }]}>
            <Text style={styles.shadesText}>SOLD</Text>
          </View>
        ) : discount() ? (
          <View style={styles.shades}>
            <Text style={styles.shadesText}>{discount()}% OFF</Text>
          </View>
        ) : null}
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
    // padding: 8,
    borderRadius: 50,
  },
  wishlistButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    // padding: 8,
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
