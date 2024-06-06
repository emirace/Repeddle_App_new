import { StyleSheet, View } from "react-native"
import React from "react"
import { normaliseH } from "../utils/normalize"
import { Ionicons } from "@expo/vector-icons"
import { Text, useTheme } from "react-native-paper"

type Props =
  | {
      rating: number
      caption: string
    }
  | {
      rating: number
      numReviews: number
    }

const Rating = (props: Props) => {
  const { colors } = useTheme()

  return (
    <View>
      <View style={styles.rating}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View style={styles.star} key={i}>
            <Ionicons
              name={
                props.rating >= i + 1
                  ? "star-sharp"
                  : props.rating >= i + 0.5
                  ? "star-half-sharp"
                  : "star-outline"
              }
              color="#eb9f40"
              size={18}
            />
          </View>
        ))}
        <View>
          {"caption" in props ? (
            <Text>{props.caption}</Text>
          ) : (
            <Text style={{ color: colors.onBackground }}>
              {" " + props.numReviews + " reviews"}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default Rating

const styles = StyleSheet.create({
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normaliseH(5),
  },
  star: { marginRight: 3 },
})
