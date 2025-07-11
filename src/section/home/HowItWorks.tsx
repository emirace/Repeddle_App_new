import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { goto } from "../../utils/common";
import { frontendURL } from "../../services/api";

const HowItWorks = () => {
  return (
    <Pressable onPress={() => goto(`${frontendURL}/how-repeddle-work`)}>
      <Image
        source={{
          uri: "https://res.cloudinary.com/emirace/image/upload/v1691653514/20230807_205931_0000_t2aa7t.png",
        }}
        alt="img"
        style={{ width: "100%", objectFit: "contain", minHeight: 150 }}
      />
    </Pressable>
  );
};

export default HowItWorks;
