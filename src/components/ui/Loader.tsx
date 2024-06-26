import { Image, StyleSheet, Text, View } from "react-native"
import React from "react"
import { useTheme } from "react-native-paper"

const Loader = () => {
  const { dark } = useTheme()

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: dark
            ? "https://res.cloudinary.com/emirace/image/upload/v1658136003/Reppedle_White_d56cic.gif"
            : "https://res.cloudinary.com/emirace/image/upload/v1658136004/Reppedle_Black_ebqmot.gif",
        }}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 55,
    width: 80,
  },
})
