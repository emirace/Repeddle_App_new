import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native"
import React, { useState } from "react"
import { normaliseH, normaliseW } from "../utils/normalize"
import { Button, IconButton, Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import MyButton from "./MyButton"
import { IComment, IProduct } from "../types/product"
import FullScreenImage from "./FullScreenImage"
import useAuth from "../hooks/useAuth"
import { useNavigation } from "@react-navigation/native"
import { ProductNavigationProp } from "../types/navigation/stack"
import * as ImagePicker from "expo-image-picker"
import { uploadImage } from "../utils/common"
import Comment from "./Comment"
import useProducts from "../hooks/useProducts"

type Props = {
  comments?: IComment[]
  product: IProduct
  setProduct: (val: IProduct) => void
}

const CommentSection = ({ product, setProduct, comments }: Props) => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { commentProduct, error } = useProducts()

  const { push } = useNavigation<ProductNavigationProp["navigation"]>()

  const [modalVisible, setModalVisible] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [image, setImage] = useState("")
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loadingCreateReview, setLoadingCreateReview] = useState(false)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      let localUri = result.assets[0].uri
      let filename = localUri.split("/").pop()
      if (!filename) return
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`

      uploadImageHandler({ uri: localUri, name: filename, type })
      console.log({ uri: localUri, name: filename, type })
    }
  }

  const uploadImageHandler = async (photo: any) => {
    const file = photo as File
    const bodyFormData = new FormData()
    bodyFormData.append("file", file)
    // setLoadingUpload(true)
    try {
      const res = await uploadImage(file)
      setImage(res)
    } catch (error) {
      //   // TODO: toast notification
      Alert.alert(error as string)
    }
  }

  const submitCommentHandler = async () => {
    if (!newComment) {
      // TODO: add notification
      Alert.alert("Enter a comment")
      return
    }
    setLoadingCreateReview(true)

    const res = await commentProduct(product._id, newComment)

    if (res) {
      const newProd = product
      newProd.comments = [...(newProd.comments ?? []), res.comment]
      setProduct(newProd)
      // TODO: add notification
      Alert.alert("Comment added to product")
      setModalVisible(false)
    } // TODO: add notification
    else Alert.alert(error)

    setLoadingCreateReview(false)
  }

  console.log(product.comments)

  return (
    <View style={styles.container}>
      <View style={styles.headerCont}>
        <Text style={styles.header}>Comments</Text>
      </View>
      <View>
        {product.comments &&
          product.comments
            .reverse()
            .map((item, index) => (
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
                },
              ]}
              multiline={true}
              placeholder="   write a comment"
              placeholderTextColor={colors.onBackground}
              numberOfLines={10}
              onChangeText={(text) => setNewComment(text)}
              value={newComment}
            />
            {image && (
              <FullScreenImage
                source={image}
                style={{ width: 100, height: 100 }}
              />
            )}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {loadingUpload ? (
                <ActivityIndicator />
              ) : (
                <Pressable style={styles.addimage} onPress={pickImage}>
                  <IconButton icon="file-image-plus-outline" />
                </Pressable>
              )}
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
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Text style={styles.buttonText}>Write comment</Text>
        </TouchableOpacity>
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
    fontWeight: "bold",
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
  buttonText: { color: "#fff", fontWeight: "bold" },
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
  modalTitle: { fontWeight: "bold", fontSize: 20 },
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
