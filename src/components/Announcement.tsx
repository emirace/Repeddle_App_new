import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Text, Tooltip, useTheme } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { MainScreenNavigationProp } from "../types/navigation/stack";

type Props = {
  navigation: MainScreenNavigationProp["navigation"];
};

const { width } = Dimensions.get("window");
const data = [
  { textButton: "SIGN UP", text: "List All Item For Free" },
  {
    textButton: "DETAILS",
    text: "No Selling Fees, Hurry, Start Selling, Limited Offer!!",
  },
];

const Announcement = ({ navigation }: Props) => {
  const { colors } = useTheme();

  const [autoplay, setAutoplay] = useState(true);

  const action = (value: string) => {
    if (value === "SIGN UP") {
      navigation.push("Auth");
    }
  };

  return (
    <Carousel
      loop
      width={width}
      height={18}
      autoPlay={autoplay}
      data={data}
      scrollAnimationDuration={10000}
      renderItem={({ item }) => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "chronicle-text",
              fontSize: 12,
            }}
          >
            {item.text}
          </Text>
          {item.textButton === "DETAILS" ? (
            <Tooltip
              title="Sell more than 10,400 brand names you love. To give you unmatched user experiencd and support the growth of your business as part of our thrift secondhand community, you will not be charge Repeddle seller's commision fee."
              // position="top"
            >
              <Text
                style={{
                  textAlign: "center",
                  color: colors.primary,
                  marginLeft: 5,
                  fontSize: 11,
                  fontFamily: "chronicle-text",
                }}
                onPress={() => setAutoplay(!autoplay)}
              >
                {item.textButton}
              </Text>
            </Tooltip>
          ) : (
            <TouchableOpacity onPress={() => action(item.textButton)}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.primary,
                  marginLeft: 5,
                  fontSize: 11,
                  fontFamily: "chronicle-text",
                }}
              >
                {item.textButton}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

export default Announcement;

const styles = StyleSheet.create({});
