import { Pressable, ScrollView, StyleSheet, View } from "react-native"
import React from "react"
import { IProduct } from "../types/product"
import { Ionicons } from "@expo/vector-icons"
import { Text, useTheme } from "react-native-paper"
import Review from "./Review"

type Props = {
  product: IProduct
  setModalProductReview: (val: boolean) => void
}

const ProductReview = ({ product, setModalProductReview }: Props) => {
  const { colors } = useTheme()

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
          {product.reviews.length > 0 ? (
            product.reviews.map((item, index) => (
              <Review review={item} key={index} />
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
