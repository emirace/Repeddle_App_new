import React from "react"
import { View, StyleSheet, TouchableOpacity, Image, Modal } from "react-native"
import { Appbar, Button, Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { normaliseH } from "../utils/normalize"
import { SellNavigationProp } from "../types/navigation/stack"

interface ProductSuccessProps {
  navigation: SellNavigationProp["navigation"]
  showModel: boolean
  setShowModel: (showModel: boolean) => void
}

const ProductSuccess = ({
  navigation,
  showModel,
  setShowModel,
}: ProductSuccessProps) => {
  const { colors } = useTheme()

  const handleAddAnotherProduct = () => {
    setShowModel(false)
  }

  const handleGoToProfile = () => {
    navigation.push("Profile")
  }

  return (
    <Modal
      visible={showModel}
      transparent={true}
      onRequestClose={() => setShowModel(false)}
      animationType="slide"
    >
      <View style={styles.container}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <Ionicons
            name="close-outline"
            size={26}
            color={colors.onBackground}
            onPress={() => setShowModel(false)}
            style={{
              position: "absolute",
              top: normaliseH(24),
              right: normaliseH(24),
            }}
          />

          <View style={styles.iconContainer}>
            <View
              style={[styles.successIcon, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="checkmark" size={60} color="white" />
            </View>
          </View>

          <Text style={[styles.title, { color: colors.onBackground }]}>
            Product Added Successfully!
          </Text>

          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Your product has been successfully listed
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleAddAnotherProduct}
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              contentStyle={styles.buttonContent}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: normaliseH(8),
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={26}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={{ color: "white" }}>Add Another Product</Text>
              </View>
            </Button>

            <Button
              mode="outlined"
              onPress={handleGoToProfile}
              style={[
                styles.button,
                styles.outlinedButton,
                {
                  borderColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              contentStyle={styles.buttonContent}
              labelStyle={{ color: colors.primary }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: normaliseH(8),
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.primary}
                  style={styles.buttonIcon}
                />
                <Text style={{ color: colors.primary }}>Go to Profile</Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    flex: 1,
    padding: normaliseH(26),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  iconContainer: {
    marginBottom: normaliseH(30),
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "absential-sans-bold",
    textAlign: "center",
    marginBottom: normaliseH(10),
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: normaliseH(40),
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: normaliseH(15),
    marginBottom: normaliseH(40),
  },
  button: {
    borderRadius: 10,
    height: normaliseH(50),
  },
  outlinedButton: {
    borderWidth: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    padding: 0,
    margin: 0,
  },
  tipsContainer: {
    width: "100%",
    padding: normaliseH(20),
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
})

export default ProductSuccess
