import { Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react"
import { Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

type Props = {
  visible: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  onWishlist: () => void
}

const CustomAlert = ({
  message,
  onCancel,
  onConfirm,
  onWishlist,
  visible,
}: Props) => {
  const { colors } = useTheme()

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.alert, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={[styles.cancelButton]} onPress={onCancel}>
            <Ionicons name="close" size={20} color={colors.onBackground} />
          </TouchableOpacity>
          <Text style={[styles.message]}>{message}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button]} onPress={onWishlist}>
              <Text
                style={[styles.wishlistButton, { color: colors.secondary }]}
              >
                Add to wishlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={onConfirm}>
              <Text style={[styles.confirmButton, { color: colors.primary }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CustomAlert

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alert: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    marginTop: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
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
  wishlistButton: {
    fontSize: 18,
  },
  buttonText: {
    color: "#fff",
  },
})
