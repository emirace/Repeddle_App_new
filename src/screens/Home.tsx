import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Animated,
} from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { Appbar, IconButton, Searchbar, useTheme } from "react-native-paper"
import useThemeContext from "../hooks/useTheme"
import { MainScreenNavigationProp } from "../types/navigation/stack"
import { TopSellers } from "../types/user"
import HomeContents from "../section/home/HomeContents"
import { IProduct } from "../types/product"
import homeStyles from "../section/home/homeStyles"
import ProductItem from "../components/ProductItem"
import useProducts from "../hooks/useProducts"
import useUser from "../hooks/useUser"
import SearchBar from "../components/SearchBar"
import Announcement from "../components/Announcement"

const WIDTH = Dimensions.get("screen").width

type Props = MainScreenNavigationProp

const numColumns = 2

const Home = ({ navigation }: any) => {
  const { themeMode } = useThemeContext()

  const { products, fetchProducts, loading } = useProducts()
  const { getTopSellers } = useUser()

  const [sellers, setSellers] = useState<TopSellers[]>([])
  const [sellerLoading, setSellerLoading] = useState(false)
  const [sellerError, setSellerError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchProducts(`page=${currentPage}`)
  }, [])

  useEffect(() => {
    const fetchSellers = async () => {
      setSellerLoading(true)
      const res = await getTopSellers()
      if (typeof res === "string") {
        setSellerError(res)
      } else {
        setSellers(res)
      }

      setSellerLoading(false)
    }

    fetchSellers()
  }, [])

  const formatData = (data: IProduct[]) => {
    const isEven = data.length % numColumns === 0

    if (!isEven) {
      const empty = { ...data[0], empty: true }
      data.push(empty)
    }

    return data
  }

  const handleMore = () => {
    if (currentPage < products.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleSearch = (val: string) => {
    navigation.navigate("Search", { query: val })
  }

  const animatedValue = useRef(new Animated.Value(0)).current

  const searchAnimation = {
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 40],
          outputRange: [-15, 60],
          extrapolate: "clamp",
        }),
      },
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [0, -70],
          extrapolate: "clamp",
        }),
      },
    ],
    width: animatedValue.interpolate({
      inputRange: [0, 35],
      outputRange: [WIDTH, WIDTH - 150],
      extrapolate: "clamp",
    }),
    // height: animatedValue.interpolate({
    //   inputRange: [0, 35],
    //   outputRange: [55, 1],
    //   extrapolate: "clamp",
    // }),
  }

  const logoAnimation = {
    transform: [
      {
        scaleX: animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [1, 0],
          extrapolate: "clamp",
        }),
      },
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 25],
          outputRange: [5, -55],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 25],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
  }

  const logo2Animation = {
    transform: [
      {
        scaleX: animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [0, 1],
          extrapolate: "clamp",
        }),
      },
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 25],
          outputRange: [-55, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [15, 55],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  }

  // const headerAnimation = {
  //   transform: [
  //     {
  //       translateY: animatedValue.interpolate({
  //         inputRange: [0, 50],
  //         outputRange: [0, -20],
  //         extrapolate: "clamp",
  //       }),
  //     },
  //   ],
  // }

  return (
    <View>
      <Animated.View>
        <Announcement navigation={navigation} />
      </Animated.View>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Animated.Image
          source={{
            uri:
              themeMode === "dark"
                ? "https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif"
                : "https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif",
          }}
          style={[
            {
              width: WIDTH * 0.5,
              height: 40,
              objectFit: "contain",
            },
            logoAnimation,
          ]}
          alt="logo"
        />
        <Animated.Image
          source={{
            uri:
              themeMode === "dark"
                ? "https://res.cloudinary.com/emirace/image/upload/v1658136004/Reppedle_Black_ebqmot.gif"
                : "https://res.cloudinary.com/emirace/image/upload/v1658136003/Reppedle_White_d56cic.gif",
          }}
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              width: 60,
              marginLeft: 10,
              height: 60,
              resizeMode: "contain",
            },
            logo2Animation,
          ]}
        />
        <IconButton icon="cart" onPress={() => navigation.navigate("Cart")} />
      </Appbar.Header>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.bottomHeader,
            searchAnimation,
            { backgroundColor: "transparent" },
          ]}
        >
          <SearchBar onPress={handleSearch} />
        </Animated.View>
      </View>
      <FlatList
        data={formatData(products.products)}
        renderItem={({ item }) => (
          <RenderItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        contentContainerStyle={{ paddingBottom: 300 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <HomeContents
            seller={sellers}
            error={sellerError}
            isLoading={sellerLoading}
            navigation={navigation}
            products={products.products}
          />
        )}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y
          animatedValue.setValue(offsetY)
        }}
        scrollEventThrottle={16}
        onEndReached={handleMore}
        onEndReachedThreshold={0}
        ListFooterComponent={() => <Footer isLoading={loading} />}
      />
    </View>
  )
}

const RenderItem = ({
  item,
  navigation,
}: {
  item: IProduct & { empty?: boolean }
  navigation: MainScreenNavigationProp["navigation"]
}) => {
  let { itemStyles, invisible } = homeStyles

  if (item.empty) return <View style={[itemStyles, invisible]}></View>

  return (
    <View style={itemStyles}>
      <ProductItem
        navigate={(slug: string) => navigation.navigate("Product", { slug })}
        product={item}
      />
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
  bottomHeader: {
    // height: 1,
    paddingHorizontal: 10,
  },
})
