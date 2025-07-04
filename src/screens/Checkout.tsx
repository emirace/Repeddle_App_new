import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useMemo, useState } from "react";
import { Appbar, Button, Text, useTheme } from "react-native-paper";
import useCart from "../hooks/useCart";
import { CheckoutNavigationProp } from "../types/navigation/stack";
import {
  couponDiscount,
  currency,
  generateTransactionRef,
  region,
} from "../utils/common";
import useAuth from "../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import PayWithFlutterwave from "flutterwave-react-native";
import Payfast from "../components/paymentMethod/Payfast";
import useOrder from "../hooks/useOrder";
import { RedirectParams } from "flutterwave-react-native/dist/PayWithFlutterwave";
import { baseURL } from "../services/api";
import useToastNotification from "../hooks/useToastNotification";
import PayWithPaystack from "../components/paymentMethod/Paystack";

type Props = CheckoutNavigationProp;

const Checkout = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const {
    cart,
    subtotal,
    total,
    paymentMethod,
    clearCart,
    changePaymentMethod,
  } = useCart();
  const { createOrder, error } = useOrder();
  const { user } = useAuth();
  const { addNotification } = useToastNotification();

  const [showDelivery, setShowDelivery] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);

  const currencyVal = useMemo(() => currency(cart?.[0]?.region), [cart]);
  const discount = useMemo(
    () => (coupon ? couponDiscount(coupon, total) : 0),
    [coupon]
  );

  const handleSubmit = () => {
    Alert.alert(
      "Confirm Payment",
      `${currencyVal}${(total - discount).toFixed(
        2
      )} will be deducted from your wallet.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Proceed",
          onPress: async () => {
            const order1 = await placeOrderHandler({ paymentMethod });
            if (order1) {
              clearCart();
              changePaymentMethod("Card");
              navigation.pop(3);
              navigation.navigate("OrderDetails", { id: order1._id });
            } else {
              addNotification({ message: error || "failed to create order" });
            }
          },
        },
      ]
    );
  };

  const confirmWalletPayment = () => {};

  const onApprove = async ({
    paymentMethod,
    id,
  }: {
    paymentMethod: string;
    id: string;
  }) => {
    const order1 = await placeOrderHandler({
      paymentMethod,
      transId: id,
    });
    if (order1) {
      clearCart();
      changePaymentMethod("Card");
      navigation.pop(3);
      navigation.navigate("OrderDetails", { id: order1._id });
    } else {
      addNotification({ message: error || "failed to create order" });
    }
  };

  const handleOnRedirect = async (result: RedirectParams) => {
    console.log(result, "res");
    try {
      if (result.status !== "successful") {
        console.log("unsuccessfull");
        setIsLoading(false);
        return;
      }
      addNotification({ message: "Payment successful" });
      await onApprove({
        paymentMethod: "Flutterwave",
        id: result.transaction_id || result.tx_ref,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onError = () => {
    setIsLoading(false);
  };

  const placeOrderHandler = async ({
    paymentMethod,
    transId,
  }: {
    paymentMethod: string;
    transId?: string;
  }) => {
    const res = await createOrder({
      items: cart,
      paymentMethod,
      totalAmount: total,
      transactionId: transId,
    });

    if (res) {
      addNotification({ message: res.message });
      return res.order;
    } else {
      addNotification({ message: error, error: true });
    }
  };

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
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Checkout" />
        <Appbar.Action iconColor="white" icon="magnify" />
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
                <Image
                  source={{ uri: baseURL + item.images[0] }}
                  style={styles.image}
                />
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
                  {item.deliverySelect &&
                    Object.entries(item.deliverySelect).map(([key, value]) =>
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
          <TouchableOpacity onPress={() => navigation.push("Cart")}>
            <Text style={[styles.edit, { color: colors.secondary }]}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[styles.section, { backgroundColor: colors.elevation.level2 }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
            Payment method
          </Text>
          <Text>{paymentMethod}</Text>
          <TouchableOpacity onPress={() => navigation.push("PaymentMethod")}>
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
            <Text style={{ fontFamily: "absential-sans-bold", fontSize: 15 }}>
              Item
            </Text>

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
              {/* {cart.shippingPrice.toFixed(2)} */}0
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
              {/* {cart.taxPrice.toFixed(2)} */}0
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
                fontFamily: "absential-sans-bold",
              }}
            >
              {currency(cart?.[0]?.region)}
              {(total - discount).toFixed(2)}
            </Text>
          </View>
        </View>

        {loadingPay ? (
          <ActivityIndicator size={"large"} color={colors.primary} />
        ) : paymentMethod === "Wallet" ? (
          <TouchableOpacity
            style={[
              styles.button,
              {
                marginTop: 20,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={handleSubmit}
          >
            <Text style={{ color: "white", fontFamily: "chronicle-text-bold" }}>
              Proceed to Payment
            </Text>
          </TouchableOpacity>
        ) : paymentMethod === "Card" ? (
          region() !== "NG" ? (
            <Payfast placeOrderHandler={placeOrderHandler} totalPrice={total} />
          ) : (
            <>
              <PayWithPaystack amount={total} onAprove={onApprove} />
              <View style={{ height: 10 }} />
              <PayWithFlutterwave
                onRedirect={handleOnRedirect}
                onInitializeError={onError}
                style={{ width: "100%" }}
                onAbort={onError}
                options={{
                  tx_ref: generateTransactionRef(10),
                  authorization:
                    "FLWPUBK_TEST-6a1e30713a8c6962ecb7d6cfbda2df69-X",
                  customer: {
                    email: user?.email ?? "",
                    name: `${user?.firstName} ${user?.lastName}`,
                  },
                  amount: total,
                  currency: "NGN",
                  payment_options: "card",
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
                customButton={(props) => (
                  <Button
                    onPress={() => {
                      setIsLoading(true);
                      props.onPress();
                    }}
                    children="Proceed"
                    loading={isLoading}
                    mode="contained"
                    style={[
                      styles.button,
                      {
                        // backgroundColor: colors.primary,
                        width: "100%",
                      },
                    ]}
                    labelStyle={{
                      color: "white",
                      fontFamily: "chronicle-text-bold",
                    }}
                  />
                )}
              />
            </>
          )
        ) : null}
      </View>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  title: {
    fontFamily: "absential-sans-bold",
    fontSize: 20,
    textTransform: "capitalize",
  },
  content: { padding: 20, flex: 1 },
  section: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "absential-sans-bold",
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
    fontFamily: "absential-sans-bold",
    fontSize: 18,
    textAlign: "right",
    flex: 1,
  },
  delivery: { padding: 5 },
  edit: {
    fontSize: 13,
    fontFamily: "chronicle-text-bold",
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
    borderRadius: 5,
  },
});
