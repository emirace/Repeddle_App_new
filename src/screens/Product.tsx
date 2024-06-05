import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Badge, Text, useTheme } from "react-native-paper"
import { normaliseH, normaliseW } from "../utils/normalize"
import { IProduct, RecentProduct } from "../types/product"
import ProductItem from "../components/ProductItem"
import { ProductNavigationProp } from "../types/navigation/stack"
import useProducts from "../hooks/useProducts"
import useAuth from "../hooks/useAuth"
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons"
import RebundlePoster from "../components/RebundlePoster"
import moment from "moment"
import {
  conditionDetails,
  currency,
  currentAddress,
  goto,
  region,
} from "../utils/common"
import Rating from "../components/Rating"
import MyButton from "../components/MyButton"
import ImageCarousel from "../components/ImageCarousel"
import RebundleLabel from "../components/RebundleLabel"
import CollapsibleSection from "../components/CollapsibleSection"
import useCart from "../hooks/useCart"
import ProductReview from "../components/ProductReview"
import CommentSection from "../components/CommentSection"
import SizeSelection from "../components/SizeSelection"
import useStore from "../hooks/useStore"

type Props = ProductNavigationProp

const Product = ({ navigation, route }: Props) => {
  const { colors } = useTheme()
  const { fetchProductBySlug, error, loading } = useProducts()
  const { cart, addToCart } = useCart()
  const { getRecently, storeRecently } = useStore()
  const { user } = useAuth()

  const { params } = route

  const [product, setProduct] = useState<IProduct>()
  const [recentlyViewed, setRecentlyViewed] = useState<RecentProduct[]>([])
  const [productError, setProductError] = useState("")
  const [size, setSize] = useState("")
  const [selectedSize, setSelectSize] = useState("")
  const [quantity1, setQuantity] = useState(1)
  const [modalProductReview, setModalProductReview] = useState(false)

  useEffect(() => {
    const fetchProd = async () => {
      setProductError("")
      const res = await fetchProductBySlug(params.slug)
      if (res) {
        setProduct(res)
        storeRecently(res)
      } else {
        setProductError(error)
      }
    }

    fetchProd()
  }, [])

  useEffect(() => {
    const getRecent = async () => {
      const data = await getRecently()

      setRecentlyViewed(data)
    }
  }, [])

  const isOnlineCon = (c: string) => {
    // if (onlineUser.length > 0) {
    //   let onlineUserList = [];
    //   onlineUser.map((o) => onlineUserList.push(o._id));
    //   if (onlineUserList.includes(c)) {
    //     return true;
    //   } else return false;
    // }

    return true
  }

  const animatedValue = useRef(new Animated.Value(0)).current

  const headerAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [600, 650],
          outputRange: [-40, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [600, 635],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  }

  const nameAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [600, 650],
          outputRange: [40, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [620, 640],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  }

  const discount = useMemo(() => {
    if (product)
      return (
        ((product.sellingPrice - (product?.costPrice ?? 0)) /
          product.sellingPrice) *
        100
      )

    return 0
  }, [])

  const sizeHandler = (item: string) => {
    if (!product) return
    const current = product.sizes.filter((s) => s.size === item)
    if (current.length > 0) {
      setSize(`${item} ( ${current[0].quantity} left)`)
      setSelectSize(item)
    } else {
      setSize("Out of stock")
      setSelectSize("")
    }
  }

  const addToCartHandler = async () => {
    if (!product) return

    const existItem = cart.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    if (!selectedSize && product.sizes.length > 0) {
      Alert.alert("Select Size")
      return
    }

    if (user && product.seller._id === user._id) {
      Alert.alert("You can't buy your product")
    }

    const data = await fetchProductBySlug(product.slug)
    if (data?.countInStock ?? 0 < quantity) {
      Alert.alert("Sorry. Product is out of stock")
      return
    }

    addToCart({
      ...product,
      quantity: 1,
      selectedSize,
      deliverySelect: {},
      // selectedColor?: string;
    })
  }

  const onShare = async () => {
    // const asset = Asset.fromModule(product.image)
    // await asset.downloadAsync()
    // try {
    //   await Sharing.shareAsync(product.image, {})
    // } catch (error) {}
  }
  const toggleLikes = async () => {}
  // TODO:
  const addConversation = async (id: string, id2: string) => {}

  const saveItem = async () => {}

  const liked = useMemo(
    () => !!product?.likes.find((x) => x === user?._id),
    [user, product]
  )

  const saved = useMemo(
    () => !!user?.wishlist.find((x) => x._id === product?._id),
    [user, product]
  )

  return !product && loading ? (
    <View style={styles.loading}>
      <ActivityIndicator size={"large"} color={colors.primary} />
    </View>
  ) : productError ? (
    <View style={styles.loading}>
      <Text style={{ color: colors.error }}>{productError}</Text>
    </View>
  ) : product ? (
    <View style={styles.container}>
      <RebundleLabel rebundle={product.seller?.rebundle} />
      <Animated.View
        style={[
          {
            elevation: 4,
            zIndex: 8,
          },
          headerAnimation,
        ]}
      >
        <View
          style={{
            height: 55,
            backgroundColor: colors.primary,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        />
      </Animated.View>

      <ScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y
          animatedValue.setValue(offsetY)
        }}
      >
        <View style={styles.love}>
          <ImageCarousel images={product.images} />

          <View style={styles.likesCont}>
            <TouchableOpacity
              onPress={() => toggleLikes()}
              style={styles.loveIcon}
            >
              <AntDesign
                name={liked ? "like1" : "like2"}
                size={18}
                color="red"
              />
            </TouchableOpacity>
            {product.likes.length ? (
              <View style={styles.badge1}>
                <Badge theme={{ colors: { background: "red" } }}>
                  {product.likes.length}
                </Badge>
              </View>
            ) : null}
          </View>

          <TouchableOpacity onPress={onShare} style={styles.share}>
            <Ionicons size={20} color={"black"} name="share-social-outline" />
            {product.shares.length ? (
              <Text
                style={[
                  styles.shareCount,
                  { backgroundColor: "red", color: "white" },
                ]}
              >
                {product.shares.length}
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          {product?.seller?.rebundle?.status && (
            <View style={{ marginTop: 10 }}>
              <RebundlePoster />
            </View>
          )}

          <View style={styles.titleCont}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.title]} numberOfLines={1}>
                {product.name}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setModalProductReview(true)}
              style={styles.rating}
            >
              <FontAwesome name="star" size={18} color={colors.primary} />
              <Text style={[styles.ratingText]}>{product.rating}</Text>
              <Text style={styles.ratingCount}>
                ({product.reviews.length} reviews)
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalProductReview}
            onRequestClose={() => {
              setModalProductReview(!modalProductReview)
            }}
          >
            <ProductReview
              product={product}
              setModalProductReview={setModalProductReview}
            />
          </Modal>

          <Text style={styles.description}>{product.description}</Text>

          <Text style={{ marginVertical: 5, textAlign: "left" }}>
            Listed {moment(product.createdAt).fromNow()}
          </Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.sectionTitle]}>Overview</Text>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: normaliseW(10),
                backgroundColor: colors.elevation.level2,
                padding: normaliseW(15),
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.leftname]}>price:</Text>
                <Text style={[styles.leftname]}>brand:</Text>
                <Text style={[styles.leftname]}>category:</Text>
                <Text style={[styles.leftname]}>subCategory:</Text>
                <Text style={[styles.leftname]}>color:</Text>
                <Text style={[styles.leftname]}>Stock:</Text>
              </View>
              <View style={{ flex: 2 }}>
                <View style={styles.priceCont}>
                  <Text style={styles.offer}>
                    {currency(product.region)}
                    {product.sellingPrice}
                  </Text>
                  <Text style={styles.price}>
                    {product.costPrice !== product.sellingPrice
                      ? currency(product.region) + product.costPrice
                      : ""}
                  </Text>
                  {discount ? (
                    <Text style={styles.discount}>
                      (-{discount.toFixed(0)}%)
                    </Text>
                  ) : null}
                </View>
                <Text style={{ padding: 2 }}>{product.brand}</Text>
                <Text style={{ padding: 2 }}>{product.mainCategory}</Text>
                <Text style={{ padding: 2 }}>{product.category}</Text>
                <Text style={{ padding: 2 }}>{product.color}</Text>
                <Text style={{ padding: 2 }}>{product.countInStock}</Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.section,
              { flexDirection: "row", gap: 8, flexWrap: "wrap" },
            ]}
          >
            <Text>Tags:</Text>
            {product.tags.map((t) => (
              <Text
                onPress={() => navigation.navigate("Search", { query: t })}
                style={[styles.tag, { borderColor: colors.onBackground }]}
              >
                {t}
              </Text>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle]}>Seller info</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                width: "100%",
                paddingRight: 20,
              }}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: product.seller.image }}
                  style={styles.userImage}
                />
                {product.seller.badge && (
                  <View
                    style={{
                      right: 15,
                      bottom: 0,
                      position: "absolute",
                    }}
                  >
                    <Image
                      style={styles.badgeVip}
                      src="https://res.cloudinary.com/emirace/image/upload/v1661148671/Icons-28_hfzerc.png"
                    />
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("MyAccount", {
                          username: product.seller.username,
                        })
                      }
                    >
                      <Text
                        style={{
                          color: colors.secondary,
                          fontWeight: "bold",
                          fontSize: 15,
                        }}
                      >
                        @{product.seller.username}
                      </Text>
                    </TouchableOpacity>
                    <Text>
                      {product.seller?.address?.state},
                      {product.seller.region === "NGN"
                        ? "Nigeria"
                        : "South Africa"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      addConversation(product.seller._id, product._id)
                    }
                  >
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={24}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("SellerReview", {
                      userId: product.seller._id,
                    })
                  }
                >
                  <Rating
                    rating={product.seller.rating ?? 0}
                    numReviews={product.seller.numReviews}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 5,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="pricetag"
                      size={15}
                      color={colors.primary}
                      style={{ marginRight: 5 }}
                    />
                    <Text>{product.seller.sold.length} Sold</Text>
                  </View>
                  {isOnlineCon(product.seller._id) ? (
                    <View
                      style={[styles.online, { borderColor: colors.primary }]}
                    >
                      <Text style={{ color: colors.primary }}>online</Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.offline,
                        { borderColor: colors.secondary },
                      ]}
                    >
                      <Text style={{ color: colors.secondary }}>offline</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {product.sizes.length > 0 && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle]}>item size</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ marginRight: 10 }}>Select size:</Text>
                  <Text>{size}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {product.sizes.map(
                  (size) =>
                    size.quantity > 0 && (
                      <SizeSelection
                        key={size.size}
                        selectedSize={selectedSize}
                        symbol={size.size}
                        sizeHandler={sizeHandler}
                      />
                    )
                )}

                <Pressable
                  onPress={() => navigation.navigate("SizeChart")}
                  style={{ marginLeft: 20 }}
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                    }}
                  >
                    size chart{" "}
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          <CollapsibleSection title="Condition">
            <View style={{}}>
              <Text
                style={[
                  styles.description,
                  {
                    color: "white",
                    // marginTop: 10,
                    backgroundColor: colors.secondary,
                    borderRadius: 5,
                    textAlign: "center",
                  },
                ]}
              >
                {product.condition}
              </Text>
              <Text style={styles.description}>
                {conditionDetails(product.condition)}
              </Text>
            </View>
          </CollapsibleSection>

          {product.specification && (
            <CollapsibleSection title="Specification">
              <Text style={styles.description}>{product.specification}</Text>
            </CollapsibleSection>
          )}

          {product.keyFeatures && (
            <CollapsibleSection title="Key Features">
              <Text style={styles.description}>{product.keyFeatures}</Text>
            </CollapsibleSection>
          )}

          {/* TODO:  */}
          {/* <CollapsibleSection title="Shipping Location">
            <Text style={styles.description}>{product.shippingLocation}</Text>
          </CollapsibleSection> */}

          <TouchableOpacity
            onPress={() => navigation.navigate("BuyersProtection")}
            style={[
              styles.protection,
              { backgroundColor: colors.elevation.level3 },
            ]}
          >
            <Ionicons name="shield" size={24} color={colors.primary} />
            <Text style={{ marginLeft: 10 }}>
              Buyer's & Seller's Protection !
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sustain}>
          <Text style={[styles.sustainHeader]}>
            REPEDDLE SUSTAINABILITY IMPACT
          </Text>
          <View>
            <Text style={{ marginBottom: 10 }}>
              Save our environment (AFRICA) and planet from Landfill, Water
              pollution and Carbon Emission.
            </Text>
            <Text style={{ marginBottom: 10 }}>
              We advocate for{" "}
              <Text style={{ fontWeight: "bold" }}>clean air</Text>,{" "}
              <Text style={{ fontWeight: "bold" }}>clean water</Text> and a
              <Text style={{ fontWeight: "bold" }}> clean environment</Text>.
              These are not too much to ask; these are common basic living
              condition!!!
            </Text>
            <Text style={{ marginBottom: 10 }}>
              By buying and{" "}
              <Text
                onPress={() => navigation.navigate("Sell")}
                style={{
                  textDecorationLine: "underline",
                  color: colors.secondary,
                }}
              >
                selling
              </Text>{" "}
              secondhand item on Repeddle, you’re not only reducing carbon
              footprint and saving the planet, but you are giving an African
              Child a better hope for tomorrow. Learn more on our sustainability
              take{" "}
              <Text
                onPress={() =>
                  goto(`${currentAddress(region())}/sustainability`)
                }
                style={{
                  textDecorationLine: "underline",
                  color: colors.secondary,
                }}
              >
                here.
              </Text>
            </Text>
          </View>
          <Text style={[styles.sustainHeader]}>
            POSITIVE IMPACT OF USING SECONDHAND CLOTHES
          </Text>
          <View style={styles.sustainCont}>
            <View style={{ flex: 1, marginTop: 4 }}>
              <FontAwesome5
                name={"water"}
                size={15}
                color={colors.onBackground}
              />
            </View>
            <Text style={{ flex: 9 }}>
              <Text style={styles.sustainbold}>2,700L</Text> of water saved for
              one person to drink for 900 days.
            </Text>
          </View>
          <View style={styles.sustainCont}>
            <View style={{ flex: 1, marginTop: 4 }}>
              <FontAwesome5
                name={"cloud"}
                size={15}
                color={colors.onBackground}
              />
            </View>
            <Text style={{ flex: 9 }}>
              <Text style={styles.sustainbold}>10%</Text> co2 of global carbon
              emissions avoided.
            </Text>
          </View>
          <View style={styles.sustainCont}>
            <View style={{ flex: 1, marginTop: 4 }}>
              <FontAwesome5
                name={"lightbulb"}
                size={15}
                color={colors.onBackground}
              />
            </View>
            <Text style={{ flex: 9 }}>
              <Text style={styles.sustainbold}>98%</Text> Chance of clothes
              ending up in landfills avoided.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <FlatList
            data={recentlyViewed}
            renderItem={({ item }) => (
              <RenderItem item={item} navigation={navigation} />
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.productId}
            horizontal
          />
        </View>

        <CommentSection product={product} />
      </ScrollView>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.back, { backgroundColor: colors.elevation.level2 }]}
        >
          <FontAwesome
            name="angle-left"
            size={18}
            color={colors.onBackground}
          />
        </TouchableOpacity>
        <Animated.Text
          style={[
            {
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "capitalize",
              color: "white",
            },
            nameAnimation,
          ]}
        >
          {product.name}
        </Animated.Text>
        <TouchableOpacity
          style={[styles.like, { backgroundColor: colors.elevation.level2 }]}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={24} color={colors.onBackground} />

          {cart.length > 0 && (
            <View style={styles.badge}>
              <Badge
                theme={{ colors: { background: "red" } }}
                children={cart.length}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.addCartSection,
          { borderTopColor: colors.elevation.level3, borderTopWidth: 1 },
        ]}
      >
        <View style={styles.sub}>
          <View style={styles.quantity}></View>
          <View style={styles.quantity}>
            <Text style={styles.greytext}>Total</Text>
            <Text style={styles.offer}>
              {currency(product.region)}
              {quantity1 * product.sellingPrice}
            </Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={saveItem}
            style={[styles.saved, { backgroundColor: colors.onBackground }]}
          >
            <Ionicons
              size={25}
              color={saved ? colors.primary : colors.background}
              name={saved ? "heart" : "heart-outline"}
            />
          </TouchableOpacity>
          <View style={styles.button}>
            <MyButton
              onPress={addToCartHandler}
              text={product.countInStock > 0 ? "add to cart" : "Sold out"}
              icon={
                product.countInStock > 0
                  ? "cart-outline"
                  : "alert-circle-outline"
              }
              disable={product.countInStock <= 0}
            />
          </View>
        </View>
      </View>
    </View>
  ) : null
}

