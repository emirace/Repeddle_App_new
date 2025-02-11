import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useCallback, useState } from "react"
import { Appbar, useTheme } from "react-native-paper"
import ImageViewer from "react-native-image-zoom-viewer"
import { Ionicons } from "@expo/vector-icons"
import { SizeChartNavigationProp } from "../types/navigation/stack"
import CartIcon from "../components/ui/cartIcon"

type Props = SizeChartNavigationProp

const images = [
  "https://res.cloudinary.com/emirace/image/upload/v1686288037/repeddleSize1_ljby28.jpg",
  "https://res.cloudinary.com/emirace/image/upload/v1686288037/repeddleSize2_zgalrb.jpg",
  "https://res.cloudinary.com/emirace/image/upload/v1686288037/repeddleSize3_xspu24.jpg",
  "https://res.cloudinary.com/emirace/image/upload/v1686288037/repeddleSize4_gzjjoi.jpg",
]

const { width } = Dimensions.get("screen")
const { width: SCREEN_WIDTH } = Dimensions.get("window")

const SizeChart = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleImagePress = useCallback((index: number) => {
    setActiveImageIndex(index)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleImagePress(index)}
      >
        <Image source={{ uri: item }} style={styles.image} />
      </TouchableOpacity>
    ),
    []
  )

  const renderFooter = useCallback(
    (currentIndex: number) => (
      <View
        style={{
          justifyContent: "center",
          marginBottom: 20,
          width,
        }}
      >
        <View style={styles.dotCont}>
          {images.map((_, index) => (
            <View
              style={[styles.dot, index === currentIndex && styles.activeDot]}
              key={index}
            />
          ))}
        </View>
      </View>
    ),
    []
  )

  const imagesForViewer = images.map((image) => ({ url: image }))
  const renderImage = (props: any) => {
    return <Image {...props} style={styles.image} />
  }

  return (
    <View style={styles.container}>
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
        <Appbar.Content title="Size Chart" titleStyle={{ color: "white" }} />
        <Appbar.Content
          style={{ flex: 0 }}
          title={
            <View>
              <CartIcon
                iconColor="white"
                onPress={() => navigation.push("Cart")}
              />
            </View>
          }
        />
      </Appbar.Header>

      <FlatList
        data={images}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={handleCloseModal}
        style={styles.modalContainer}
      >
        <ImageViewer
          imageUrls={imagesForViewer}
          index={activeImageIndex}
          enableSwipeDown
          onSwipeDown={handleCloseModal}
          renderImage={renderImage}
          //   renderIndicator={() => null}
          onCancel={handleCloseModal}
          backgroundColor={colors.onBackground}
          renderFooter={renderFooter}
        />
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
          <Ionicons name="close" color={colors.onBackground} size={24} />
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default SizeChart

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontFamily: "absential-sans-bold",
    fontSize: 20,
    textTransform: "capitalize",
  },
  body: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  image: {
    width: SCREEN_WIDTH,
    flex: 1,
    height: "100%",
    minHeight: 450,
    resizeMode: "cover",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#eb9f40",
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#eb9f40",
  },
  dotCont: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
})
