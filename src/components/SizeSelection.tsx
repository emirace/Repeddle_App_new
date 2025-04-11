import { StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react"
import { Text, useTheme } from "react-native-paper"

type Props = {
  selectedSize: string
  symbol: string
  sizeHandler: (val: string) => void
}

const SizeSelection = ({ selectedSize, symbol, sizeHandler }: Props) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity
      onPress={() => {
        sizeHandler(symbol)
      }}
      style={[
        styles.circle,
        {
          backgroundColor:
            selectedSize === symbol ? colors.primary : colors.elevation.level2,
        },
      ]}
    >
      <Text
        style={[
          styles.circletext,
          {
            color: selectedSize === symbol ? "white" : colors.onBackground,
          },
        ]}
      >
        {symbol}
      </Text>
    </TouchableOpacity>
  )
}

export default SizeSelection

const styles = StyleSheet.create({
  sizes: { flexDirection: "row", marginBottom: 20 },
  circle: {
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  circletext: {
    fontSize: 14,
    textTransform: "uppercase",
    fontFamily: "absential-sans-bold",
  },
})
