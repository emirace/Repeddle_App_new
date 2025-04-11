import { Dimensions, PixelRatio, Platform } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
export const normaliseW = (size: number) => {
  const scale = SCREEN_WIDTH / 360
  const newSize = size * scale
  if (Platform.OS == "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize) - 2)
  }
}

export const normaliseH = (size: number) => {
  const scale = SCREEN_HEIGHT / 764
  const newSize = size * scale
  if (Platform.OS == "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize) - 2)
  }
}
