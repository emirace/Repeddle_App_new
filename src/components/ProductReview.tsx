import { Pressable, ScrollView, StyleSheet, View } from "react-native"
import React, { useMemo } from "react"
import { IProduct, IReview } from "../types/product"
import { Ionicons } from "@expo/vector-icons"
import { Button, Text, useTheme } from "react-native-paper"
import Review from "./Review"
import { IUser } from "../types/user"
import { ProductNavigationProp } from "../types/navigation/stack"

type Props = {
  product: IProduct
  setModalProductReview: (val: boolean) => void
  reviews: IReview[]
  user: IUser | null
  navigation: ProductNavigationProp["navigation"]
}

const ProductReview = ({
  product,
  setModalProductReview,
  reviews,
  user,
  navigation,
}: Props) => {
  const { colors } = useTheme()
  const canReview = useMemo(
    () => user && product.buyers.includes(user._id),
    [product.buyers, user?._id]
  )

  const hasReviewed = useMemo(
    () => reviews.some((review) => review.user._id === user?._id),
    [reviews, user?._id]
  )

  return (
    <View style={styles.container}>
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <View style={styles.heading}>
          <Pressable onPress={() => setModalProductReview(false)}>
            <Ionicons name="close" size={24} color={colors.onBackground} />
          </Pressable>
          <Text style={[styles.modalTitle]}>Reviews</Text>
        </View>
        <ScrollView>
          {canReview && !hasReviewed && (
            <Button
              onPress={() =>
                navigation.navigate("WriteReview", {
                  slug: product.slug,
                  item: "product",
                })
              }
              mode="contained"
              style={{ borderRadius: 10, marginBottom: 10 }}
            >
              Write a review
            </Button>
          )}

          {product.reviews.length > 0 ? (
            product.reviews.map((item, index) => (
              <Review
                review={item}
                key={index}
                navigation={navigation}
                item="product"
                slug={product.slug}
              />
            ))
          ) : (
            <Text style={{ textAlign: "center" }}>
              There are no reviews yet
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default ProductReview

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 20,
    paddingTop: 80,
  },
  content: {
    borderRadius: 5,
    width: "90%",
    padding: 20,
    flex: 1,
  },
  modalTitle: { fontFamily: "absential-sans-bold", fontSize: 20 },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    alignItems: "center",
    marginBottom: 10,
  },
})
