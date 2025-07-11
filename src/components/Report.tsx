import React, { useState } from "react"
import useMessage from "../hooks/useMessage"
import useToastNotification from "../hooks/useToastNotification"
import {
  Image,
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native"
import { baseURL } from "../services/api"
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper"
import { MessageData } from "../types/message"
import { uploadOptimizeImage } from "../utils/image"
import { Ionicons } from "@expo/vector-icons"
import { deleteImage } from "../utils/common"

type Props = {
  reportItem: { name: string; id: string; image?: string }
  refs: "user" | "product"
  showModel: boolean
  setShowModel: (val: boolean) => void
}

const Report = ({ reportItem, refs, setShowModel, showModel }: Props) => {
  const [isReporting, setIsReporting] = useState(false)
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { colors } = useTheme()

  const { sendMessage } = useMessage()
  const { addNotification } = useToastNotification()

  const handleImagePick = async () => {
    try {
      setIsUploading(true)
      const res = await uploadOptimizeImage()
      setImage(res as string)
    } catch (error: any) {
      addNotification({
        message: error || "Unable to upload image try again later",
        error: true,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!content) return
    setIsReporting(true)
    const data: MessageData = { content, type: "Report" }
    if (refs === "user") data.referencedUser = reportItem.id
    else data.referencedProduct = reportItem.id
    if (image) data.image = image
    try {
      await sendMessage(data)
      addNotification({ message: "Report sent successfully" })
      setIsReporting(false)
      setShowModel(false)
    } catch (error) {
      addNotification({ message: "Failed to report", error: true })
    } finally {
      setIsReporting(false)
    }
  }

  const onDeleteImage = async () => {
    if (!image) return
    setIsUploading(true)
    try {
      setIsUploading(true)
      const imageName = image.split("/").pop()
      if (imageName) {
        const res = await deleteImage(imageName)
        addNotification({ message: res })
        setImage("")
      }
    } catch (error) {
      addNotification({ message: "Failed to delete image", error: true })
    }
    setIsUploading(false)
  }

  return (
    <Modal
      visible={showModel}
      transparent={true}
      onRequestClose={() => setShowModel(false)}
      animationType="slide"
    >
      <View style={[styles.modalOverlay]}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Pressable style={styles.close} onPress={() => setShowModel(false)}>
              <Ionicons
                name="close-outline"
                size={24}
                color={colors.onBackground}
              />
            </Pressable>
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <Text style={styles.title}>Report {refs}</Text>
              <Text style={styles.subtitle}>
                Please provide details about what you want to report.
              </Text>
            </View>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              {reportItem.image ? (
                <Image
                  source={{ uri: baseURL + reportItem.image }}
                  style={styles.avatar}
                />
              ) : null}
              <Text style={styles.reportName}>{reportItem.name}</Text>
            </View>

            <View style={{ marginBottom: 16, alignItems: "center" }}>
              <Text style={styles.label}>Image</Text>
              {isUploading ? (
                <ActivityIndicator />
              ) : image ? (
                <>
                  <Image
                    source={{ uri: baseURL + image }}
                    style={styles.image}
                  />
                  <Pressable
                    style={styles.trash}
                    onPress={() => onDeleteImage()}
                  >
                    <Ionicons name="trash-outline" size={16} color="black" />
                  </Pressable>
                </>
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.primary}
                  onPress={handleImagePick}
                />
              )}
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Content</Text>
              <TextInput
                mode="outlined"
                style={styles.textarea}
                multiline
                numberOfLines={5}
                placeholder="Describe the issue you're reporting..."
                value={content}
                onChangeText={setContent}
                editable={!isReporting && !isUploading}
                textAlignVertical="top"
              />
            </View>

            <Button
              mode="contained"
              disabled={isUploading || isReporting}
              loading={isReporting}
              onPress={handleSubmit}
              style={{ borderRadius: 10 }}
            >
              Submit
            </Button>
            <Text style={styles.infoText}>
              Please leave all information that will help us resolve your query.
              Please include an order number if your report is related to an
              order you purchased from this seller, or you can go to your
              purchase history and report the related item directly from the
              report tab on the item page.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  subtitle: {
    color: "#666",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
    marginBottom: 8,
  },
  reportName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
    fontSize: 15,
  },
  textarea: {
    borderRadius: 8,
    height: 100,
    textAlignVertical: "top",
    fontSize: 15,
    padding: 0,
  },
  infoText: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 16,
    alignSelf: "center",
    maxWidth: 260,
    lineHeight: 16,
  },
  camera: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    overflow: "hidden",
  },
  trash: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
  },
})

export default Report
