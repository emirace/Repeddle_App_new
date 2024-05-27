import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useMemo, useRef, useState } from "react"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { Ionicons } from "@expo/vector-icons"
import { IProduct } from "../types/product"
import { normaliseH } from "../utils/normalize"
import { SearchOptionsKey, SearchOptionsObject } from "../types/search"
import MyButton from "../components/MyButton"
import { MainScreenNavigationProp } from "../types/navigation/stack"
import ProductItem from "../components/ProductItem"
import { useTheme } from "react-native-paper"
import SearchNavbar from "../components/SearchNavbar"
import Filters from "../components/Filters"

const numColumns = 2

const Search = ({ navigation }: MainScreenNavigationProp) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ["1%", "100%"], [])

  const [products, setProducts] = useState<IProduct[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [rHasMore, setRHasMore] = useState(false)
  const [rProducts, setRProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageR, setCurrentPageR] = useState(1)
  const [loading, setLoading] = useState(true)
  const [enableScrolling, setEnableScrolling] = useState(true)

  const { colors } = useTheme()

  const [filters, setFilters] = useState<SearchOptionsObject>({})

  const formatData = (data: IProduct[], numColumns: number) => {
    const totalRows = Math.floor(data.length / numColumns)
    let totalLastRow = data.length - totalRows * numColumns
    if (totalLastRow !== 0 && totalLastRow !== numColumns) {
      data.push({ key: "blank", empty: true })
    }
    return data
  }

  const handleSearch = async (query: string) => {
    setProducts([])
    handleFilter("query", query)
    setCurrentPage(1)
  }

  const handleFilter = async (
    filterType: SearchOptionsKey,
    filterValue: string | number
  ) => {
    setProducts([])
    setFilters({ ...filters, [filterType]: filterValue })
    setCurrentPage(1)
  }

  const handleMore = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1)
    }
  }

  const rHandleMore = () => {
    if (rHasMore) {
      setCurrentPageR(currentPageR + 1)
      setLoading(true)
    }
  }

  return (
    <View style={styles.container}>
      <SearchNavbar navigation={navigation} back onPress={handleSearch} />
      {/* <View style={{ paddingHorizontal: 10 }}> */}
      <View style={styles.filterCont}>
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.expand()}
          style={styles.iconCont}
        >
          <Ionicons name="filter" size={24} />
        </TouchableOpacity>
        <View style={styles.resultCont}>
          <Text style={[styles.result]}>
            {products.length ? products.length - 1 : 0} results
          </Text>
        </View>
      </View>
      {!products.length && !loading ? (
        <>
          <Text
            style={{
              textAlign: "center",
              width: "100%",
              marginVertical: 20,
            }}
          >
            🔎 Cant't find what you're looking for? Try related products!
          </Text>
          <FlatList
            data={formatData(rProducts, numColumns)}
            renderItem={({ item }) => (
              <RenderItem item={item} navigation={navigation} />
            )}
            keyExtractor={(item, index) => item._id}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            onEndReached={rHandleMore}
            onEndReachedThreshold={0}
            ListFooterComponent={() => <Footer loading={loading} />}
            style={{ paddingHorizontal: 10 }}
          />
        </>
      ) : (
        <FlatList
          data={formatData(products, numColumns)}
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
      )}
      {/* </View> */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        // onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={enableScrolling}
          keyboardShouldPersistTaps={"always"}
        >
          <Filters
            filters={filters}
            handleFilter={handleFilter}
            setEnableScrolling={setEnableScrolling}
          />
        </BottomSheetScrollView>

        <View style={styles.button}>
          <MyButton
            text={`Apply filter (${products.length ? products.length - 1 : 0})`}
            onPress={() => bottomSheetRef.current?.close()}
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
  navigation: MainScreenNavigationProp["navigation"]
}) => {
  let { itemStyles } = styles
  // if (item.empty) {
  //   return <View style={[itemStyles, invisible]} />
  // }
  return (
    <View style={itemStyles}>
      <ProductItem navigation={navigation} product={item} />
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
    // width: "100%",
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
