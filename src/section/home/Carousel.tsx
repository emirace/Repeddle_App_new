import {
  Image,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import CarouselItem from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import homeStyles from "./homeStyles";
import {
  MainScreenNavigationProp,
  RootStackParamList,
} from "../../types/navigation/stack";
import { Text, useTheme } from "react-native-paper";

const entries: {
  title: string;
  subtitle: string;
  illustration: string;
  button: string;
  screen: keyof RootStackParamList;
}[] = [
  {
    title:
      " AFRICA’S MILLENNIALS & GEN-Z ONLINE COMMUNITY FOR SECONHAND FASHION.",
    subtitle: "Lorem ipsum dolor sit amet et nuncat mergitur",
    illustration: "https://repeddle.com/images/ezgif.com-gif-maker.webp",
    button: "join us",
    screen: "Auth",
  },
  {
    title: "BUY-SELL-CHAT-CASH OUT-REPEAT",
    subtitle: "Lorem ipsum dolor sit amet",
    illustration:
      "https://repeddle.com/images/greg-raines-rqFBIR6vQXg-unsplash.webp",
    button: "shop now",
    screen: "Search",
  },
  {
    title: "JOIN THE THRIFT TREASURE HUNT",
    subtitle: "Lorem ipsum dolor sit amet et nuncat ",
    illustration:
      "https://repeddle.com/images/chimi-davila-58FCfyUti_w-unsplash.webp",
    button: "discover",
    screen: "Sell",
  },
];

type Entry = typeof entries;

const RenderItemSlider = ({
  item,
  navigation,
}: {
  item: Entry[number];
  navigation: MainScreenNavigationProp["navigation"];
}) => {
  const { colors } = useTheme();

  return (
    <View style={homeStyles.item}>
      <Image source={{ uri: item.illustration }} style={homeStyles.image} />
      <LinearGradient
        colors={["transparent", "#00000060"]}
        style={homeStyles.gradientOverlay}
        locations={[0.7, 0.9]}
      >
        <View style={homeStyles.titleCont}>
          <Text style={homeStyles.title1} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={[homeStyles.classicButton, { marginLeft: 15 }]}
            onPress={() => navigation.push(`${item.screen}`)}
          >
            <Text
              style={[
                homeStyles.classicButtonText,
                { borderBottomColor: colors.primary },
              ]}
            >
              {item.button}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

type Props = { navigation: MainScreenNavigationProp["navigation"] };

const Carousel = ({ navigation }: Props) => {
  const { width } = useWindowDimensions();

  return (
    <View>
      {/* <CarouselItem
        loop
        width={width}
        height={width * 0.8}
        autoPlay={true}
        data={entries}
        scrollAnimationDuration={5000}
        renderItem={({ item }) => (
          <RenderItemSlider item={item} navigation={navigation} />
        )}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      /> */}
    </View>
  );
};

export default Carousel;
