import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useState } from "react"
import MyButton from "../components/MyButton"
import { Appbar, Text, useTheme } from "react-native-paper"
import { CartNavigationProp } from "../types/navigation/stack"
import useCart from "../hooks/useCart"
import { checkDeliverySelect, currency, region } from "../utils/common"
import useAuth from "../hooks/useAuth"
import { Ionicons } from "@expo/vector-icons"
import { CartItem } from "../contexts/CartContext"
import QuantitySelector from "../components/QuantitySelector"
import DeliveryOptions from "../components/DeliveryOptions"
import CustomAlert from "../components/CustomAlert"
import { normaliseW } from "../utils/normalize"
import { baseURL } from "../services/api"
import WishlistIcon from "../components/ui/WishlistIcon"
import useToastNotification from "../hooks/useToastNotification"

type Props = CartNavigationProp

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const Cart = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { cart, subtotal, total } = useCart()
  const { addNotification } = useToastNotification()

  const checkout = () => {
    if (!user) {
      addNotification({ message: "Login to continue", error: true })
      navigation.push("Auth")
      return
    }
    if (!checkDeliverySelect(cart)) {
      addNotification({ message: "Select delivery method", error: true })
      return
    }
    if (cart.length === 0) {
      addNotification({ message: "Cart is empty", error: true })
    } else {
      if (user.isVerifiedEmail) {
        navigation.push("PaymentMethod")
      } else {
        navigation.push("PaymentMethod")
      }
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
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Cart" />
        {user ? (
          <Appbar.Content
            title={
              <WishlistIcon
                iconColor="white"
                onPress={() => navigation.push("Wishlist")}
              />
            }
          />
        ) : null}
      </Appbar.Header>
      <Text style={styles.description}>
        Placing an item in your shopping cart does not reserve that item or
        price. We only reserve the stock for your order once payment is
        received.
      </Text>
      {cart?.length === 0 ? (
        <View style={styles.continueCont}>
          <View style={styles.frsttext}>
            <Text>Cart is empty.</Text>
            <TouchableOpacity onPress={() => navigation.push("Main")}>
              <Text
                style={[styles.goShoppingText, { color: colors.secondary }]}
              >
                Go Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <RenderItem item={item} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            // style={styles.subContainer}
          />
          <View style={[styles.button, { backgroundColor: colors.background }]}>
            <View
              style={[
                styles.quantity,
                { borderColor: colors.elevation.level2 },
              ]}
            >
              <Text>Total:</Text>
              <Text style={[styles.offer]}>
                {currency(region())}
                {total}
              </Text>
            </View>
            <MyButton onPress={checkout} text="Checkout" icon="cart-outline" />
          </View>
        </>
      )}
    </View>
  )
}

export default Cart

type RenderProps = {
  navigation: CartNavigationProp["navigation"]
  item: CartItem
}

const RenderItem = ({ item, navigation }: RenderProps) => {
  const { colors } = useTheme()
  const { user, addToWishlist, error } = useAuth()
  const { removeFromCart } = useCart()
  const { addNotification } = useToastNotification()

  const [modalVisible, setModalVisible] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [addToWish, setAddToWish] = useState(false)

  const handleConfirm = async () => {
    // do something when Confirm button is pressed
    removeFromCart(item._id)
    setShowAlert(false)
  }

  const handleCancel = () => {
    // do something when Cancel button is pressed
    setShowAlert(false)
  }

  const saveItem = async () => {
    if (!user) {
      addNotification({ message: "login to add item to wishlist", error: true })
      return
    }
    if (item.seller._id === user._id) {
      addNotification({
        message: "You can't add your product to wishlist",
        error: true,
      })
      return
    }
    setAddToWish(true)

    const res = await addToWishlist(item._id)
    if (res) {
      addNotification({ message: res })
      removeFromCart(item._id)
      setShowAlert(false)
    } else
      addNotification({
        message: error ?? "Failed to add to wishlist",
        error: true,
      })

    setAddToWish(false)
  }

  return (
    <View
      style={{ backgroundColor: colors.elevation.level2, borderRadius: 15 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 10,
          marginTop: 10,
        }}
      >
        <Image
          source={{
            uri: baseURL + item.seller.image,
          }}
          style={[styles.image, { width: 30, height: 30, marginRight: 10 }]}
        />
        <Text
          onPress={() =>
            navigation.push("MyAccount", { username: item.seller.username })
          }
          style={{ color: colors.secondary }}
        >
          {item.seller.username}
        </Text>
      </View>
      <View style={[styles.item, { backgroundColor: colors.elevation.level2 }]}>
        <Image
          source={{ uri: baseURL + item.images[0] }}
          style={styles.image}
        />
        <View style={{ flex: 1, paddingLeft: 15 }}>
          <View style={styles.subRow}>
            <View style={styles.detail}>
              <Text numberOfLines={2} style={[styles.name]}>
                {item.name}
              </Text>
              <Text>{item.category}</Text>
            </View>
            <Text style={[styles.price, { color: colors.primary }]}>
              {currency(item.region)}
              {item.sellingPrice}
            </Text>
          </View>
          <View style={styles.subRow}>
            <QuantitySelector quantity={item.quantity} item={item} />
            <TouchableOpacity onPress={() => setShowAlert(true)}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
            <CustomAlert
              visible={showAlert}
              message="Are you sure you want to remove item from cart?"
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onWishlist={saveItem}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Delivery method</Text>
            <TouchableOpacity
              style={{ marginLeft: 20 }}
              onPress={() => setModalVisible(true)}
            >
              {item?.deliverySelect?.["delivery Option"] ? (
                <Text style={{ fontSize: 14, color: colors.secondary }}>
                  {item.deliverySelect["delivery Option"]}
                </Text>
              ) : (
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={colors.onBackground}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <DeliveryOptions item={item} setShowModel={setModalVisible} />
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontFamily: "absential-sans-bold",
    fontSize: 20,
    textTransform: "capitalize",
    color: "white",
  },
  // cartList: { marginTop: 5 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 15,
  },
  detail: {
    maxWidth: normaliseW(190),
  },
  name: {
    fontFamily: "absential-sans-bold",
    textTransform: "capitalize",
    fontSize: 15,
  },
  price: {
    fontWeight: "500",
    fontSize: 18,
    flex: 1,
    textAlign: "right",
    paddingLeft: 10,
  },
  description: {
    color: "grey",
    padding: 10,
    textAlign: "center",
    fontSize: 11,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: SCREEN_WIDTH,
  },
  goShoppingText: { fontFamily: "chronicle-text-bold", marginLeft: 5 },
  subContainer: { paddingHorizontal: 20 },
  quantity: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  greytext: {
    color: "grey",
    fontSize: 15,
    marginRight: 5,
  },
  offer: { fontSize: 16, fontFamily: "chronicle-text-bold" },
  continueCont: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frsttext: { justifyContent: "center", flexDirection: "row" },
  secondtext: { fontWeight: "500", fontSize: 15, color: "#8a1719" },
})
