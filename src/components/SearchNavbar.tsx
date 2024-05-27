import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react"
import { IconButton, Searchbar } from "react-native-paper"
import { lightTheme } from "../constant/theme"
import useTheme from "../hooks/useTheme"

type Props = {
  //   TODO:
  navigation: any
  gotoCart?: () => void
  back: boolean
  //   TODO:
  onPress: any
}

const SearchNavbar = ({ navigation, gotoCart, back, onPress }: Props) => {
  const { themeMode } = useTheme()

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            back ? navigation.goBack() : navigation.navigate("HomeScreen")
          }
        >
          {back ? (
            <IconButton icon="chevron-back" />
          ) : (
            <Image
              source={{
                uri:
                  themeMode === "light"
                    ? "https://res.cloudinary.com/emirace/image/upload/v1658136004/Reppedle_Black_ebqmot.gif"
                    : "https://res.cloudinary.com/emirace/image/upload/v1658136003/Reppedle_White_d56cic.gif",
              }}
              style={styles.logo}
            />
          )}
        </TouchableOpacity>
        <View style={styles.search}>
          <Searchbar onPress={onPress} value="" />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          {/* TODO:  */}
          {/* <IconButton icon="cart-outline" action={gotoCart} isCart /> */}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SearchNavbar

const styles = StyleSheet.create({
  logo: { width: 50, height: 50, borderRadius: 50, resizeMode: "contain" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: lightTheme.colors.primary,
    paddingHorizontal: 10,
  },
  search: { height: 42 },
})
