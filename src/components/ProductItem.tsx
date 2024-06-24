import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { IProduct } from "../types/product";
import { FontAwesome } from "@expo/vector-icons";
import { IUser } from "../types/user";
import { currency } from "../utils/common";
import { lightTheme } from "../constant/theme";
import { Text } from "react-native-paper";
import { baseURL } from "../services/api";

type Props = {
  navigate: (slug: string) => void;
  product: IProduct;
};

const ProductItem = ({ navigate, product }: Props) => {
  const [user, setUser] = useState<IUser | null>(null);

  const liked = useMemo(
    () => user && product.likes.find((x) => x === user._id),
    [product, user]
  );
  const saved = useMemo(
    () => user && user.wishlist.find((x) => x._id === product._id),
    [product, user]
  );

  const discount = () => {
    if (product.costPrice === product.sellingPrice) {
      return null;
    }
    return (
      ((product.costPrice - product.sellingPrice) / product.costPrice) * 100
    );
  };

  const toggleLikes = () => {};

  const saveItem = () => {};

  return (
    <Pressable
      onPress={() => navigate(product.slug)}
      style={[styles.container]}
    >
      <Image
        source={{ uri: baseURL + product.images[0] }}
        style={styles.image}
      />
      <TouchableOpacity style={styles.likeButton} onPress={toggleLikes}>
        <FontAwesome
          name={liked ? "thumbs-up" : "thumbs-o-up"}
          size={24}
          color={liked ? "red" : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.wishlistButton} onPress={saveItem}>
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
  );
};

export default ProductItem;

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
});
