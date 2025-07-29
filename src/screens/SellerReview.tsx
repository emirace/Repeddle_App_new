import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useMemo, useState } from "react"
import { Appbar, Button, Text, useTheme } from "react-native-paper"
import { FontAwesome } from "@expo/vector-icons"
import Rating from "../components/Rating"
import moment from "moment"
import { IReview } from "../types/product"
import { SellerReviewNavigationProp } from "../types/navigation/stack"
import useToastNotification from "../hooks/useToastNotification"
import useAuth from "../hooks/useAuth"
import useUser from "../hooks/useUser"
import Loader from "../components/ui/Loader"
import { useIsFocused } from "@react-navigation/native"
import { UserByUsername } from "../types/user"

type Props = SellerReviewNavigationProp

const SellerReview = ({ navigation, route: { params } }: Props) => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { getUserByUsername } = useUser()
  const { addNotification } = useToastNotification()
  const [reviews, setReviews] = useState<IReview[]>([])
  const [seller, setSeller] = useState<UserByUsername["user"] | null>(null)
  const [loading, setLoading] = useState(true)

  const isFocused = useIsFocused()

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getUserByUsername(params.username)
      if (typeof res !== "string") {
        setReviews(res.user.reviews || [])
        setSeller(res.user)
      } else {
        addNotification({ message: res, error: true })
      }
      setLoading(false)
    }
    fetchReviews()
  }, [isFocused])

  const canReview = useMemo(
    () => user?._id && seller?.buyers?.includes(user?._id),
    [seller, user?._id]
  )

  const hasReviewed = useMemo(
    () => reviews.some((review) => review.user._id === user?._id),
    [reviews, user?._id]
  )

  return loading ? (
    <Loader />
  ) : (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Reviews" />
      </Appbar.Header>
      {user?.username !== params.username && canReview && !hasReviewed && (
        <Button
          onPress={() =>
            navigation.navigate("WriteReview", {
              username: params.username,
              item: "seller",
            })
          }
          mode="contained"
          style={{ borderRadius: 10, margin: 10 }}
        >
          Write a review
        </Button>
      )}
      {!reviews.length && (
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "row",
            marginVertical: 15,
          }}
        >
          <Text>There are no reviews yet 📝</Text>
        </View>
      )}
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <ReviewItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item, index) => item._id.toString()}
        contentContainerStyle={styles.flatListContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

type ReviewProps = {
  navigation: SellerReviewNavigationProp["navigation"]
  item: IReview
}

const ReviewItem = ({ item, navigation }: ReviewProps) => {
  const { colors } = useTheme()
  const { addNotification } = useToastNotification()

  // const [replyVisible, setReplyVisible] = useState(false)
  // const [replyText, setReplyText] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentReview, setCurrentReview] = useState(item)

  // const handleReply = () => {
  //   setReplyVisible(true)
  // }

  // const handleReplySubmit = async () => {
  //   if (!replyText) {
  //     addNotification({ message: "Enter a reply", error: true })
  //     return
  //   }
  //   setLoading(true)

  //   setReplyText("")
  //   setReplyVisible(false)
  //   addNotification({ message: "Reply submitted successfully" })

  //   setLoading(false)
  // }

  return (
    <View style={styles.reviewContainer}>
      <Pressable
        style={styles.reviewerInfoContainer}
        onPress={() =>
          navigation.push("MyAccount", {
            username: currentReview.user._id,
          })
        }
      >
        <Image
          source={{ uri: currentReview?.user?.image }}
          style={styles.reviewerImage}
        />
        <View style={styles.reviewerInfo}>
          <Text style={[styles.reviewerName, { color: colors.secondary }]}>
            {currentReview.user?.username}
          </Text>
          <Text style={styles.reviewTime}>
            {moment(currentReview.createdAt).fromNow()}
          </Text>
        </View>
      </Pressable>
      <View style={styles.reviewContent}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Rating rating={currentReview.rating} caption=" " />
          <FontAwesome
            style={styles.icon}
            name={
              currentReview.like
                ? "thumbs-up"
                : currentReview.like
                ? "thumbs-down"
                : "smile-o"
            }
            color={
              currentReview.like
                ? "#eb9f40"
                : currentReview.like
                ? "red"
                : "grey"
            }
            size={18}
          />
        </View>
        <Text style={styles.reviewText}>{currentReview.comment}</Text>
        {currentReview?.user && (
          <View
            style={[
              styles.sellerReplyContainer,
              { backgroundColor: colors.elevation.level2 },
            ]}
          >
            <Pressable
              style={styles.sellerContainer}
              onPress={() =>
                navigation.push("MyAccount", {
                  username: currentReview.user._id,
                })
              }
            >
              <Image
                source={{ uri: currentReview?.user?.image }}
                style={styles.sellerImage}
              />
              <Text style={[styles.sellerNanme, { color: colors.secondary }]}>
                {currentReview.user.username}
              </Text>
            </Pressable>
            <Text style={[styles.sellerReplyText]}>
              {currentReview.comment}
            </Text>
          </View>
        )}
        {/* {!replyVisible && !currentReview.comment && (
          <TouchableOpacity
            style={[styles.replyButton, { backgroundColor: colors.primary }]}
            onPress={handleReply}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        )}
        {replyVisible && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={[
                styles.replyInput,
                { backgroundColor: colors.elevation.level2 },
              ]}
              placeholder="Type your reply"
              placeholderTextColor="grey"
              onChangeText={(text) => setReplyText(text)}
              value={replyText}
              multiline
            />
            <Button
              onPress={handleReplySubmit}
              children="Proceed"
              loading={loading}
              mode="contained"
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              labelStyle={styles.submitButtonText}
            />
          </View>
        )} */}
      </View>
    </View>
  )
}

export default SellerReview

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContentContainer: {
    paddingBottom: 20,
  },
  reviewContainer: {
    marginBottom: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  reviewerInfoContainer: {
    // flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 5,
  },
  sellerImage: {
    width: 20,
    height: 20,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 5,
  },
  reviewerInfo: {
    alignItems: "center",
    // flex: 1,
  },
  reviewerName: {
    fontFamily: "absential-sans-bold",
    fontSize: 16,

    // marginBottom: 4,
  },
  reviewTime: {
    fontSize: 12,
    color: "#999999",
  },
  reviewContent: {
    flex: 1,
    marginLeft: 16,
  },
  reviewRating: {
    fontFamily: "chronicle-text-bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 8,
  },
  sellerReplyContainer: {
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  sellerContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 3,
  },
  sellerNanme: { fontSize: 12 },
  sellerReplyText: {
    fontSize: 14,
    color: "white",
  },
  replyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  replyButtonText: {
    color: "#FFFFFF",
    fontFamily: "chronicle-text-bold",
    fontSize: 14,
  },
  replyInputContainer: {
    marginTop: 10,
  },
  replyInput: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    maxHeight: 100,
    width: "100%",
  },
  submitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontFamily: "chronicle-text-bold",
    fontSize: 14,
  },
  icon: {
    marginLeft: 20,
  },
})
