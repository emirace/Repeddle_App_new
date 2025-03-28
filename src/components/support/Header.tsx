import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { IUser } from "../../types/user";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  screen: string;
  setScreen: (screen: string) => void;
  user: IUser | null;
  navigation: any;
}

const Header: React.FC<HeaderProps> = ({
  screen,
  navigation,
  setScreen,
  user,
}) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      {screen !== "home" && (
        <TouchableOpacity onPress={() => setScreen("home")}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
      )}

      {screen === "home" && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
      )}
      <Image
        style={styles.logo}
        source={{
          uri: "https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif",
        }}
      />
    </View>
    {screen === "home" ? (
      <Text style={styles.welcomeText}>
        Hello {user ? user.username : "Guest"}
      </Text>
    ) : (
      <View style={styles.chatInfoContainer}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{ uri: "" }} />
          <Image
            style={[styles.avatar, styles.overlapAvatar]}
            source={{ uri: "" }}
          />
          <Image
            style={[styles.avatar, styles.overlapAvatar]}
            source={{ uri: "" }}
          />
        </View>
        <Text style={styles.chatInfoText}>
          We will reply as soon as we can, but usually within 2hrs
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    padding: 20,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  logo: {
    width: "40%",
    height: 50,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 24,
    color: "#FFA500",
    fontWeight: "bold",
    marginVertical: 20,
    textTransform: "capitalize",
  },
  chatInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  avatarContainer: {
    flexDirection: "row",
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: "white",
    borderRadius: 24,
  },
  overlapAvatar: {
    marginLeft: -20,
  },
  chatInfoText: {
    color: "white",
    fontSize: 14,
    marginLeft: 10,
  },
});

export default Header;
