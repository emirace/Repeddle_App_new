import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useState } from "react"
import { ProductListNavigationProp } from "../../types/navigation/stack"
import { Appbar, Text, useTheme } from "react-native-paper"
import { normaliseW } from "../../utils/normalize"
import { Ionicons } from "@expo/vector-icons"
import moment from "moment"
import useProducts from "../../hooks/useProducts"
import { IProduct } from "../../types/product"

type Props = ProductListNavigationProp

const ProductList = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const { products, fetchProducts, loading, error, deleteProduct } =
    useProducts()

  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<IProduct[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchProducts(`page=${currentPage}`)
    // TODO: search filter
  }, [currentPage])

  const handleMore = () => {
    if (currentPage < products.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const confirmDelete = (product: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return
          },
          style: "cancel",
        },
        { text: "OK", onPress: () => deleteHandler(product) },
      ],
      { cancelable: false }
    )
  }
  const deleteHandler = async (productId: string) => {
    const res = await deleteProduct(productId)

    // TODO: toast
    if (res.message) {
      Alert.alert(res.message)
    }
  }

  return (
    <View style={styles.container}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.onBackground}
        />
        <Appbar.Content title="Products" />
        <Appbar.Action
          icon="magnify"
          onPress={() => setIsSearchVisible(true)}
        />
      </Appbar.Header>

      <Modal visible={isSearchVisible} animationType="fade" transparent={true}>
        <View style={styles.overlay}>
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <TextInput
              placeholder="Search"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              style={styles.searchInput}
              placeholderTextColor="rgba(225,225,225,1)"
            />
            <TouchableOpacity
              onPress={() => {
                setIsSearchVisible(false)
                setSearchQuery("")
                setSearchResults([])
              }}
            >
              <Text style={{ color: colors.secondary }}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resultsContainer}>
            <FlatList
              data={searchResults}
              renderItem={({ index, item }) => (
                <RenderProductItem
                  index={index}
                  item={item}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => item._id.toString()}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("Sell")}
      >
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator color={colors.primary} size={"large"} />
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : products.products.length > 0 ? (
        <FlatList
          data={products.products}
          renderItem={({ item }) => (
            <RenderItem
              confirmDelete={confirmDelete}
              item={item}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onEndReached={handleMore}
          onEndReachedThreshold={0}
          ListFooterComponent={() => <Footer loading={loading} />}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No product found
        </Text>
      )}
    </View>
  )
}

export default ProductList

type RenderItemProps = {
  item: IProduct
  navigation: ProductListNavigationProp["navigation"]
  confirmDelete: (id: string) => void
}

const RenderItem = ({ item, navigation, confirmDelete }: RenderItemProps) => {
  const { colors } = useTheme()
  return (
    <View style={styles.itemContainer}>
      <Pressable
        onPress={() => navigation.navigate("Product", { slug: item.slug })}
        style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
      >
        <Image style={styles.itemImage} source={{ uri: item.images[0] }} />
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemDate}>
            {moment(item.createdAt).format("MMM DD YY, h:mm a")}
          </Text>
        </View>
      </Pressable>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate("ViewProduct", { id: item.slug })}
      >
        <Ionicons name="eye" size={20} color={colors.onBackground} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate("EditProduct", { id: item.slug })}
      >
        <Ionicons name="create" size={20} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => confirmDelete(item._id)}
      >
        <Ionicons name="trash" size={20} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  )
}

type renderProductItemProps = {
  index: number
  item: IProduct
  navigation: ProductListNavigationProp["navigation"]
}

const RenderProductItem = ({
  item,
  index,
  navigation,
}: renderProductItemProps) => {
  const backgroundColor = index % 2 === 0 ? "#f2f2f2" : "white"
  return (
    <TouchableOpacity
      style={[styles.productItem, { backgroundColor }]}
      onPress={() => navigation.navigate("Product", { slug: item.slug })}
    >
      <Text>{item.name}</Text>
      <Text>{item.sellingPrice}</Text>
    </TouchableOpacity>
  )
}

const Footer = ({ loading }: { loading: boolean }) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        paddingBottom: 100,
        backgroundColor: colors.background,
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // backgroundColor: COLOR.orange,
  },
  title: { fontWeight: "bold", fontSize: 20, textTransform: "capitalize" },
  content: {
    padding: 5,
    width: "100%",
  },
  productCont: {
    height: 100,
    width: "100%",
    margin: 5,
    borderRadius: 10,
    flexDirection: "row",
    overflow: "hidden",
  },
  image: { height: 100, width: 80 },
  details: {
    paddingBottom: normaliseW(10),
    paddingLeft: normaliseW(10),
    flex: 1,
    height: 100,
    justifyContent: "space-between",
  },
  top: { flexDirection: "row", justifyContent: "space-between" },
  productName: { fontSize: 18, fontWeight: "500" },
  priceCont: {
    // backgroundColor: COLOR.orange,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 10,
  },
  price: { color: "white", fontSize: 18 },
  description: { fontSize: 13, paddingRight: 5 },
  rating: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    height: "20%",
  },

  itemStyles: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 10,
    height: 300,
    borderRadius: 15,
  },
  itemText: {
    color: "white",
    fontSize: 30,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  searchContainer: {
    // backgroundColor: COLOR.orange,
    // borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    borderColor: "white",
    color: "white",
  },
  resultsContainer: { flex: 1, padding: 10 },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    borderRadius: 5,
  },
  listContainer: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
    flex: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 30,
  },
  itemDetailsContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemDate: {
    fontSize: 12,
    color: "#888",
  },
  iconButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  pendingStatus: {
    backgroundColor: "#f39c12",
  },
  // completedStatus: {
  //   backgroundColor: "#2ecc71",
  // },
  // completedStatus: {
  //   backgroundColor: COLOR.malon,
  // },
  buttonContainer: {
    backgroundColor: "#8a1719",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
})
