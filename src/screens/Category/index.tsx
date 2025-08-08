import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Appbar, useTheme, Text } from "react-native-paper"
import { CategoryNavigationProp } from "../../types/navigation/stack"
import useCategory from "../../hooks/useCategory"
import { ICategory } from "../../types/category"
import { baseURL } from "../../services/api"

const Category = ({ navigation }: CategoryNavigationProp) => {
  const { categories, fetchCategories, loading, error } = useCategory()
  const { colors } = useTheme()

  useEffect(() => {
    const getCategories = async () => {
      try {
        await fetchCategories()
      } catch (err) {
        console.log(err)
      }
    }
    getCategories()
  }, [])

  const handleCategoryPress = (category: ICategory) => {
    if (category.mobile_path) {
      if (typeof category.mobile_path === "string") {
        navigation.navigate(category.mobile_path as any)
      } else {
        navigation.navigate((category.mobile_path as any).name, {
          ...(category.mobile_path as any).params,
        })
      }
    } else {
      navigation.navigate("SubCategories", { category })
    }
  }

  const renderCategory = ({ item }: { item: ICategory }) => (
    <TouchableOpacity
      style={styles.categoryContainer}
      onPress={() => handleCategoryPress(item)}
    >
      <Image
        source={{
          uri: item.image.startsWith("http")
            ? item.image
            : baseURL + item.image,
        }}
        style={styles.categoryImage}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="Category" color="white" />
      </Appbar.Header>
      {loading && <ActivityIndicator />}
      {error && !categories.length && (
        <Text style={{ color: "red" }}>{error}</Text>
      )}
      {!loading && !categories.length && !error && (
        <Text style={{ color: "red" }}>No categories found</Text>
      )}
      <View style={styles.container}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(category) => category._id.toString()}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </View>
    </View>
  )
}

export default Category

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    margin: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  categoryImage: {
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    opacity: 1,
  },
  categoryName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textTransform: "capitalize",
  },
})
