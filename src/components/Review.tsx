import { Pressable, StyleSheet, View } from "react-native"
import React from "react"
import { IconButton, Text } from "react-native-paper"
import { FontAwesome } from "@expo/vector-icons"
import Rating from "./Rating"
import useAuth from "../hooks/useAuth"
import moment from "moment"
import { IReview as ReviewType } from "../types/product"
import { ProductNavigationProp } from "../types/navigation/stack"

type Base = {
  review: ReviewType
  navigation: ProductNavigationProp["navigation"]
}

type Props = Base &
  (
    | {
        item: "product"
        slug: string
      }
    | {
        item: "seller"
        username: string
      }
  )

// TODO: review
const Review = ({ review, navigation, ...props }: Props) => {
  const { user } = useAuth()

  const deleteReview = async (userId: string) => {
    console.log(userId)
  }

  return (
    <View style={styles.container}>
      <View style={styles.contain}>
        <View style={styles.iconContainer}>
          <Text style={styles.name}>@{review.user.username}</Text>
          <FontAwesome
            style={styles.icon}
            name={
              review.like
                ? "thumbs-up"
                : // : review.like === "no"
                  // ? "thumbs-down"
                  "smile-o"
            }
            color={
              review.like
                ? "#eb9f40"
                : // : review.like === "no"
                  // ? "red"
                  "grey"
            }
            size={18}
          />
        </View>
        {user?._id === review.user._id && (
          <Pressable
            onPress={() =>
              navigation.navigate("WriteReview", {
                ...review,
                ...props,
              })
            }
          >
            <IconButton icon="pencil-outline" style={styles.edit} />
          </Pressable>
        )}
      </View>
      <Rating rating={review.rating} caption=" "></Rating>
      <Text style={styles.comment}>{review.comment}</Text>
      <Text style={styles.createdAt}>{moment(review.createdAt).fromNow()}</Text>
      {/* {user?.role === "Admin" && (
        <Text style={styles.delete} onPress={() => deleteReview(review._id)}>
          delete
        </Text>
      )} */}
    </View>
  )
}

export default Review

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  contain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  edit: { padding: 0, margin: 0, height: 30, width: 30 },
  name: {
    fontFamily: "absential-sans-bold",
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  createdAt: {
    color: "grey",
  },
  comment: {
    marginVertical: 10,
  },
  delete: {
    color: "red",
    cursor: "pointer",
  },
})
