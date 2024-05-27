import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native"
import React, { useState } from "react"
import { Appbar, Searchbar, useTheme } from "react-native-paper"
import useThemeContext from "../hooks/useTheme"
import { MainScreenNavigationProp } from "../types/navigation/stack"
import { TopSellers } from "../types/user"
import HomeContents from "../section/home/HomeContents"
import { IProduct } from "../types/product"
import { lightTheme } from "../constant/theme"
import homeStyles from "../section/home/homeStyles"
import ProductItem from "../components/ProductItem"

const WIDTH = Dimensions.get("screen").width

type Props = MainScreenNavigationProp

const numColumns = 2

const Home = ({ navigation }: Props) => {
  const { themeMode } = useThemeContext()

  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sellerLoading, setSellerLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // const formatData = (data: IProduct[], numColumns: number) => {
  //   const totalRows = Math.floor(data.length / numColumns)
  //   let totalLastRow = data.length - totalRows * numColumns
  //   if (totalLastRow !== 0 && totalLastRow !== numColumns) {
  //     data.push({ key: "blank", empty: true })
  //   }
  //   return data
  // }

  const handleMore = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1)
      setIsLoading(true)
    }
  }

  const error = ""
  const seller: TopSellers[] = []
  const products: IProduct[] = []

  return (
    <View>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Image
          source={{
            uri:
              themeMode === "dark"
                ? "https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif"
                : "https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif",
          }}
          style={{
            width: WIDTH * 0.5,
            height: 40,
            objectFit: "contain",
          }}
          alt="logo"
        />
      </Appbar.Header>
      <View style={styles.content}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <RenderItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        contentContainerStyle={{ paddingBottom: 300 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <HomeContents
            seller={seller}
            error={error}
            isLoading={sellerLoading}
            navigation={navigation}
          />
        )}
        // onScroll={(e) => {
        //   const offsetY = e.nativeEvent.contentOffset.y;
        //   animatedValue.setValue(offsetY);
        // }}
        scrollEventThrottle={16}
        onEndReached={handleMore}
        onEndReachedThreshold={0}
        ListFooterComponent={() => <Footer isLoading={isLoading} />}
      />
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
  let { itemStyles, invisible } = homeStyles
  // if (item.empty) {
  //   return <View style={[itemStyles, invisible]} />
  // }
  return (
    <View style={itemStyles}>
      <ProductItem navigation={navigation} product={item} />
    </View>
  )
}

const Footer = ({ isLoading }: { isLoading?: boolean }) => {
  const { colors } = useTheme()

  return (
    <View
      style={{
        paddingBottom: 80,
        backgroundColor: colors.background,
      }}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : null}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
})
