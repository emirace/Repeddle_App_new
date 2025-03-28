import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Appbar,
  configureFonts,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  Portal,
  Provider,
  useTheme,
} from "react-native-paper";
import useThemeContext from "../hooks/useTheme";
import { MainScreenNavigationProp } from "../types/navigation/stack";
import { TopSellers } from "../types/user";
import HomeContents from "../section/home/HomeContents";
import { IProduct, ProductWithPagination } from "../types/product";
import homeStyles from "../section/home/homeStyles";
import ProductItem from "../components/ProductItem";
import useProducts from "../hooks/useProducts";
import useUser from "../hooks/useUser";
import SearchBar from "../components/SearchBar";
import Announcement from "../components/Announcement";
import CartIcon from "../components/ui/cartIcon";
import useToastNotification from "../hooks/useToastNotification";

const WIDTH = Dimensions.get("screen").width;

const numColumns = 2;

const Home = ({ navigation }: any) => {
  const { themeMode } = useThemeContext();

  const { colors } = useTheme();
  const { addNotification } = useToastNotification();

  const { fetchProducts, loading } = useProducts();
  const { getTopSellers } = useUser();

  const [products, setProducts] = useState<ProductWithPagination>({
    currentPage: 0,
    products: [],
    totalCount: 0,
    totalPages: 0,
  });
  const [sellers, setSellers] = useState<TopSellers[]>([]);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchProducts(`page=${currentPage}`);

      if (typeof res !== "string") {
        const newData = res;

        const allProducts = [...products.products, ...newData.products];
        newData.products = [
          ...new Map(allProducts.map((item) => [item._id, item])).values(),
        ];
        setProducts(newData);
      } else {
        addNotification({ message: res, error: true });
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const fetchSellers = async () => {
      setSellerLoading(true);
      const res = await getTopSellers();
      if (typeof res === "string") {
        setSellerError(res);
      } else {
        setSellers(res.sellers);
      }

      setSellerLoading(false);
    };

    fetchSellers();
  }, []);

  const formatData = (data: IProduct[]) => {
    const isEven = data.length % numColumns === 0;

    if (!isEven) {
      const empty = { ...data[0], empty: true };
      data.push(empty);
    }

    return data;
  };

  const handleMore = () => {
    if (currentPage < products.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (val: string) => {
    navigation.push("Search", { query: val });
  };

  const animatedValue = useRef(new Animated.Value(0)).current;

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
          outputRange: [0, -65],
          extrapolate: "clamp",
        }),
      },
    ],
    width: animatedValue.interpolate({
      inputRange: [0, 35],
      outputRange: [WIDTH, WIDTH - 180],
      extrapolate: "clamp",
    }),
    // height: animatedValue.interpolate({
    //   inputRange: [0, 35],
    //   outputRange: [55, 1],
    //   extrapolate: "clamp",
    // }),
  };

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
  };

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
  };

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
      <Appbar.Header
        mode="small"
        style={{
          zIndex: 20,
          paddingTop: 20,
          paddingHorizontal: 0,
        }}
      >
        <View>
          <Announcement navigation={navigation} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 10,
              marginTop: 18,
            }}
          >
            {/* <Animated.Image
              source={{
                uri:
                  themeMode !== "dark"
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
            /> */}
            <Image
              source={{
                uri:
                  themeMode === "dark"
                    ? "https://res.cloudinary.com/emirace/image/upload/v1658136003/Reppedle_White_d56cic.gif"
                    : "https://res.cloudinary.com/emirace/image/upload/v1658136004/Reppedle_Black_ebqmot.gif",
              }}
              style={[
                {
                  width: 60,
                  resizeMode: "contain",
                  height: 60,
                  marginHorizontal: 4,
                },
              ]}
            />
            <View style={{ flex: 1 }}>
              <SearchBar onPress={handleSearch} />
            </View>
            <View style={{ flexDirection: "row", marginRight: 6 }}>
              <IconButton
                onPress={() => navigation.push("Notification")}
                icon="bell-outline"
                iconColor={colors.onBackground}
              />

              <CartIcon
                iconColor={colors.onBackground}
                onPress={() => navigation.push("Cart")}
              />
            </View>
          </View>
        </View>
      </Appbar.Header>

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
        scrollEventThrottle={16}
        onEndReached={handleMore}
        onEndReachedThreshold={0}
        ListFooterComponent={() => <Footer isLoading={loading} />}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

const RenderItem = ({
  item,
  navigation,
}: {
  item: IProduct & { empty?: boolean };
  navigation: MainScreenNavigationProp["navigation"];
}) => {
  let { itemStyles, invisible } = homeStyles;

  if (item.empty) return <View style={[itemStyles, invisible]}></View>;

  return (
    <View style={itemStyles}>
      <ProductItem
        navigate={(slug: string) => navigation.push("Product", { slug })}
        product={item}
      />
    </View>
  );
};

const Footer = ({ isLoading }: { isLoading?: boolean }) => {
  const { colors } = useTheme();

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
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // ...StyleSheet.absoluteFillObject,
    // paddingHorizontal: 20,
    // zIndex: 20000000000,
    // position: "absolute",
    // top: 120,
  },
  bottomHeader: {
    // height: 1,
    paddingHorizontal: 10,
  },
});
