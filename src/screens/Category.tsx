import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React from "react"
import { Appbar } from "react-native-paper"
import { ICategory } from "../types/category"
import { normaliseH } from "../utils/normalize"
import { lightTheme } from "../constant/theme"

const Category = () => {
  const categories: ICategory[] = []

  const handleCategoryPress = (category: ICategory) => {
    console.log(category)
    // navigation.navigate("SubCategories", { category })
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Category" />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
          // onPress={() => navigation.goBack()}
          >
            {/* <IconButton icon="chevron-back" /> */}
          </TouchableOpacity>
          <Text style={[styles.title, { color: "white" }]}>Categories</Text>
          <TouchableOpacity
          // onPress={() => navigation.navigate("Cart")}
          >
            {/* <IconButton icon="cart-outline" isCart /> */}
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <RenderCategory
                item={item}
                handleCategoryPress={handleCategoryPress}
              />
            )}
            keyExtractor={(category) => category._id.toString()}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        </View>
      </View>
    </View>
  )
}

export default Category

const RenderCategory = ({
  item,
  handleCategoryPress,
}: {
  item: ICategory
  handleCategoryPress: (val: ICategory) => void
}) => (
  <TouchableOpacity
    style={styles.categoryContainer}
    onPress={() => handleCategoryPress(item)}
  >
    <Image
      source={{
        uri: item.image,
      }}
      style={styles.categoryImage}
    />
    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: normaliseH(10),
    backgroundColor: lightTheme.colors.primary,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textTransform: "capitalize",
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
    backgroundColor: "#f2f2f2",
  },
  categoryImage: {
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    opacity: 0.8,
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
  subcategoryContainer: {
    flex: 1,
    height: 50,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  subcategoryName: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
})
