import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native"
import React, { useCallback, useMemo, useRef, useState } from "react"
import ImageViewer from "react-native-image-zoom-viewer"
import { Ionicons } from "@expo/vector-icons"
import { normaliseW } from "../utils/normalize"
import { useTheme } from "react-native-paper"

type Props = {
  images: string[]
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const { width } = Dimensions.get("screen")

const ImageCarousel = ({ images }: Props) => {
  const { colors } = useTheme()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })
  const onViewRef = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<string>[] }) => {
      if (viewableItems.length > 0) {
        setActiveImageIndex(viewableItems[0].index ?? 0)
      }
    }
  )

  const imagesForViewer = useMemo(
    () => images.map((image) => ({ url: image })),
    [images]
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const renderFooter = (currentIndex: number) => (
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
  )

  return (
    <SafeAreaView>
      <FlatList
        data={images}
        renderItem={({ index, item }) => (
          <RenderItem
            index={index}
            item={item}
            setActiveImageIndex={setActiveImageIndex}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment={"center"}
        decelerationRate={"fast"}
        keyExtractor={(_, index) => index.toString()}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewRef.current}
      />
      <View style={styles.dotCont}>
        {images.map((_, index) => (
          <View
            style={[styles.dot, index === activeImageIndex && styles.activeDot]}
            key={index}
          />
        ))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => {
          handleCloseModal()
        }}
        style={styles.modalContainer}
      >
        <ImageViewer
          imageUrls={imagesForViewer}
          index={activeImageIndex}
          enableSwipeDown
          onSwipeDown={handleCloseModal}
          //   renderIndicator={() => null}
          onCancel={handleCloseModal}
          backgroundColor={colors.background}
          renderFooter={renderFooter}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 20,
            top: 20,
          }}
          onPress={handleCloseModal}
        >
          <Ionicons name="close" color={colors.onBackground} size={24} />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

export default ImageCarousel

type RenderProps = {
  setActiveImageIndex: (val: number) => void
  setIsModalOpen: (val: boolean) => void
  index: number
  item: string
}

const RenderItem = ({
  item,
  index,
  setActiveImageIndex,
  setIsModalOpen,
}: RenderProps) => {
  const handleImagePress = () => {
    setActiveImageIndex(index)
    setIsModalOpen(true)
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleImagePress}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image: {
    width: SCREEN_WIDTH,
    height: 550,
    resizeMode: "contain",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#eb9f40",
    margin: normaliseW(5),
  },
  activeDot: {
    backgroundColor: "#eb9f40",
  },
  dotCont: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  modalContainer: { justifyContent: "center", alignItems: "center" },
})
