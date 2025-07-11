import React, { useEffect, useState } from "react"
import {
  View,
  ImageBackground,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Platform,
  ImageSourcePropType,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Button, IconButton, Text, useTheme } from "react-native-paper"
import { AuthNavigationProp } from "../../types/navigation/stack"
import useAuth from "../../hooks/useAuth"

interface OnboardingItem {
  id: string
  backgroundImage: ImageSourcePropType
  header: string
  description: string
}

const data: OnboardingItem[] = [
  {
    id: "1",
    backgroundImage: require("../../../assets/images/onboarding1.jpg"),
    header: "Join the Fashion Revolution",
    description:
      "Discover the power of pre-loved fashion. Shop sustainably, save money, and make a positive impact on the environment. Together, we can reduce fashion waste in Africa.",
  },
  {
    id: "2",
    backgroundImage: require("../../../assets/images/onboarding2.jpg"),
    header: "Thrift with Purpose",
    description:
      "Embrace a new way of shopping. Our marketplace connects you with like-minded individuals who care about style and sustainability. Find unique pieces and contribute to a greener planet",
  },
  {
    id: "3",
    backgroundImage: require("../../../assets/images/onboarding3.jpg"),
    header: "Sustainable Style, Made Simple",
    description:
      "Navigate a curated collection of pre-loved fashion items. Our user-friendly platform makes it easy to find and purchase quality pieces, helping you stay stylish while supporting the environment",
  },
  {
    id: "4",
    backgroundImage: require("../../../assets/images/onboarding4.jpg"),
    header: "Fashion for a Better Future",
    description:
      "Join a community dedicated to conscious consumption. By choosing pre-loved items, you're not just saving money—you're also playing a part in solving Africa’s fashion waste crisis. Let's build a sustainable future together.",
  },
]

const WIDTH = Dimensions.get("screen").width

const Auth: React.FC<AuthNavigationProp> = ({ navigation, route }) => {
  const { colors, dark } = useTheme()
  const { loading, user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (user) {
      navigation.replace("Main")
    }
  }, [user])

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Image
          source={{
            uri: dark
              ? "https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif"
              : "https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif",
          }}
          style={[
            {
              width: WIDTH * 0.5,
              height: 40,
              objectFit: "contain",
            },
          ]}
          alt="logo"
        />
      </View>
    )
  }
  const renderItem = ({
    item,
    index,
  }: {
    item: OnboardingItem
    index: number
  }) => {
    return (
      <ImageBackground
        source={item.backgroundImage}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={["transparent", "#000000"]}
          style={styles.gradient}
          end={{ x: 0, y: 1 }}
        />

        <Image
          source={
            dark
              ? require("../../../assets/images/white_anime_logo.gif")
              : require("../../../assets/images/black_anime_logo.gif")
          }
          style={styles.logo}
          alt="logo"
        />
        <Text style={styles.skip} onPress={() => navigation.replace("Main")}>
          Skip
        </Text>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.header}>{item.header}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </ImageBackground>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const { x } = event.nativeEvent.contentOffset
          const index = Math.round(
            x / (event.nativeEvent.layoutMeasurement.width - 20)
          )
          setCurrentIndex(index)
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: Platform.OS === "ios" ? 30 : 0,
          left: 20,
          right: 20,
        }}
      >
        <View style={styles.paginationContainer}>
          {data.map((_, i) => (
            <View
              key={i}
              style={[
                styles.paginationDot,
                i === currentIndex && { backgroundColor: colors.primary },
              ]}
            />
          ))}
        </View>
        <Button
          mode="contained"
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: "800" }}
          uppercase
          style={{
            marginBottom: 20,
            borderRadius: 5,
          }}
          onPress={() => navigation.push("Login")}
        >
          Sign in
        </Button>
        <View style={styles.buttonsContainer}>
          <Text style={styles.registerText}>
            I don't have an account{" "}
            <Text
              style={{ color: colors.primary, fontWeight: "600" }}
              onPress={() => navigation.push("SignUp")}
            >
              Sign up
            </Text>
          </Text>
          <View style={styles.socialIconsContainer}>
            <IconButton
              icon="facebook"
              size={28}
              iconColor="white"
              style={styles.socialIcon}
            />
            <IconButton
              icon="google-plus"
              size={28}
              iconColor="white"
              style={styles.socialIcon}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: WIDTH,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
  textContainer: {
    marginBottom: 30,
  },
  header: {
    fontSize: 28,
    fontFamily: "absential-sans-bold",
    color: "white",
    // textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: "white",
    // textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  activeDot: {},
  buttonsContainer: {
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontFamily: "chronicle-text-bold",
  },
  registerText: {
    color: "white",
  },
  socialIconsContainer: {
    flexDirection: "row",
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: "contain",
    marginBottom: 40,
    position: "absolute",
    top: 70,
    alignSelf: "center",
  },
  skip: {
    fontWeight: "600",
    color: "white",
    position: "absolute",
    top: 50,
    right: 30,
    zIndex: 50,
  },
})

export default Auth
