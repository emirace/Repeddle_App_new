import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";

const Loader = () => {
  const { dark } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={
          dark
            ? require("../../../assets/images/white_anime_logo.gif")
            : require("../../../assets/images/black_anime_logo.gif")
        }
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default Loader;

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
});
