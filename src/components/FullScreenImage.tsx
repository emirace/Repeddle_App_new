import {
  Dimensions,
  Image,
  ImageStyle,
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useState } from "react"
import { baseURL } from "../services/api"
import { Ionicons } from "@expo/vector-icons"

type Props = {
  source: string
  style: StyleProp<ImageStyle>
  onDelete?: () => void
}

const { width, height } = Dimensions.get("window")

const FullScreenImage = ({ source, style, onDelete }: Props) => {
  const [modalVisible, setModalVisible] = useState(false)

  const handlePress = () => {
    setModalVisible(true)
  }

  const handleClose = () => {
    setModalVisible(false)
  }

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          position: "relative",
          width: (style as ImageStyle)?.width || styles.image.width,
        }}
      >
        <Image
          source={{ uri: `${baseURL}${source}` }}
          style={[styles.image, style]}
          resizeMode="contain"
        />
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={handleClose}
      >
        <TouchableOpacity style={styles.modal} onPress={handleClose}>
          <View>
            <Image
              source={{ uri: `${baseURL}${source}` }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

export default FullScreenImage

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
})
