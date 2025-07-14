import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Share,
  KeyboardAvoidingView,
} from "react-native"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Badge,
  Button,
  Chip,
  Icon,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper"
import { normaliseH, normaliseW } from "../utils/normalize"
import { IProduct, RecentlyViewed } from "../types/product"
import ProductItem from "../components/ProductItem"
import { ProductNavigationProp } from "../types/navigation/stack"
import useProducts from "../hooks/useProducts"
import useAuth from "../hooks/useAuth"
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons"
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
import ImageCarousel from "../components/ImageCarousel"
import RebundleLabel from "../components/RebundleLabel"
import CollapsibleSection from "../components/CollapsibleSection"
import useCart from "../hooks/useCart"
import ProductReview from "../components/ProductReview"
import CommentSection from "../components/CommentSection"
import SizeSelection from "../components/SizeSelection"
import useStore from "../hooks/useStore"
import { baseURL, frontendURL } from "../services/api"
import { Asset } from "expo-asset"
import * as Sharing from "expo-sharing"
import Loader from "../components/ui/Loader"
import CartIcon from "../components/ui/cartIcon"
import useToastNotification from "../hooks/useToastNotification"
import useMessage from "../hooks/useMessage"
import useUser from "../hooks/useUser"
import Report from "../components/Report"
import FlagAsInvalid from "../components/FlagAsInvalid"

type Props = ProductNavigationProp

