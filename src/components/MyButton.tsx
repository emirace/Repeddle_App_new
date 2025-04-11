import { StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { lightTheme } from "../constant/theme"
import { Text } from "react-native-paper"

type Props = {
  icon?: keyof typeof Ionicons.glyphMap
  disable?: boolean
  text: string
  onPress: () => void
}

const MyButton = ({ text, disable, icon, onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={disable ? 1 : 0.5}
      onPress={() => (disable ? null : onPress())}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: disable ? "grey" : lightTheme.colors.primary },
        ]}
      >
        <View style={styles.carttext}>
          {icon && <Ionicons name={icon} size={18} color="white" />}
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default MyButton

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  carttext: { flexDirection: "row", alignItems: "center" },
  text: {
    color: "white",
    fontFamily: "chronicle-text-bold",
    fontSize: 18,
    textTransform: "capitalize",
    marginLeft: 10,
  },
})
