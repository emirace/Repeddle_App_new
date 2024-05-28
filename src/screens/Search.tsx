import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { Ionicons } from "@expo/vector-icons"
import { IProduct } from "../types/product"
import { normaliseH } from "../utils/normalize"
import { SearchOptionsKey, SearchOptionsObject } from "../types/search"
import MyButton from "../components/MyButton"
import { SearchScreenNavigationProp } from "../types/navigation/stack"
import ProductItem from "../components/ProductItem"
import { Text, useTheme } from "react-native-paper"
import SearchNavbar from "../components/SearchNavbar"
import Filters from "../components/Filters"
import useProducts from "../hooks/useProducts"

const numColumns = 2

const Search = ({ navigation, route }: SearchScreenNavigationProp) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ["1%", "100%"], [])

  const { fetchProducts, loading, products: productData } = useProducts()
  const { colors } = useTheme()

  const [hasResult, setHasResult] = useState(true)
  const [products, setProducts] = useState<IProduct[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [enableScrolling, setEnableScrolling] = useState(true)

  const [filters, setFilters] = useState<SearchOptionsObject>(route.params)
  const [tempFilters, setTempFilters] = useState<SearchOptionsObject>(
    route.params
  )

  const fetchProd = useCallback(async () => {
    setHasResult(true)
    const params: string[][] = []

    Object.entries(filters).forEach((val) =>
      params.push([val[0], val[1].toString()])
    )

    const string = new URLSearchParams(params).toString()

    return await fetchProducts(string)
  }, [filters])

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchProd()

      // check if there are products for query
      if (res && productData.totalCount !== 0) {
        setProducts(productData.products)
        return
      }

      await fetchProducts()
      setHasResult(false)
    }

    fetch()
  }, [fetchProd])

  const handleSearch = async (query: string) => {
    handleTempFilters("query", query)
    setCurrentPage(1)
  }

  const handleFilter = async () => {
    setProducts([])
    setFilters({ ...filters, page: 1 })
  }

  const handleTempFilters = async (
    filterType: SearchOptionsKey,
    filterValue: string | number
  ) => {
    setTempFilters({ ...filters, [filterType]: filterValue })
  }

  const handleMore = () => {
    if (currentPage < productData.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <View style={styles.container}>
      <SearchNavbar navigation={navigation} back onPress={handleSearch} />

      <View style={styles.filterCont}>
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.expand()}
          style={styles.iconCont}
        >
          <Ionicons name="filter" size={24} />
        </TouchableOpacity>
        <View style={styles.resultCont}>
          <Text style={[styles.result]}>{productData.totalCount} results</Text>
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
        data={products}
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

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={enableScrolling}
          keyboardShouldPersistTaps={"always"}
        >
          <Filters
            tempFilters={tempFilters}
            handleTempFilter={handleTempFilters}
            setEnableScrolling={setEnableScrolling}
          />
        </BottomSheetScrollView>

        <View style={styles.button}>
          <MyButton
            text={`Apply filter (${Object.keys(tempFilters).length})`}
            onPress={() => {
              handleFilter()
              bottomSheetRef.current?.close()
            }}
          />
        </View>
      </BottomSheet>
    </View>
  )
}

const RenderItem = ({
  item,
  navigation,
}: {
  item: IProduct
  navigation: SearchScreenNavigationProp["navigation"]
}) => {
  let { itemStyles } = styles

  return (
    <View style={itemStyles}>
      <ProductItem
        navigate={(slug: string) => navigation.navigate("Product", { slug })}
        product={item}
      />
    </View>
  )
}

const Footer = ({ loading }: { loading: boolean }) => {
  if (!loading) return null
  const { colors } = useTheme()

  return (
    <View
      style={{
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  filterCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: normaliseH(40),
    alignItems: "center",
    margin: 10,
  },
  resultCont: {},
  button: { padding: 5 },
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
})
