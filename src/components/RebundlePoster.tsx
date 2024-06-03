import { Pressable, StyleSheet, View } from "react-native"
import React from "react"
import { FontAwesome } from "@expo/vector-icons"
import { Text, useTheme } from "react-native-paper"
import { currentAddress, goto, region } from "../utils/common"

const RebundlePoster = () => {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <FontAwesome name="truck" size={18} color={colors.onBackground} />
      <Text style={{ color: colors.onBackground, marginLeft: 5 }}>
        Free delivery with{" "}
      </Text>
      <Pressable onPress={() => goto(`${currentAddress(region())}/rebundle`)}>
        <Text style={{ color: colors.primary }}>Re:bundle</Text>
      </Pressable>
    </View>
  )
}

export default RebundlePoster

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
})
