import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { Ionicons } from "@expo/vector-icons"
import { IProduct, ProductWithPagination } from "../types/product"
import { normaliseH } from "../utils/normalize"
import { FilterOptions } from "../types/search"
import { SearchScreenNavigationProp } from "../types/navigation/stack"
import ProductItem from "../components/ProductItem"
import { Appbar, Button, Searchbar, Text, useTheme } from "react-native-paper"
import Filters from "../components/Filters"
import useProducts from "../hooks/useProducts"
import CustomBackdrop from "../components/CustomBackdrop"
import { lightTheme } from "../constant/theme"
import useCategory from "../hooks/useCategory"
import Loader from "../components/ui/Loader"
import CartIcon from "../components/ui/cartIcon"
import useToastNotification from "../hooks/useToastNotification"

const numColumns = 2

const emptyProduct = {
  currentPage: 0,
  products: [],
  totalCount: 0,
  totalPages: 0,
}

const Search = ({ navigation, route }: SearchScreenNavigationProp) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ["87%"], [])
  const { filter, query: queryParams } = route.params

  const { fetchProducts, loading } = useProducts()
  const { categories, fetchCategories } = useCategory()
  const { colors } = useTheme()
  const { addNotification } = useToastNotification()

  const [hasResult, setHasResult] = useState(true)
  const [products, setProducts] = useState<ProductWithPagination>(emptyProduct)
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState(queryParams ?? "")

  const [filters, setFilters] = useState<FilterOptions>(filter ?? {})

  const fetchProd = async () => {
    setHasResult(true)
    setProducts(emptyProduct)
    const params: string[][] = []

    if (filters && Object.keys(filters).length) {
      const filterParam = joinFilterParm(filters)
      console.log(filterParam)
      if (filterParam.length) params.push(["filter", filterParam])
    }

    if (currentPage && currentPage > 1)
      params.push(["page", currentPage.toString()])

    if (query) params.push(["search", query])

    const string = new URLSearchParams(params).toString()

    console.log(string)

    const res = await fetchProducts(string)

    // check if there are products return from query
    if (typeof res !== "string" && products.totalCount !== 0) {
      setProducts(products)
      return
    }

    console.log("no result")

    const related = await fetchProducts()
    if (typeof related !== "string") {
      console.log(products)
      setProducts(products)
      setHasResult(false)
    } else {
      addNotification({ message: related, error: true })
    }
  }

  const joinFilterParm = (param: { [key: string]: string }) => {
    const params = Object.keys(param)
      .map((obj) => `${obj}:${param[obj]}`)
      .join(",")
    return params
  }

  useEffect(() => {
    fetchProd()
  }, [currentPage])
  // fetch when current page changes

  useEffect(() => {
    fetchCategories()
  }, [])

  const formatData = (data: IProduct[]) => {
    const isEven = data.length % numColumns === 0

    if (!isEven) {
      const empty = { ...data[0], empty: true }
      data.push(empty)
    }

    return data
  }

  const applyFilter = async () => {
    setProducts(emptyProduct)
    setCurrentPage(1)
    await fetchProd()
  }

  const handleFilter = (key: keyof FilterOptions, value: string | number) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleMore = () => {
    if (currentPage < products.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
          color={colors.onBackground}
        />
        <Searchbar
          style={styles.searchbar}
          inputStyle={{ minHeight: 0 }}
          value={query}
          onChangeText={setQuery}
          onIconPress={applyFilter}
        />
        <Appbar.Content
          title={
            <View style={{ marginLeft: "auto" }}>
              <CartIcon
                iconColor="white"
                onPress={() => navigation.push("Cart")}
              />
            </View>
          }
        />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.filterCont}>
          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.present()}
            style={styles.iconCont}
          >
            <Ionicons name="filter" color={colors.onBackground} size={24} />
          </TouchableOpacity>
          <View style={styles.resultCont}>
            <Text style={[styles.result]}>{products.totalCount} results</Text>
          </View>
        </View>
        {!hasResult && !loading && (
          <Text
            style={{
              textAlign: "center",
              width: "100%",
              marginVertical: 20,
            }}
          >
            🔎 Cant't find what you're looking for? Try related products!
          </Text>
        )}

        <FlatList
          data={formatData(products.products)}
          renderItem={({ item }) => (
            <RenderItem item={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => item._id}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          onEndReached={handleMore}
          onEndReachedThreshold={0}
          style={{ paddingHorizontal: 10 }}
          ListFooterComponent={() => <Footer loading={loading} />}
        />

        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: colors.elevation.level1 }}
          handleIndicatorStyle={{
            backgroundColor: colors.primary,
          }}
          backdropComponent={(props) => <CustomBackdrop {...props} />}
          style={styles.bottomStyle}
        >
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"always"}
          >
            <Filters
              categories={categories}
              filters={filters}
              handleFilter={handleFilter}
              setFilters={setFilters}
            />
          </BottomSheetScrollView>

          <View style={styles.button}>
            <Button
              mode="contained"
              style={{ borderRadius: 5, height: 50, padding: 5 }}
              children={`Apply filter (${Object.keys(filters).length})`}
              onPress={() => {
                applyFilter()
                bottomSheetRef.current?.close()
              }}
            />
          </View>
        </BottomSheetModal>
      </View>
    </View>
  )
}

const RenderItem = ({
  item,
  navigation,
}: {
  item: IProduct & { empty?: boolean }
  navigation: SearchScreenNavigationProp["navigation"]
}) => {
  let { itemStyles, invisible } = styles

  if (item.empty) return <View style={[itemStyles, invisible]}></View>

  return (
    <View style={itemStyles}>
      <ProductItem
        navigate={(slug: string) => navigation.push("Product", { slug })}
        product={item}
      />
    </View>
  )
}

const Footer = ({ loading }: { loading: boolean }) => {
  if (!loading) return null
  const { colors } = useTheme()

  return <Loader />
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  searchbar: {
    width: Dimensions.get("screen").width * 0.65,
    borderRadius: 5,
    height: 40,
    marginHorizontal: "auto",
  },
  filterCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: normaliseH(40),
    alignItems: "center",
    margin: 10,
  },
  resultCont: {},
  button: { padding: 20 },
  result: {},
  iconCont: {},
  itemStyles: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 10,
    height: 300,
    borderRadius: 5,
  },
  itemText: {
    color: "white",
    fontSize: 30,
  },
  invisible: { backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomStyle: {
    shadowColor: lightTheme.colors.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 5,
  },
})
