import { StyleSheet, TouchableOpacity, View } from "react-native"
import React, { useRef, useState } from "react"
import { Text, useTheme } from "react-native-paper"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { Ionicons } from "@expo/vector-icons"
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av"
import * as DocumentPicker from "expo-document-picker"

type Props = {
  setShowVideoModal: (val: boolean) => void
}

const VideoPickerComponent = ({ setShowVideoModal }: Props) => {
  const { colors } = useTheme()

  const [videoUri, setVideoUri] = useState("")

  const multiSliderRef = useRef<MultiSlider>(null) // Ref to the MultiSlider component
  const [videoDuration, setVideoDuration] = useState(5)

  const maxDistance = 30 // Maximum duration for optimized video (in seconds)
  const minDistance = 5 // Maximum duration for optimized video (in seconds)
  const [sliderValues, setSliderValues] = useState([0, minDistance])

  const trimAndCompressVideo = async () => {
    // const options = {
    //   startTime: 0, // Start time in milliseconds
    //   endTime: 10000, // End time in milliseconds
    //   quality: 'low', // Compression quality (low, medium, or high)
    //   saveToCameraRoll: true, // Save the trimmed and compressed video to the camera roll
    // };
    // try {
    //   const trimmedVideo = await Video.compress(videoUri, options);
    //   // setTrimmedVideoUri(trimmedVideo);
    // } catch (error) {
    //   console.error('Error trimming and compressing video:', error);
    // }
  }

  const handleVideoSelection = async () => {
    try {
      const pickerResult = await DocumentPicker.getDocumentAsync({
        type: "video/*",
      })

      if (pickerResult.canceled) {
        return
      }
      const selectedVideoUri = pickerResult.assets[0].uri

      setVideoUri(selectedVideoUri)
    } catch (error) {
      console.log("Video selection error: ", error)
    }
  }

  const handleSliderValuesChange = (values: number[]) => {
    const startValue = values[0]
    const endValue = values[1]

    if (!multiSliderRef.current) return

    // Calculate the current currentDistance between the start and end sliders
    const currentDistance = Math.abs(endValue - startValue)
    if (currentDistance > maxDistance) {
      // TODO: check
      if (startValue !== sliderValues[0]) {
        setSliderValues([startValue, startValue + maxDistance])
        // multiSliderRef.current.state.positionTwo =
        //   multiSliderRef.current.state.positionOne + maxDistance
      }

      if (endValue !== sliderValues[1]) {
        setSliderValues([endValue - maxDistance, endValue])
        // multiSliderRef.current.state.positionOne =
        //   multiSliderRef.current.state.positionTwo - maxDistance
      }
    } else {
      setSliderValues([startValue, endValue])
    }
  }

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !status.isBuffering && status.durationMillis) {
      const duration = status.durationMillis / 1000 // Convert to seconds
      setVideoDuration(duration)
    }
  }

  return (
    <View style={styles.overlay}>
      <View style={[styles.alert, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.cancelButton]}
          onPress={() => setShowVideoModal(false)}
        >
          <Ionicons name="close" size={20} color={colors.onBackground} />
        </TouchableOpacity>
        {videoUri ? (
          <>
            <Video
              source={{ uri: videoUri }}
              style={{ width: 300, height: 300, margin: 10 }}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />

            <MultiSlider
              ref={multiSliderRef}
              values={sliderValues}
              min={0}
              max={videoDuration}
              step={1}
              sliderLength={videoDuration}
              onValuesChange={handleSliderValuesChange}
              selectedStyle={{ backgroundColor: "#000000" }}
            />
            <TouchableOpacity
              style={[styles.button]}
              onPress={trimAndCompressVideo}
            >
              <Text style={[styles.confirmButton, { color: colors.primary }]}>
                Upload video
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button]}
            onPress={handleVideoSelection}
          >
            <Text style={[styles.confirmButton, { color: colors.primary }]}>
              Select video
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default VideoPickerComponent

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alert: {
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    position: "relative",
  },
  cancelButton: {
    // backgroundColor: "#ccc",
    position: "absolute",
    top: 10,
    right: 10,
  },
  confirmButton: {
    fontSize: 18,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  slider: {
    width: "100%",
    marginTop: 10,
    position: "absolute",
    top: 0,
  },
})
