import { View, StyleSheet, FlatList, Pressable } from "react-native"
import React, { useEffect } from "react"
import useCategory from "../../hooks/useCategory"
import { Text, useTheme } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { MainScreenNavigationProp } from "../../types/navigation/stack"

const CategoryButtons = () => {
  const { categories, fetchCategories } = useCategory()
  const { colors } = useTheme()

  const { navigate } = useNavigation<MainScreenNavigationProp["navigation"]>()

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <View
      style={{ paddingVertical: 10, backgroundColor: colors.elevation.level1 }}
    >
      <FlatList
        data={categories}
        horizontal
        renderItem={({ item: cat }) => (
          <Pressable
            onPress={() =>
              navigate("Search", {
                filter: {
                  category: cat.name,
                },
              })
            }
          >
            <Text style={[styles.item, { borderColor: colors.onBackground }]}>
              {cat.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 2,
    fontFamily: "absential-sans-bold",
    textTransform: "uppercase",
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    fontSize: 14,
  },
})

export default CategoryButtons
