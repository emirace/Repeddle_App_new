import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native"
import React, { useEffect, useState } from "react"
import { normaliseH, normaliseW } from "../utils/normalize"
import { Button, IconButton, Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import MyButton from "./MyButton"
import { IComment, IProduct } from "../types/product"
import FullScreenImage from "./FullScreenImage"
import useAuth from "../hooks/useAuth"
import { useNavigation } from "@react-navigation/native"
import { ProductNavigationProp } from "../types/navigation/stack"
import Comment from "./Comment"
import useProducts from "../hooks/useProducts"
import useToastNotification from "../hooks/useToastNotification"
import { uploadOptimizeImage } from "../utils/image"
import { deleteImage } from "../utils/common"

type Props = {
  comments?: IComment[]
  product: IProduct
  setProduct: (val: IProduct) => void
}

const CommentSection = ({ product, setProduct }: Props) => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { commentProduct, error } = useProducts()
  const { addNotification } = useToastNotification()

  const { push } = useNavigation<ProductNavigationProp["navigation"]>()

  const [modalVisible, setModalVisible] = useState(false)
  const [comments, setComments] = useState<IComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [image, setImage] = useState("")
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loadingCreateReview, setLoadingCreateReview] = useState(false)

  const pickImage = async () => {
    try {
      setLoadingUpload(true)

      const res = await uploadOptimizeImage()
      setImage(res as string)
    } catch (error: any) {
      addNotification({
        message: error || "Unable to upload image try again later",
        error: true,
      })
    } finally {
      setLoadingUpload(false)
    }
  }

  const onDeleteImage = async () => {
    if (!image) return
    setLoadingUpload(true)
    try {
      setLoadingUpload(true)
      const imageName = image.split("/").pop()
      if (imageName) {
        const res = await deleteImage(imageName)
        addNotification({ message: res })
        setImage("")
      }
    } catch (error) {
      addNotification({ message: "Failed to delete image", error: true })
    }
    setLoadingUpload(false)
  }

  useEffect(() => {
    const sortedComments = product.comments?.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    setComments(sortedComments || [])
  }, [product])

  const submitCommentHandler = async () => {
    if (!newComment) {
      addNotification({ message: "Enter a comment", error: true })
      return
    }
    setLoadingCreateReview(true)

    const res = await commentProduct(product._id, {
      comment: newComment,
      image,
    })

    if (res) {
      const newProd = product
      newProd.comments = [...(newProd.comments || []), res.comment]
      const sortedComments = newProd.comments?.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      newProd.comments = sortedComments || []
      setProduct(newProd)
      setComments(sortedComments)

      addNotification({ message: "Comment added to product" })
      setNewComment("")
      setImage("")
      setModalVisible(false)
    } else addNotification({ message: error, error: true })

    setLoadingCreateReview(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCont}>
        <Text style={styles.header}>Comments</Text>
      </View>
      <View>
        {comments.map((item, index) => (
          <Comment
            product={product}
            setProduct={setProduct}
            comment={item}
            key={index}
          />
        ))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={[styles.centeredView]}>
          <View
            style={[styles.modalView, { backgroundColor: colors.background }]}
          >
            <View style={styles.heading}>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons name="close" size={18} color={colors.onBackground} />
              </Pressable>
              <Text style={[styles.modalTitle]}>Write Comment</Text>
            </View>
            <TextInput
              style={[
                styles.textarea,
                {
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                  width: "100%",
                  minHeight: 60,
                },
              ]}
              multiline={true}
              placeholder="Write a comment"
              placeholderTextColor={colors.onBackground}
              numberOfLines={10}
              onChangeText={(text) => setNewComment(text)}
              value={newComment}
              textAlignVertical="top"
            />
            {image && (
              <FullScreenImage
                source={image}
                style={{ height: 100 }}
                onDelete={onDeleteImage}
              />
            )}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconButton
                onPress={pickImage}
                icon="file-image-plus-outline"
                loading={loadingUpload}
              />

              <Button
                children="Submit"
                mode="contained"
                disabled={loadingCreateReview}
                onPress={submitCommentHandler}
                loading={loadingCreateReview}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
      {user ? (
        <Button
          mode="contained"
          onPress={() => setModalVisible(!modalVisible)}
          style={{ borderRadius: 5 }}
        >
          Write comment
        </Button>
      ) : (
        <View style={{ alignItems: "center", marginVertical: 5 }}>
          <Text>
            Please{" "}
            <Text
              style={{ color: colors.secondary }}
              onPress={() => push("Auth")}
            >
              Sign in
            </Text>{" "}
            to write a comment
          </Text>
        </View>
      )}
    </View>
  )
}

export default CommentSection

const styles = StyleSheet.create({
  container: { marginHorizontal: 10, marginBottom: 20 },
  headerCont: { marginBottom: 20 },
  header: {
    fontFamily: "absential-sans-bold",
    fontSize: 20,
    lineHeight: 25,
  },
  button: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontFamily: "chronicle-text-bold" },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    paddingVertical: normaliseH(20),
    paddingHorizontal: normaliseW(20),
    borderRadius: 5,
    width: Dimensions.get("screen").width * 0.9,
  },
  modalTitle: { fontFamily: "absential-sans-bold", fontSize: 20 },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    alignItems: "center",
  },
  textarea: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: normaliseH(20),
    padding: 6,
  },
  addimage: {
    // borderWidth: 1,
    // borderRadius: 5,
    // padding: 5,
    // margin: 5,
    // width: 100,
    // alignItems: "center",
  },
})
