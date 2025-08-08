import React, { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native"
import { Appbar, useTheme, Text, IconButton } from "react-native-paper"
import { SubCategoriesNavigationProp } from "../../types/navigation/stack"
import { ISubCategory, ISubCategoryItem } from "../../types/category"
import { baseURL } from "../../services/api"

const SubCategories = ({ route, navigation }: SubCategoriesNavigationProp) => {
  const { category } = route.params
  const { colors } = useTheme()

  const renderSubcategoryItem = ({ item }: { item: ISubCategory }) => {
    return (
      <TouchableOpacity
        style={[
          styles.subcategoryButton,
          { backgroundColor: colors.elevation.level3 },
        ]}
        onPress={() => handleSubcategorySelect(item)}
      >
        <Text style={styles.subcategoryTitle}>
          {item.name}
          {item.name && removeGreaterThanSign(item.name)}
        </Text>
        {item.items && (
          <FlatList
            data={item.items}
            renderItem={renderNextSubcategoryItem}
            keyExtractor={(item) => item._id}
            horizontal={true}
            style={{ marginTop: 10 }}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </TouchableOpacity>
    )
  }

  const renderNextSubcategoryItem = ({ item }: { item: ISubCategoryItem }) => {
    const handleSubcategorySelect = (subcategory: ISubCategoryItem) => {
      console.log(subcategory.name, "subcategory")
      if (
        subcategory.name.startsWith("SELL WITH US") ||
        subcategory.name
          .split(" ")
          .join("")
          .split("+")
          .join("")
          .toLowerCase()
          .includes("sellwithus")
      )
        return navigation.navigate("Sell")
      navigation.navigate("Search", { query: subcategory.name })
    }

    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSubcategorySelect(item)}
      >
        <View style={[styles.gradient, { borderColor: colors.onBackground }]}>
          <Text style={[styles.text, { borderColor: colors.onBackground }]}>
            {item.name && removeGreaterThanSign(item.name)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const handleSubcategorySelect = (subcategory: ISubCategory) => {
    console.log(subcategory.name, "subcategory")
    if (
      subcategory.name.startsWith("SELL WITH US") ||
      subcategory.name
        .split(" ")
        .join("")
        .split("+")
        .join("")
        .toLowerCase()
        .includes("sellwithus")
    )
      return navigation.navigate("Sell")
    navigation.navigate("Search", { query: subcategory.name })
  }

  return (
    <View style={styles.container}>
      {category.image && (
        <View style={styles.categoryImageContainer}>
          <Image
            style={styles.categoryImage}
            source={{
              uri: category.image.startsWith("http")
                ? category.image
                : baseURL + category.image,
            }}
            resizeMode="cover"
          />
          <Text style={styles.categoryImageTitle}>{category.name}</Text>
        </View>
      )}
      <IconButton
        icon="chevron-left"
        size={35}
        iconColor="black"
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", top: 40, left: 5 }}
      />
      <View style={styles.listCont}>
        <FlatList
          data={category.subCategories}
          renderItem={renderSubcategoryItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  categoryImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  categoryImage: {
    width: "100%",
    height: 200,
  },
  categoryImageTitle: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textTransform: "capitalize",
  },
  subcategoryButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  subcategoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  button: {
    borderRadius: 5,
    margin: 5,
  },
  gradient: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  listCont: {
    paddingHorizontal: 20,
    flex: 1,
  },
})

function removeGreaterThanSign(str: string) {
  return str.replace(/>/g, "")
}

export default SubCategories
