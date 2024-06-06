import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useMemo, useState } from "react"
import { Appbar, Text, useTheme } from "react-native-paper"
import useCart from "../hooks/useCart"
import { CheckoutNavigationProp } from "../types/navigation/stack"
import { API_KEY } from "../utils/constants"
import {
  couponDiscount,
  currency,
  generateTransactionRef,
  region,
} from "../utils/common"
import useAuth from "../hooks/useAuth"
import { Ionicons } from "@expo/vector-icons"
import PayWithFlutterwave from "flutterwave-react-native"
import Payfast from "../components/paymentMethod/Payfast"
import useOrder from "../hooks/useOrder"
import { RedirectParams } from "flutterwave-react-native/dist/PayWithFlutterwave"

type Props = CheckoutNavigationProp

const Checkout = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const { cart, subtotal, total } = useCart()
  const { createOrder } = useOrder()
  const { user } = useAuth()

  const [showDelivery, setShowDelivery] = useState("")
  const [coupon, setCoupon] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPay, setLoadingPay] = useState(false)

  const currencyVal = useMemo(() => currency(cart?.[0].region), [cart])
  const discount = useMemo(
    () => (coupon ? couponDiscount(coupon, total) : 0),
    [coupon]
  )

  const handleSubmit = () => {}

  const onApprove = async (response: RedirectParams) => {
    const order1 = await placeOrderHandler({ paymentMethod: "flutterwave" })
    if (order1) {
      //   try {
      //     dispatch({ type: "PAY_REQUEST" })
      //     const { data } = await axios.put(
      //       `${baseUrl}/api/orders/${region}/${order1.order._id}/pay`,
      //       response,
      //       { headers: { authorization: `Bearer ${userInfo.token}` } }
      //     )
      //     dispatch({ type: "PAY_SUCCESS", payload: data })
      //     order1.order.seller.map(async (x) => {
      //       await axios.put(`${baseUrl}api/bestsellers/${region}/${x}`)
      //     })
      //     ctxDispatch({
      //       type: "SHOW_TOAST",
      //       payload: {
      //         message: "Order is paid",
      //         showStatus: true,
      //         state1: "visible1 success",
      //       },
      //     })
      //     removeValue("cartItems")
      //     ctxDispatch({ type: "CART_CLEAR" })
      //     if (userInfo) {
      //       await axios.delete(`${baseUrl}/api/cartItems/`, {
      //         headers: {
      //           Authorization: `Bearer ${userInfo.token}`,
      //         },
      //       })
      //     }
      //     order1.order.seller.map((s) => {
      //       socket.emit("post_data", {
      //         userId: s,
      //         itemId: order1.order._id,
      //         notifyType: "sold",
      //         msg: `${userInfo.username} ordered your product`,
      //         link: `/order/${order1.order._id}`,
      //         userImage: userInfo.image,
      //         mobile: { path: "OrderScreen", id: order1.order._id },
      //       })
      //       const message = {
      //         title: "Sold Order",
      //         body: `${userInfo.username} ordered your product`,
      //         data: {},
      //       }
      //       sendPushNotification(message, s)
      //     })
      //     navigation.navigate("OrderDetails", { id: order1.order._id })
      //     // navigate(`/order/${data.order._id}`);
      //   } catch (err) {
      //     dispatch({ type: "PAY_FAIL", payload: getError(err) })
      //     console.log(err, getError(err))
      //     ctxDispatch({
      //       type: "SHOW_TOAST",
      //       payload: {
      //         message: `${getError(err)}`,
      //         showStatus: true,
      //         state1: "visible1 error",
      //       },
      //     })
      //   }
    } else {
      console.log("no order found")
    }
  }

  const handleOnRedirect = async (result: RedirectParams) => {
    try {
      if (result.status !== "successful") {
        setIsLoading(false)
        return
      }
      onApprove(result)
    } catch (err) {
      console.log(err)
    }
  }

  const placeOrderHandler = async ({
    paymentMethod,
  }: {
    paymentMethod: string
  }) => {
    const res = createOrder({
      items: cart,
      paymentMethod,
      totalAmount: total,
      transactionId: "",
    })

    // try {
    //   dispatch({ type: "CREATE_REQUEST" })
    //   const { data } = await axios.post(
    //     `${baseUrl}/api/orders/${region}`,
    //     {
    //       orderItems: cart.cartItems,
    //       paymentMethod: cart.paymentMethod,
    //       itemsPrice: cart.itemsPrice,
    //       shippingPrice: cart.shippingPrice,
    //       taxPrice: cart.taxPrice,
    //       totalPrice: cart.totalPrice,
    //       deliveryMethod: cart.deliveryMethod,
    //     },
    //     { headers: { authorization: `Bearer ${userInfo.token}` } }
    //   )
    //   dispatch({ type: "CREATE_SUCCESS", payload: data })
    //   cart.cartItems.map(async (x) => {
    //     await axios.put(
    //       `${baseUrl}/api/products/${x._id}/unsave`,
    //       {},
    //       {
    //         headers: { Authorization: `Bearer ${userInfo.token}` },
    //       }
    //     )
    //   })
    //   return data
    // } catch (err) {
    //   dispatch({ type: "CREATE_FAIL" })
    //   ctxDispatch({
    //     type: "SHOW_TOAST",
    //     payload: {
    //       message: getError(err),
    //       showStatus: true,
    //       state1: "visible1 error",
    //     },
    //   })
    //   console.log(getError(err))
    // }
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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Orders" />
        <Appbar.Action icon="magnify" />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        <View
          style={[styles.section, { backgroundColor: colors.elevation.level2 }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Items
          </Text>

          {cart.map((item) => (
            <View style={styles.itemCont} key={item._id}>
              <View style={styles.item}>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
                <View style={styles.details}>
                  <Text
                    style={styles.name}
                    numberOfLines={2}
                    ellipsizeMode={"tail"}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.category}>{item.category}</Text>
                  <View style={styles.quantity}>
                    <Text style={styles.category}>Quantity:</Text>
                    <Text>{item.quantity}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setShowDelivery(item._id === showDelivery ? "" : item._id)
                    }
                    style={[styles.quantity, { marginTop: 10 }]}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.secondary,
                        marginRight: 5,
                      }}
                    >
                      Delivery Method
                    </Text>
                    <Ionicons
                      name={
                        item._id === showDelivery
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={15}
                      color={colors.onBackground}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.price, { color: colors.primary }]}>
                  {currencyVal} {item.sellingPrice}
                </Text>
              </View>
              {showDelivery === item._id ? (
                <View style={styles.delivery}>
                  {Object.entries(item.deliverySelect).map(([key, value]) =>
                    key === "total" ? null : (
                      <View style={{ flexDirection: "row" }} key={key}>
                        <Text
                          style={{
                            flex: 3,
                            textTransform: "capitalize",
                            fontSize: 13,
                          }}
                        >
                          {key}:
                        </Text>
                        {key === "cost" ? (
                          <Text style={{ flex: 5, fontSize: 13 }}>
                            {currencyVal}
                            {value}
                          </Text>
                        ) : (
                          <Text style={{ flex: 5 }}>{value}</Text>
                        )}
                      </View>
                    )
                  )}
                </View>
              ) : null}
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <Text style={[styles.edit, { color: colors.secondary }]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[styles.section, { backgroundColor: colors.elevation.level2 }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Payment method
          </Text>
          <Text>{cart.paymentMethod}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("PaymentMethod")}
          >
            <Text style={[styles.edit, { color: colors.secondary }]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View
        style={[styles.checkout, { backgroundColor: colors.elevation.level2 }]}
      >
        <View>
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Order Summary
          </Text>
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 15 }}>Item</Text>

            {cart.map((c) => (
              <View
                key={c._id}
                style={{ flexDirection: "row", marginLeft: 20 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 5,
                  }}
                >
                  <Text style={{ flex: 1 }}>{c.quantity} </Text>
                  <Text style={{ flex: 1 }}>x </Text>
                  <Text style={{ flex: 1 }}>
                    {currencyVal}
                    {c.sellingPrice}
                  </Text>
                </View>
                <Text style={{ flex: 3, textAlign: "right" }}>
                  {` =  ${currencyVal}` + c.quantity * c.sellingPrice}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ marginTop: 5 }}>Subtotal</Text>
            <Text style={{ marginTop: 5 }}>
              {currencyVal}
              {subtotal.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ marginTop: 5 }}>Shipping</Text>
            <Text style={{ marginTop: 5 }}>
              {currencyVal}
              {cart.shippingPrice.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ marginTop: 5 }}>Tax</Text>
            <Text style={{ marginTop: 5 }}>
              {currencyVal}
              {cart.taxPrice.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ marginTop: 5 }}>Discount</Text>
            <Text style={{ marginTop: 5 }}>
              - {currencyVal}
              {discount}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 10,
            }}
          >
            <Text style={{ marginTop: 5, fontSize: 18 }}>Order Total</Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 18,
                color: colors.primary,
                fontWeight: "bold",
              }}
            >
              {currency(cart[0].region)}
              {(total - discount).toFixed(2)}
            </Text>
          </View>
        </View>

        {loadingPay ? (
          <ActivityIndicator size={"large"} color={colors.primary} />
        ) : cart.paymentMethod === "Wallet" ? (
          <TouchableOpacity
            style={[
              styles.button,
              { marginTop: 20, backgroundColor: colors.primary },
            ]}
            onPress={handleSubmit}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Proceed to Payment
            </Text>
          </TouchableOpacity>
        ) : cart.paymentMethod === "Credit/Debit card" ? (
          region() !== "NGN" ? (
            <Payfast placeOrderHandler={placeOrderHandler} totalPrice={total} />
          ) : (
            <PayWithFlutterwave
              onRedirect={handleOnRedirect}
              options={{
                tx_ref: generateTransactionRef(10),
                authorization: API_KEY,
                customer: {
                  email: user?.email ?? "",
                  name: `${user?.firstName} ${user?.lastName}`,
                },
                amount: total,
                currency: "NGN",
                // payment_options: "card",
                customizations: {
                  title: "Repeddle",
                  description: "Payment for order",
                  //   logo: "https://assets.piedpiper.com/logo.png",
                },
                meta: {
                  purpose: "Make Payment",
                  userId: user?._id,
                  image:
                    "https://res.cloudinary.com/emirace/image/upload/v1674796101/fundwallet_rgdi9s.jpg",
                  description: "Payment for items in cart",
                },
              }}
              customButton={(props) =>
                isLoading ? (
                  <ActivityIndicator size={"large"} color={colors.primary} />
                ) : (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setIsLoading(true)
                      props.onPress()
                    }}
                    disabled={props.disabled}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      PROCEED
                    </Text>
                  </TouchableOpacity>
                )
              }
            />
          )
        ) : null}
      </View>
    </View>
  )
}

export default Checkout

const styles = StyleSheet.create({
  title: { fontWeight: "bold", fontSize: 20, textTransform: "capitalize" },
  content: { padding: 20, flex: 1 },
  section: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemCont: {},
  item: { flexDirection: "row", alignItems: "center" },
  image: { width: 80, height: 80, borderRadius: 5, resizeMode: "cover" },
  details: { marginHorizontal: 10 },
  name: {
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 5,
  },
  category: { color: "grey", textTransform: "capitalize", marginRight: 10 },
  quantity: { flexDirection: "row" },
  price: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "right",
    flex: 1,
  },
  delivery: { padding: 5 },
  edit: {
    fontSize: 13,
    fontWeight: "bold",
    paddingTop: 10,
  },
  checkout: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  button: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
})
