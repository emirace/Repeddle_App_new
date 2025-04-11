import { StyleSheet, Text, View } from "react-native"
import React, { useState } from "react"
import { IRebundle } from "../types/user"
import { FontAwesome5 } from "@expo/vector-icons"
import CountDown from "react-native-countdown-component"

type Props = {
  rebundle?: IRebundle
}

// TODO: get rebundle expire date and show countdown
const RebundleLabel = ({ rebundle }: Props) => {
  return rebundle?.status ? (
    <View style={styles.container}>
      <FontAwesome5
        style={{ marginRight: 10 }}
        name="bolt"
        color={"white"}
        size={15}
      />
      <View>
        <Text style={{ color: "white", fontSize: 12 }}>Rebundle is Active</Text>
        <CountDown
          until={
            Number(Date.now()) - Number(Date.parse(rebundle.count.toString()))
          }
          timeToShow={["H", "M", "S"]}
          timeLabels={{ d: "Days", h: "Hrs", m: "Mins", s: "Secs" }}
          digitStyle={{ padding: 0, margin: 0, width: 20, height: 10 }}
          digitTxtStyle={{ color: "white", fontSize: 10 }}
          timeLabelStyle={{ color: "white" }}
        />
      </View>
    </View>
  ) : null
}

export default RebundleLabel

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    top: 300,
    padding: 5,
    paddingLeft: 15,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
  },
})
