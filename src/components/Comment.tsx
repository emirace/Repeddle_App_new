import {
  Button,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useState } from "react"
import { normaliseH, normaliseW } from "../utils/normalize"
import { Ionicons } from "@expo/vector-icons"
import { Text, useTheme } from "react-native-paper"
import moment from "moment"
import FullScreenImage from "./FullScreenImage"
import useAuth from "../hooks/useAuth"

type Props = {}

const Comment = (props: Props) => {
  const { user } = useAuth()
  const { colors } = useTheme()

  const [comment, setComment] = useState(comment1)
  const [replyArea, setReplyArea] = useState(false)
  const [reply, setReply] = useState("")

  //   TODO:
  const likeComment = async (id: string) => {}

  const likeReplyHandler = async (reply: string) => {}

  const submitReplyHandler = async () => {}

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
          <Image source={{ uri: comment.userImage }} style={styles.image} />

          <View style={styles.content}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.username]}>{comment.name}</Text>
              <Text style={styles.time}>
                {moment(comment.createdAt).fromNow()}
              </Text>
            </View>
            <Text>{comment.comment}</Text>
            {comment.image ? (
              <FullScreenImage
                source={comment.image}
                style={styles.commentImage}
              />
            ) : null}
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
              <TouchableOpacity onPress={() => likeComment(comment._id)}>
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
            <View key={r.id} style={styles.subCont}>
              <Image source={{ uri: r.userImage }} style={styles.smallImage} />
              <View style={styles.content}>
                <View style={styles.top}>
                  <Text style={styles.name}>{r.name}</Text>
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
