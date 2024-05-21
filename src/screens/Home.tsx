import { StyleSheet, Image, View, Dimensions } from "react-native";
import React from "react";
import { Appbar, Searchbar, Text } from "react-native-paper";
import useTheme from "../hooks/useTheme";

const WIDTH = Dimensions.get("screen").width;

const Home = () => {
  const { themeMode } = useTheme();

  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Image
          source={{
            uri:
              themeMode === "dark"
                ? "https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif"
                : "https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif",
          }}
          style={{
            width: WIDTH * 0.5,
            height: 40,
            objectFit: "contain",
          }}
          alt="logo"
        />
      </Appbar.Header>
      <View style={styles.content}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
});
