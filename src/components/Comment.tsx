import {
  Alert,
  Button,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useMemo, useState } from "react"
import { normaliseH, normaliseW } from "../utils/normalize"
import { Ionicons } from "@expo/vector-icons"
import { Text, useTheme } from "react-native-paper"
import moment from "moment"
import FullScreenImage from "./FullScreenImage"
import useAuth from "../hooks/useAuth"
import useProducts from "../hooks/useProducts"
import { IComment, ICommentReply, IProduct } from "../types/product"

type Props = {
  comment: IComment
  product: IProduct
  setProduct: (val: IProduct) => void
}

const Comment = ({ comment, product, setProduct }: Props) => {
  const { user } = useAuth()
  const {
    likeProductComment,
    unlikeProductComment,
    replyProductComment,
    likeProductCommentReply,
    unlikeProductCommentReply,
    error,
  } = useProducts()
  const { colors } = useTheme()

  const [replyArea, setReplyArea] = useState(false)
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)

  const liked = useMemo(
    () => !!comment.likes.find((like) => like === user?._id),
    [comment.likes, user?._id]
  )

  const likeComment = async () => {
    if (!user) return

    if (comment.userId._id === user._id) {
      // TODO: add notification
      Alert.alert("You can't like your comment")
      return
    }

    setLoading(true)

    if (liked) {
      const res = await unlikeProductComment(product._id, comment._id)

      if (res) {
        const newProd = product
        newProd.comments = newProd.comments?.map((com) =>
          com._id === res.comment._id ? res.comment : com
        )
        setProduct(newProd)
        // TODO: add notification
        Alert.alert(res.message)
      } // TODO: add notification
      else Alert.alert(error)
    } else {
      const res = await likeProductComment(product._id, comment._id)

      if (res) {
        const newProd = product
        newProd.comments = newProd.comments?.map((com) =>
          com._id === res.comment._id ? res.comment : com
        )
        setProduct(newProd)
        // TODO: add notification
        Alert.alert(res.message)
      } // TODO: add notification
      else Alert.alert(error)
    }

    setLoading(false)
  }

  const likeReplyHandler = async (reply: ICommentReply) => {
    if (!user) return

    if (reply.userId._id === user._id) {
      // TODO: add notification
      Alert.alert("You can't like your reply")
      return
    }

    setLoading(true)

    if (reply.likes.find((x) => x === user._id)) {
      const res = await unlikeProductCommentReply(
        product._id,
        comment._id,
        reply._id
      )

      if (res) {
        const newProd = product
        newProd.comments = newProd.comments?.map((com) => {
          if (com._id === comment._id) {
            const newComment = com
            com.replies = com.replies.map((rep) =>
              rep._id === res.reply._id ? res.reply : rep
            )
            return newComment
          }
          return com
        })
        setProduct(newProd)
        // TODO: add notification
        Alert.alert(res.message)
      } // TODO: add notification
      else Alert.alert(error)
    } else {
      const res = await likeProductCommentReply(
        product._id,
        comment._id,
        reply._id
      )

      if (res) {
        const newProd = product
        newProd.comments = newProd.comments?.map((com) => {
          if (com._id === comment._id) {
            const newComment = com
            com.replies = com.replies.map((rep) =>
              rep._id === res.reply._id ? res.reply : rep
            )
            return newComment
          }
          return com
        })
        setProduct(newProd)
        // TODO: add notification
        Alert.alert(res.message)
      } // TODO: add notification
      else Alert.alert(error)
    }

    setLoading(false)
  }

  const submitReplyHandler = async () => {
    if (!reply) {
      // TODO: add notification
      Alert.alert("Enter a reply")
      return
    }

    setLoading(true)

    const res = await replyProductComment(product._id, comment._id, reply)

    if (res) {
      const newProd = product
      newProd.comments = newProd.comments?.map((com) => {
        if (com._id === comment._id) {
          const newComment = com
          com.replies = [...com.replies, res.comment]
          return newComment
        }
        return com
      })
      setProduct(newProd)
      setReply("")
    } // TODO: add notification
    else Alert.alert(error)

    setLoading(false)
  }

  return (
    <>
      <View
        style={[
          styles.container,
          {
            borderLeftColor: colors.outline,
          },
        ]}
      >
        <View
          style={[
            styles.imageCont,
            {
              backgroundColor: colors.primary,
            },
          ]}
        ></View>
        <View style={styles.row}>
          <Image source={{ uri: comment.userId.image }} style={styles.image} />

          <View style={styles.content}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.username]}>{comment.userId.username}</Text>
              <Text style={styles.time}>
                {moment(comment.createdAt).fromNow()}
              </Text>
            </View>
            <Text>{comment.comment}</Text>
            {/* TODO: comment image  */}
            {/* {comment.image ? (
              <FullScreenImage
                source={comment.image}
                style={styles.commentImage}
              />
            ) : null} */}
            <View style={styles.row}>
              <Text
                style={{
                  marginRight: normaliseW(20),
                  textDecorationLine: "underline",
                }}
                onPress={() => setReplyArea(!replyArea)}
              >
                {comment.replies.length} Reply
              </Text>
              <Text style={{ marginRight: normaliseW(20) }}>
                {comment.likes.length} Like
              </Text>
              <TouchableOpacity onPress={() => likeComment()}>
                {user && comment.likes.find((x) => x === user._id) ? (
                  <Ionicons name={"heart"} size={20} color={colors.primary} />
                ) : (
                  <Ionicons
                    name={"heart-outline"}
                    size={20}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {replyArea && (
        <>
          {comment.replies.map((r) => (
            <View key={r._id} style={styles.subCont}>
              <Image
                source={{ uri: r.userId.image }}
                style={styles.smallImage}
              />
              <View style={styles.content}>
                <View style={styles.top}>
                  <Text style={styles.name}>{r.userId.username}</Text>
                  <Text style={styles.time}>
                    {moment(r.createdAt).fromNow()}
                  </Text>
                </View>
                <Text style={styles.commentText}>{r.comment}</Text>
                <View style={styles.action}>
                  <Text style={styles.like}>{r.likes.length} like</Text>
                  <TouchableOpacity onPress={() => likeReplyHandler(r)}>
                    <Ionicons
                      name={
                        r.likes.find((x) => x === user?._id)
                          ? "heart"
                          : "heart-outline"
                      }
                      size={15}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.formContainer}>
            <TextInput
              style={[styles.textInput, { color: colors.onBackground }]}
              placeholder="Leave a reply here"
              value={reply}
              onChangeText={setReply}
            />
            <Button
              title="Submit"
              color={colors.primary}
              onPress={submitReplyHandler}
              disabled={loading}
            />
          </View>
        </>
      )}
    </>
  )
}

export default Comment

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 1,
    paddingHorizontal: normaliseW(30),
    paddingBottom: normaliseH(20),
  },
  imageCont: {
    width: 2,
    height: 47,
    position: "absolute",
    top: -7,
    left: -1,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: normaliseW(20),
    borderLeftWidth: 5,
  },
  row: { flexDirection: "row" },
  username: { fontWeight: "bold" },
  commentImage: { width: "100%", height: 100, marginVertical: 10 },
  formContainer: {
    margin: 10,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
  },
  like: {
    marginRight: 10,
  },
  subCont: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 40,
  },
  smallImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  top: {
    flexDirection: "row",
  },
  name: {
    fontWeight: "bold",
  },
  time: {
    color: "grey",
    marginLeft: 10,
  },
  commentText: {},
})