const RenderItem = ({
  item,
  navigation,
}: {
  item: RecentProduct
  navigation: ProductNavigationProp["navigation"]
}) => {
  let { itemStyles } = styles

  return (
    <View style={itemStyles}>
      <ProductItem
        navigate={(slug: string) => navigation.navigate("Product", { slug })}
        product={item.product}
      />
    </View>
  )
}

export default Product

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  back: {
    width: normaliseW(40),
    height: normaliseW(40),
    backgroundColor: "white",
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { height: 450 },
  details: { paddingHorizontal: 20 },
  titleCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: { flexDirection: "row", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 10,
    textTransform: "capitalize",
    marginRight: normaliseW(10),
  },
  ratingText: { fontSize: 15, marginHorizontal: 5, fontWeight: "bold" },
  ratingCount: { color: "grey" },
  description: { marginBottom: 5, marginHorizontal: 7, color: "grey" },
  section: { marginVertical: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  sizes: { flexDirection: "row", marginBottom: 10 },
  circle: {
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  circletext: {
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  priceCont: {
    flex: 1,
    flexDirection: "row",
  },
  price: {
    fontWeight: "normal",
    textDecorationLine: "line-through",
    color: "grey",
  },
  offer: {
    fontWeight: "bold",
    marginRight: normaliseW(10),
  },
  addCartSection: {
    paddingVertical: normaliseH(15),
    paddingHorizontal: normaliseW(20),
  },
  sub: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quantity: {
    flexDirection: "row",
    marginBottom: normaliseH(15),
    alignItems: "center",
  },
  greytext: {
    color: "grey",
    fontSize: 15,
    marginRight: normaliseW(5),
  },
  like: {
    width: normaliseW(40),
    height: normaliseW(40),
    backgroundColor: "white",
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  love: {
    position: "relative",
  },
  likesCont: {
    position: "absolute",
    bottom: 40,
    right: 10,
  },
  loveIcon: {
    width: normaliseW(40),
    height: normaliseW(40),
    backgroundColor: "white",
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: { position: "absolute", top: 5, right: 5 },
  badge1: { position: "absolute", top: "50%", right: "90%" },
  commentSection: { flex: 1, height: 500 },
  leftname: { fontWeight: "500", textTransform: "capitalize", padding: 2 },
  protection: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttons: { flexDirection: "row" },
  saved: {
    marginRight: 15,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 30,
    alignSelf: "center",
    padding: 10,
  },
  button: { flex: 1 },
  userImage: { width: 50, height: 50, borderRadius: 50, marginRight: 20 },
  badgeVip: { width: 20, height: 20, resizeMode: "contain" },
  online: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  offline: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  sustain: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
  sustainHeader: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  sustainCont: {
    flexDirection: "row",
    alignItems: "flex-start",
    fontSize: 14,
  },

  sustainbold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  share: {
    position: "absolute",
    bottom: 40,
    left: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
  },
  tag: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  itemStyles: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 10,
    height: 300,
    borderRadius: 15,
  },
  discount: {
    color: "#555",
    marginLeft: 10,
  },
  shareCount: {
    position: "absolute",
    bottom: 2,
    right: -8,
    width: 15,
    height: 15,
    borderRadius: 50,
    textAlign: "center",
    fontSize: 11,
  },
})