const Product = ({ navigation, route }: Props) => {
  const { colors } = useTheme()
  const {
    fetchProductBySlug,
    error,
    likeProduct,
    unlikeProduct,
    addProductShareCount,
    addProductViewCount,
  } = useProducts()
  const { createMessage, error: messageError } = useMessage()
  const { cart, addToCart } = useCart()
  const { getRecently, storeRecently } = useStore()
  const {
    user,
    addToWishlist,
    error: wishListError,
    removeFromWishlist,
  } = useAuth()
  const { addNotification } = useToastNotification()
  const { isOnline } = useUser()

  const { params } = route

  const [product, setProduct] = useState<IProduct>()
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewed[]>([])
  const [productError, setProductError] = useState("")
  const [size, setSize] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectSize] = useState("")
  const [quantity1, setQuantity] = useState(1)
  const [modalProductReview, setModalProductReview] = useState(false)
  const [liking, setLiking] = useState(false)
  const [addToWish, setAddToWish] = useState(false)
  const [adding, setAdding] = useState(false)
  const [messageLoading, setMessageLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showFlagAsInvalid, setShowFlagAsInvalid] = useState(false)

  useEffect(() => {
    const fetchProd = async () => {
      setProductError("")
      const res = await fetchProductBySlug(params.slug)
      console.log("Product", res)
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
    if (product) {
      addProductViewCount(product._id)
    }
  }, [product])

  useEffect(() => {
    const getRecent = async () => {
      const data = await getRecently()

      setRecentlyViewed(data)
    }

    getRecent()
  }, [])

  const changeProduct = (val: IProduct) => {
    setProduct(val)
  }

  const animatedValue = useRef(new Animated.Value(0)).current

  const headerAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [600, 650],
          outputRange: [-100, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [600, 635],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    // height: animatedValue.interpolate({
    //   inputRange: [600, 650],
    //   outputRange: [0, 55],
    //   extrapolate: "clamp",
    // }),
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
    if (!product?.costPrice || product.sellingPrice) {
      return null
    }
    if (product.costPrice < product.sellingPrice) {
      return null
    }

    return (
      ((product.costPrice - product.sellingPrice) / product.costPrice) * 100
    )
  }, [product?.costPrice, product?.sellingPrice])

  const sizeHandler = (item: string) => {
    const current = product?.sizes.filter((s) => s.size === item) ?? []
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

    setAdding(true)

    const existItem = cart.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    if (!selectedSize && product.sizes.length > 0) {
      addNotification({ message: "Select Size", error: true })
      return setAdding(false)
    }

    if (user && product.seller._id === user._id) {
      addNotification({ message: "You can't buy your product", error: true })
      return setAdding(false)
    }

    const data = await fetchProductBySlug(product.slug)
    if (!data?.countInStock || data?.countInStock < quantity) {
      addNotification({
        message: "Sorry. Product is out of stock",
        error: true,
      })
      return setAdding(false)
    }

    addNotification({ message: "item added to cart" })

    addToCart({
      ...product,
      quantity,
      selectedSize,
      // selectedColor?: string;
    })

    setAdding(false)
  }

  const onShare = async () => {
    if (!product) return

    try {
      Share.share({
        message:
          `See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items!\n\n` +
          `Repeddle: ${frontendURL}product/${product.slug}`,
        title: "Repeddle",
        url: `${frontendURL}product/${product.slug}`,
      })
      if (user) {
        await addProductShareCount(product._id, user._id)
      }
    } catch (error) {}
  }

  const toggleLikes = async () => {
    if (!user) {
      addNotification({ message: "Sign in /  Sign Up to like", error: true })
      return
    }

    if (!product) return

    if (product.seller._id === user._id) {
      addNotification({ message: "You can't like your product", error: true })
      return
    }

    setLiking(true)

    if (liked) {
      const res = await unlikeProduct(product._id)
      if (res) {
        const newProd = product
        newProd.likes = res.likes
        setProduct(newProd)
        addNotification({ message: res.message })
      } else addNotification({ message: error, error: true })
    } else {
      const res = await likeProduct(product._id)
      if (res) {
        const newProd = product
        newProd.likes = res.likes
        setProduct(newProd)
        addNotification({ message: res.message })
      } else addNotification({ message: error, error: true })
    }

    setLiking(false)
  }

  // TODO:
  const addConversation = async () => {
    if (!user) {
      addNotification({ message: "Login to chat user", error: true })
      return
    }
    if (!product?.seller._id) return

    setMessageLoading(true)

    try {
      const convo = await createMessage({
        participantId: product.seller._id,
        type: "Chat",
      })
      console.log(convo)

      navigation.push("Chat", { conversationId: convo._id })
    } catch (error) {
      addNotification({
        message: messageError || (error as string),
        error: true,
      })
    }

    setMessageLoading(false)
  }

  const saveItem = async () => {
    if (!product) return

    if (!user) {
      addNotification({
        message: "Sign In/ Sign Up to add an item to wishlist",
        error: true,
      })
      return
    }

    if (product.seller._id === user._id) {
      addNotification({
        message: "You can't add your product to wishlist",
        error: true,
      })
      return
    }

    setAddToWish(true)
    if (saved) {
      const res = await removeFromWishlist(product._id)
      if (res) addNotification({ message: res })
      else
        addNotification({
          message: wishListError || "Failed to remove from wishlist",
          error: true,
        })
    } else {
      const res = await addToWishlist(product._id)
      if (res) addNotification({ message: res })
      else
        addNotification({
          message: wishListError || "Failed to add to wishlist",
          error: true,
        })
    }

    setAddToWish(false)
  }

  const liked = useMemo(() => {
    return !!product?.likes.find((like) => like === user?._id)
  }, [product?.likes, user?._id])

  const saved = useMemo(() => {
    return !!(user?.wishlist && user.wishlist.find((x) => x === product?._id))
  }, [product, user])

  return !product && loading ? (
    <Loader />
  ) : productError ? (
    <View style={styles.loading}>
      <Text style={{ color: colors.error }}>{productError}</Text>
    </View>
  ) : product ? (
    <KeyboardAvoidingView
      behavior="padding"
      // keyboardVerticalOffset={200}
      style={styles.container}
    >
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
            height: 100,
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
              disabled={liking}
            >
              <IconButton
                icon={liked ? "thumb-up" : "thumb-up-outline"}
                iconColor="red"
              />
            </TouchableOpacity>
            {product.likes.length ? (
              <View style={styles.badge}>
                <Badge theme={{ colors: { background: "red" } }}>
                  {product.likes.length}
                </Badge>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={onShare}
            style={[styles.share, { backgroundColor: colors.elevation.level2 }]}
          >
            <IconButton icon="share-variant" />

            {product.shares.length ? (
              <View style={styles.badge}>
                <Badge
                  theme={{ colors: { background: "red" } }}
                  children={product.shares.length}
                />
              </View>
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
              <Text
                style={[styles.title]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={{ marginVertical: 5, textAlign: "left" }}>
                {product?.viewcount?.length}
              </Text>
              <Icon source="eye" size={16} color={colors.primary} />
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text style={{ marginVertical: 5, textAlign: "left" }}>
                {product?.buyers?.length}
              </Text>
              <Text style={{ marginVertical: 5, textAlign: "left" }}>Sold</Text>
            </View>
          </View>
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
                <Text style={{ padding: 2 }}>{product.color?.join(", ")}</Text>
                <Text style={{ padding: 2 }}>{product.countInStock}</Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.section,
              {
                flexDirection: "row",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              },
            ]}
          >
            <Text>Tags:</Text>
            {product.tags.map((t, index) => (
              <Chip
                key={index}
                icon="tag"
                mode="outlined"
                textStyle={{ color: colors.primary }}
                style={{ borderColor: colors.primary }}
                onPress={() => navigation.push("Search", { query: t })}
              >
                {t}
              </Chip>
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
                  source={{ uri: baseURL + product.seller.image }}
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
                        navigation.push("MyAccount", {
                          username: product.seller.username,
                        })
                      }
                    >
                      <Text
                        style={{
                          color: colors.secondary,
                          fontFamily: "chronicle-text-bold",
                          fontSize: 15,
                        }}
                      >
                        @{product.seller.username}
                      </Text>
                    </TouchableOpacity>
                    <Text>
                      {product.seller?.address?.state},
                      {product.region === "NG" ? "Nigeria" : "South Africa"}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={addConversation}>
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={24}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("SellerReview", {
                      username: product.seller.username,
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
                  {isOnline(product.seller._id) ? (
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
                  (size, index) =>
                    size.quantity > 0 && (
                      <SizeSelection
                        key={index}
                        selectedSize={selectedSize}
                        symbol={size.size}
                        sizeHandler={sizeHandler}
                      />
                    )
                )}

                <Pressable
                  onPress={() => navigation.push("SizeChart")}
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
            onPress={() => navigation.push("BuyersProtection")}
            style={[
              styles.protection,
              {
                backgroundColor: colors.elevation.level3,
              },
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
              <Text style={{ fontFamily: "chronicle-text-bold" }}>
                clean air
              </Text>
              ,{" "}
              <Text style={{ fontFamily: "chronicle-text-bold" }}>
                clean water
              </Text>{" "}
              and a
              <Text style={{ fontFamily: "chronicle-text-bold" }}>
                {" "}
                clean environment
              </Text>
              . These are not too much to ask; these are common basic living
              condition!!!
            </Text>
            <Text style={{ marginBottom: 10 }}>
              By buying and{" "}
              <Text
                onPress={() => navigation.push("Sell")}
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            {user && user.role === "Admin" ? (
              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexDirection: "row",
                  gap: 5,
                }}
                onPress={() => setShowFlagAsInvalid(true)}
              >
                <Ionicons name="flag" size={15} color={colors.secondary} />
                <Text
                  style={{
                    color: colors.secondary,
                    textDecorationLine: "underline",
                  }}
                >
                  Flag As Invalid
                </Text>
              </TouchableOpacity>
            ) : null}
            <Pressable onPress={() => setShowReport(true)}>
              <Text style={{ color: colors.secondary, textAlign: "right" }}>
                Report Item
              </Text>
            </Pressable>
          </View>
        </View>

        <Report
          reportItem={{
            id: product._id,
            image: product.images[0],
            name: product.name,
          }}
          refs="product"
          setShowModel={setShowReport}
          showModel={showReport}
        />
        <FlagAsInvalid
          reportItem={{
            id: product._id,
            image: product.images[0],
            name: product.name,
          }}
          setShowModel={setShowFlagAsInvalid}
          showModel={showFlagAsInvalid}
        />
        <Text style={styles.recentText}>Recently Viewed</Text>
        <View style={styles.section}>
          <FlatList
            data={recentlyViewed}
            renderItem={({ item }) => (
              <View style={{ width: 175 }}>
                <RenderItem item={item} navigation={navigation} />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.productId}
            horizontal
          />
        </View>

        <CommentSection setProduct={changeProduct} product={product} />
      </ScrollView>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.back, { backgroundColor: colors.elevation.level2 }]}
        >
          <IconButton icon="chevron-left" />
        </TouchableOpacity>
        <Animated.Text
          style={[
            {
              fontSize: 20,
              fontFamily: "absential-sans-bold",
              textTransform: "capitalize",
              color: "white",
              textAlign: "center",
            },
            nameAnimation,
          ]}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {product.name}
        </Animated.Text>
        <TouchableOpacity
          style={[
            styles.like,
            {
              backgroundColor: colors.elevation.level2,
            },
          ]}
        >
          <CartIcon onPress={() => navigation.push("Cart")} />
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
            disabled={addToWish}
          >
            <IconButton
              icon={saved ? "cards-heart" : "cards-heart-outline"}
              iconColor={saved ? colors.primary : colors.background}
              size={25}
              style={{ margin: 0 }}
            />
          </TouchableOpacity>
          <View style={styles.button}>
            <Button
              onPress={addToCartHandler}
              children={
                product.sold || !(product.countInStock > 0)
                  ? "Sold out"
                  : "Add to cart"
              }
              icon={
                product.sold || !(product.countInStock > 0)
                  ? "cart-off"
                  : "cart-outline"
              }
              disabled={product.sold || !(product.countInStock > 0) || adding}
              mode="contained"
              style={{ paddingVertical: 8, borderRadius: 5 }}
              labelStyle={{ fontSize: 16, color: "white" }}
              loading={adding}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  ) : null
}

const RenderItem = ({
  item,
  navigation,
}: {
  item: RecentlyViewed
  navigation: ProductNavigationProp["navigation"]
}) => {
  let { itemStyles } = styles

  return (
    <View style={itemStyles}>
      <ProductItem
        navigate={(slug: string) => navigation.push("Product", { slug })}
        product={item.product}
      />
    </View>
  )
}

export default Product

const { width } = Dimensions.get("screen")

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
    top: normaliseH(35),
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
  details: { paddingHorizontal: 15 },
  titleCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width - normaliseW(106),
  },
  rating: { flexDirection: "row", alignItems: "center" },
  title: {
    fontSize: 20,
    fontFamily: "absential-sans-bold",
    paddingVertical: 10,
    textTransform: "capitalize",
    marginRight: normaliseW(10),
  },
  recentText: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    fontFamily: "absential-sans-bold",
  },
  ratingText: {
    fontSize: 15,
    marginHorizontal: 5,
    fontFamily: "absential-sans-bold",
  },
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
    fontFamily: "chronicle-text-bold",
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
    fontFamily: "chronicle-text-bold",
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
    borderRadius: 50,
    // overflow: "hidden",
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
  badge: { position: "absolute", top: 0, right: 0 },
  badge1: { position: "absolute", top: "50%", right: "90%" },
  commentSection: { flex: 1, height: 500 },
  leftname: { fontWeight: "500", textTransform: "capitalize", padding: 2 },
  protection: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: { flexDirection: "row" },
  saved: {
    marginRight: 15,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 30,
    alignSelf: "center",
    padding: 2,
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
    fontFamily: "absential-sans-bold",
  },

  sustainCont: {
    flexDirection: "row",
    alignItems: "flex-start",
    fontSize: 14,
  },

  sustainbold: {
    fontSize: 16,
    fontFamily: "chronicle-text-bold",
  },
  share: {
    position: "absolute",
    bottom: 40,
    left: 15,
    borderRadius: 50,
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
