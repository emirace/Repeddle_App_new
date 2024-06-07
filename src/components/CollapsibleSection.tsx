import { Animated, StyleSheet, TouchableOpacity, View } from "react-native"
import React, { PropsWithChildren, useEffect, useRef, useState } from "react"
import { Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

type Props = PropsWithChildren<{
  title: string
}>

const CollapsibleSection = ({ title, children }: Props) => {
  const { colors } = useTheme()
  const [collapsed, setCollapsed] = useState(true)
  const heightValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(heightValue, {
      toValue: collapsed ? 0 : 100,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [collapsed])

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionTitleCont}
        onPress={toggleCollapse}
        //   onLayout={(event) => {
        //     if (descriptionHeight === 0) {
        //       setDescriptionHeight(event.nativeEvent.layout.height);
        //     }
        //   }}
      >
        <Text style={[styles.sectionTitle]}>{title}</Text>
        {collapsed ? (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.onBackground}
          />
        ) : (
          <Ionicons name="chevron-down" size={18} color={colors.onBackground} />
        )}
      </TouchableOpacity>
      <Animated.View style={{ height: heightValue }}>{children}</Animated.View>
    </View>
  )
}

export default CollapsibleSection

const styles = StyleSheet.create({
  section: { marginVertical: 10 },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  sectionTitleCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})
