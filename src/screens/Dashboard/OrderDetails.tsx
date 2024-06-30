import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextInput,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native"
import React, { PropsWithChildren, useEffect, useRef, useState } from "react"
import { Appbar, Button, Text, useTheme } from "react-native-paper"
import useOrder from "../../hooks/useOrder"
import ViewShot from "react-native-view-shot"
import * as FileSystem from "expo-file-system"
import * as Print from "expo-print"
import { OrderDetailsNavigationProp } from "../../types/navigation/stack"
import { IOrder, OrderItem } from "../../types/order"
import moment from "moment"
import useAuth from "../../hooks/useAuth"
import {
  currency,
  deliveryNumber,
  deliveryStatusMap,
  region,
  timeDifference,
} from "../../utils/common"
import { Ionicons } from "@expo/vector-icons"
import SelectDropdown from "react-native-select-dropdown"
import { displayDeliveryStatus } from "../../utils/render"
import { normaliseH } from "../../utils/normalize"
import DeliveryHistory from "../../components/DeliveryHistory"
import Loader from "../../components/ui/Loader"
import useToastNotification from "../../hooks/useToastNotification"
import { baseURL } from "../../services/api"

type Props = OrderDetailsNavigationProp

const OrderDetails = ({ navigation, route }: Props) => {
  const { colors, dark } = useTheme()
  const { fetchOrderById, error, loading, updateOrderItemTracking } = useOrder()
  const { user } = useAuth()
  const { addNotification } = useToastNotification()
  const { id } = route.params

  const viewShotRef = useRef<ViewShot>(null)

  const [order, setOrder] = useState<IOrder>()

  const [showDeliveryHistory, setShowDeliveryHistory] = useState(false)
  const [currentDeliveryHistory, setCurrentDeliveryHistory] = useState(0)
  const [showTracking, setShowTracking] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [afterAction, setAfterAction] = useState(false)
  const [showDelivery, setShowDelivery] = useState("")
  const [isSeller, setIsSeller] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetchOrderById(id)
      if (res) {
        setOrder(res)
        if (user) {
          const existSell = res.items.filter((x) => x.seller._id === user._id)
          if (existSell.length) {
            setIsSeller(true)
          }
        }
      } else {
        setShowError(true)
      }
    }

    fetchOrder()
  }, [id])

  const comfirmWaybill = async (order: OrderItem) => {
    if (!trackingNumber) return

    await deliverOrderHandler("Dispatched", order, order._id)
    setShowTracking(false)
  }

  const daydiff = (x: number) =>
    order?.createdAt
      ? x - timeDifference(new window.Date(order.createdAt), new window.Date())
      : 0

  const generatePDF = async () => {
    if (!viewShotRef.current?.capture) return

    // Take a snapshot of the screen
    const snapshot = await viewShotRef.current.capture()
    console.log("eeeeeeee1", snapshot)
    // Create the PDF file
    const pdfDocument = await Print.printToFileAsync({
      html: `<html><body><img src="${snapshot}" /></body></html>`,
    })

    console.log("eeeeeeee3", pdfDocument)
    const pdfUri = pdfDocument.uri
    await FileSystem.moveAsync({
      from: pdfUri,
      to: FileSystem.documentDirectory + "your-screen.pdf",
    })
    await Print.printAsync({
      uri: FileSystem.documentDirectory + "your-screen.pdf",
    })
    console.log("PDF saved successfully!")
  }

  const showNextStatus = (status: string) => {
    const entries = Object.entries(deliveryStatusMap)
    const currentNumber = deliveryNumber(status)

    return entries[currentNumber]
  }

  const deliverOrderHandler = async (
    currentStatus: string,
    orderItem: OrderItem,
    trackingNumber?: string
  ) => {
    if (!order) return
    const nextStatus = showNextStatus(currentStatus)

    if (nextStatus[1] === 2) {
      if (!trackingNumber) {
        addNotification({
          message: "Tracking number is required to dispatch item",
          error: true,
        })
        return
      }
    }

    setUpdatingStatus(true)

    const res = await updateOrderItemTracking(
      order._id,
      orderItem.product._id,
      {
        status: nextStatus[0],
        trackingNumber,
      }
    )
    if (res) {
      addNotification({ message: "Item status has been updated" })
      setOrder(res)
    } else {
      addNotification({
        message: error ?? "Failed to update status",
        error: true,
      })
    }

    setUpdatingStatus(false)
  }

  const updateTracking = async (orderItem: OrderItem) => {
    if (updatingStatus) return

    const nextStatus = showNextStatus(
      orderItem.deliveryTracking.currentStatus.status
    )

    if (nextStatus[1] === 2 && !trackingNumber) {
      setShowTracking(true)
    } else {
      await deliverOrderHandler(
        orderItem.deliveryTracking.currentStatus.status,
        orderItem,
        trackingNumber
      )
    }
  }

  const paymentRequest = async (
    seller: string,
    cost: number,
    itemCurrency: string,
    sellerImage: string
  ) => {}

  const paySeller = async (product: OrderItem) => {}
  const refund = async (product: OrderItem) => {}

  let shippingPrice = 0
  let itemsPrice = 0

  console.log(order)

  return (
    <View style={[styles.container]}>
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
        <Appbar.Content title="Order Details" titleStyle={{ color: "white" }} />
        <Appbar.Action
          icon="cart-outline"
          onPress={() => navigation.push("Cart")}
          iconColor="white"
        />
      </Appbar.Header>

      {loading ? (
        <Loader />
      ) : showError && error ? (
        <Text1 style={{ color: "red" }}>{error}</Text1>
      ) : order ? (
        <ViewShot ref={viewShotRef}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.sumaryCont,
                {
                  backgroundColor: colors.elevation.level2,
                  marginHorizontal: 10,
                },
              ]}
            >
              <Text1 style={styles.heading}>Order number {id}</Text1>
              <Text1>
                {order.items.length} Item
                {order.items.length > 1 ? "s" : ""}
              </Text1>
              <Text1>
                Placed on{" "}
                {moment(order.createdAt).format("MMMM Do YYYY, h:mm:ss a")}{" "}
              </Text1>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text1 style={[styles.heading, { paddingLeft: 10 }]}>
                Items in your order
              </Text1>
              <TouchableOpacity
                onPress={generatePDF}
                style={[
                  styles.printButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.printText}>Print Invoice</Text>
              </TouchableOpacity>
              {!isSeller &&
                daydiff(3) > 0 &&
                deliveryNumber(
                  order.items[0].deliveryTracking.currentStatus.status
                ) > 3 && (
                  <Pressable
                    onPress={() =>
                      navigation.push("ReturnForm", {
                        orderItems: order.items,
                        orderId: id,
                        waybillNumber: trackingNumber,
                      })
                    }
                  >
                    <Text1 style={{ fontWeight: "bold" }}>Log a return</Text1>
                    <Text style={{ color: "red" }}>{daydiff(3)} days left</Text>
                  </Pressable>
                )}
            </View>
            {order.items.map((orderitem) =>
              isSeller ? (
                orderitem.seller._id === user?._id && (
                  <View
                    style={[
                      styles.sumaryContDetails,
                      {
                        backgroundColor: colors.elevation.level2,
                        marginHorizontal: 10,
                      },
                    ]}
                    key={orderitem._id}
                  >
                    <View style={styles.subSumaryContDetails}>
                      <Text1 style={{ display: "none" }}>
                        {
                          (itemsPrice =
                            itemsPrice + orderitem.price * orderitem.quantity)
                        }
                        {
                          (shippingPrice =
                            shippingPrice +
                            Number(orderitem.deliveryOption.fee))
                        }
                      </Text1>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {displayDeliveryStatus(
                            orderitem.deliveryTracking.currentStatus.status
                          )}
                          <TouchableOpacity
                            onPress={() => {
                              setShowDeliveryHistory(true)
                              setCurrentDeliveryHistory(
                                deliveryNumber(
                                  orderitem.deliveryTracking.currentStatus
                                    .status
                                )
                              )
                            }}
                          >
                            <Text
                              style={{
                                color: colors.secondary,
                                textAlign: "center",
                                marginLeft: 15,
                              }}
                            >
                              Track Order
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <Text1 style={styles.name}>
                          On{" "}
                          {moment(
                            orderitem.deliveryTracking.currentStatus.timestamp
                          ).format("MMMM Do YYYY, h:mm:ss a")}
                        </Text1>
                      </View>
                      {user &&
                        order.buyer._id === user._id &&
                        orderitem.deliveryTracking.currentStatus.status ===
                          "Delivered" && (
                          <Pressable
                            style={[
                              styles.button,
                              { backgroundColor: colors.primary },
                            ]}
                            onPress={() =>
                              deliverOrderHandler("Received", orderitem)
                            }
                          >
                            <Text style={styles.link}>
                              Comfirm you have recieved your order
                            </Text>
                          </Pressable>
                        )}
                      {user && order && (
                        <View>
                          {showTracking ? (
                            <View style={styles.trackingCont}>
                              <TextInput
                                placeholder="Enter Tracking number"
                                value={trackingNumber}
                                onChangeText={(e) => setTrackingNumber(e)}
                              />
                              <TouchableOpacity
                                style={{
                                  borderRadius: 5,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onPress={() => comfirmWaybill(orderitem)}
                              >
                                <Ionicons
                                  name="checkmark-sharp"
                                  size={20}
                                  color="white"
                                />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <>
                              {orderitem.trackingNumber && (
                                <Text1 style={[{ marginRight: 20 }]}>
                                  Tracking Number: {orderitem.trackingNumber}
                                </Text1>
                              )}

                              {user &&
                                order.buyer._id === user._id &&
                                orderitem.deliveryTracking.currentStatus
                                  .status === "Delivered" && (
                                  <Button
                                    onPress={() => updateTracking(orderitem)}
                                    children={`Mark as ${
                                      showNextStatus(
                                        orderitem.deliveryTracking.currentStatus
                                          .status
                                      )[0]
                                    }`}
                                    mode="contained"
                                    style={{ borderRadius: 5 }}
                                    loading={updatingStatus}
                                  />
                                )}
                            </>
                          )}
                        </View>
                      )}
                    </View>
                    <View style={styles.horizontalLine} />
                    <View style={styles.detailButton}>
                      <View style={styles.orderItem}>
                        <Image
                          source={{
                            uri: baseURL + orderitem.product.images[0],
                          }}
                          style={styles.image}
                        />
                        <View style={styles.details1}>
                          <Text1 style={styles.name}>
                            {orderitem.product.name}
                          </Text1>
                          <Text1 style={styles.quantity}>
                            QTY: {orderitem.quantity}
                          </Text1>
                          <Text1 style={styles.itemPrice}>
                            Unit Price: {currency(orderitem.product.region)}
                            {orderitem.price}
                          </Text1>
                          <Text1 style={styles.itemPrice}>
                            Total: {currency(orderitem.product.region)}
                            {orderitem.price * orderitem.quantity}
                          </Text1>
                        </View>
                      </View>
                      <View style={styles.actionButton}>
                        <Pressable
                          onPress={() => {
                            navigation.push("Product", {
                              slug: orderitem.product.slug,
                            })
                          }}
                          style={[
                            styles.button,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <Text style={styles.link}>Buy Again</Text>
                        </Pressable>
                        {user?.role === "Admin" &&
                          +daydiff(13) <= 0 &&
                          deliveryNumber(
                            orderitem.deliveryTracking.currentStatus.status
                          ) < 4 && (
                            <Pressable
                              style={[
                                styles.button,
                                {
                                  backgroundColor: colors.secondary,
                                  marginTop: 5,
                                },
                              ]}
                              onPress={() => refund(orderitem)}
                            >
                              <Text style={styles.link}>Refund</Text>
                            </Pressable>
                          )}
                        {user?.role === "Admin" && (
                          <Pressable
                            onPress={() =>
                              deliverOrderHandler(
                                orderitem.deliveryTracking.currentStatus
                                  .status === "Hold"
                                  ? "UnHold"
                                  : "Hold",
                                orderitem
                              )
                            }
                            style={[
                              styles.button,
                              {
                                backgroundColor: colors.secondary,
                                marginTop: 10,
                              },
                            ]}
                          >
                            <Text style={styles.link}>
                              {orderitem.deliveryTracking.currentStatus
                                .status === "Hold"
                                ? "UnHold"
                                : "Hold"}
                            </Text>
                          </Pressable>
                        )}
                        {user?.role === "Admin" &&
                          daydiff(13) <= 0 &&
                          deliveryNumber(
                            orderitem.deliveryTracking.currentStatus.status
                          ) === 4 && (
                            <Pressable
                              onPress={() => {
                                paySeller(orderitem)
                                deliverOrderHandler(
                                  "Payment To Seller Initiated",
                                  orderitem
                                )
                              }}
                              style={[
                                styles.button,
                                {
                                  backgroundColor: colors.primary,
                                  marginTop: 5,
                                },
                              ]}
                            >
                              <Text style={styles.link}>Pay Seller</Text>
                            </Pressable>
                          )}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        setShowDelivery(
                          orderitem._id === showDelivery ? "0" : orderitem._id
                        )
                      }
                      style={{ marginTop: 10, flexDirection: "row" }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: colors.secondary,
                          marginRight: 5,
                        }}
                      >
                        {showDelivery === orderitem._id ? "Less" : "More"}{" "}
                        details
                      </Text>
                      <Ionicons
                        name={
                          orderitem._id === showDelivery
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={15}
                        color={colors.onBackground}
                      />
                    </TouchableOpacity>
                    {showDelivery === orderitem._id ? (
                      <>
                        {Object.entries(orderitem.deliveryOption).map(
                          ([key, value]) =>
                            key === "total" ? null : (
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginTop: 10,
                                }}
                              >
                                <Text1 style={styles.deliveryKey}>{key}:</Text1>
                                {key === "cost" ? (
                                  <Text1 style={styles.deliveryKey}>
                                    {currency(region())}
                                    {value}
                                  </Text1>
                                ) : (
                                  <Text1 style={styles.deliveryKey}>
                                    {value}
                                  </Text1>
                                )}
                              </View>
                            )
                        )}
                        <View style={{ marginTop: 10 }}>
                          <Text1>Buyer Information</Text1>
                          <View style={styles.userCont}>
                            <Image
                              source={{ uri: order.buyer.image }}
                              style={styles.userImg}
                            />
                            <View>
                              <Pressable
                                onPress={() =>
                                  navigation.push("MyAccount", {
                                    username: order.buyer.username,
                                  })
                                }
                              >
                                <Text1 style={styles.username}>
                                  @{order.buyer.username}
                                </Text1>
                              </Pressable>
                              <Text1 style={{ marginHorizontal: 20 }}>
                                {order.buyer.firstName} {order.buyer.lastName}
                              </Text1>
                            </View>
                          </View>
                        </View>
                        {user?.role === "Admin" && (
                          <View style={{ marginTop: 20 }}>
                            <Text1>Seller Information</Text1>
                            <View style={styles.userCont}>
                              <Image
                                source={{ uri: orderitem.seller.image }}
                                style={styles.userImg}
                              />
                              <View>
                                <Pressable
                                  onPress={() =>
                                    navigation.push("MyAccount", {
                                      username: orderitem.seller.username,
                                    })
                                  }
                                >
                                  <Text1 style={styles.username}>
                                    @{orderitem.seller.username}
                                  </Text1>
                                </Pressable>
                                <Text1 style={{ marginHorizontal: 20 }}>
                                  {orderitem.seller.firstName}{" "}
                                  {orderitem.seller.lastName}
                                </Text1>
                              </View>
                            </View>
                          </View>
                        )}
                      </>
                    ) : null}
                  </View>
                )
              ) : (
                <View
                  style={[
                    styles.sumaryContDetails,
                    {
                      backgroundColor: colors.elevation.level2,
                      marginHorizontal: 10,
                    },
                  ]}
                  key={orderitem._id}
                >
                  <View style={styles.cont123}>
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {displayDeliveryStatus(
                          orderitem.deliveryTracking.currentStatus.status
                        )}
                        <TouchableOpacity
                          onPress={() => {
                            setShowDeliveryHistory(true)
                            setCurrentDeliveryHistory(
                              deliveryNumber(
                                orderitem.deliveryTracking.currentStatus.status
                              )
                            )
                          }}
                        >
                          <Text
                            style={{
                              color: colors.secondary,
                              textAlign: "center",
                              marginLeft: 15,
                            }}
                          >
                            Track Order
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <Text1>
                        On{" "}
                        {moment(
                          orderitem.deliveryTracking.currentStatus.status
                        ).format("MMMM Do YYYY, h:mm:ss a")}
                      </Text1>
                    </View>
                    {user &&
                      order.buyer._id === user._id &&
                      orderitem.deliveryTracking.currentStatus.status ===
                        "Delivered" && (
                        <>
                          <Pressable
                            style={[
                              styles.button,
                              {
                                backgroundColor: colors.background,
                                marginTop: 5,
                                borderWidth: 1,
                                borderColor: colors.secondary,
                              },
                            ]}
                            onPress={() => setAfterAction(true)}
                          >
                            <Text
                              style={[styles.link, { color: colors.secondary }]}
                            >
                              {" "}
                              Comfirm you have recieved your order
                            </Text>
                          </Pressable>
                          <Modal
                            transparent={true}
                            animationType="slide"
                            visible={afterAction}
                            onRequestClose={() => {
                              setAfterAction(!afterAction)
                            }}
                          >
                            <View
                              style={[
                                styles.afterActionCont,
                                {
                                  backgroundColor: !dark
                                    ? "#00000040"
                                    : "#00000070",
                                },
                              ]}
                            >
                              <View
                                style={{
                                  backgroundColor: colors.background,
                                  paddingVertical: 50,
                                  paddingHorizontal: 10,
                                  borderRadius: 5,
                                  shadowColor: colors.primary,
                                  shadowOffset: { width: 0, height: 10 },
                                  shadowOpacity: 0.25,
                                  shadowRadius: 3.5,
                                  elevation: 5,
                                }}
                              >
                                <View style={styles.afterAction}>
                                  <Pressable
                                    style={[
                                      styles.button,
                                      {
                                        backgroundColor: colors.primary,
                                        margin: 10,
                                        width: "40%",
                                      },
                                    ]}
                                    onPress={() => {
                                      deliverOrderHandler("Received", orderitem)
                                      paymentRequest(
                                        orderitem.seller._id,
                                        orderitem.price,
                                        currency(orderitem.product.region),
                                        orderitem.seller.image ?? ""
                                      )
                                      setAfterAction(false)
                                    }}
                                  >
                                    <Text style={styles.link}>Comfirm</Text>
                                  </Pressable>
                                  <Pressable
                                    style={[
                                      styles.button,
                                      {
                                        backgroundColor: colors.secondary,
                                        margin: 10,
                                        width: "40%",
                                      },
                                    ]}
                                    onPress={() => {
                                      navigation.push("ReturnForm", {
                                        orderItems: order.items,
                                        // deliveryMethod: order.deliveryMethod,
                                        orderId: id,
                                      })
                                      setAfterAction(false)
                                    }}
                                  >
                                    <Text style={styles.link}>
                                      Log a return
                                    </Text>
                                  </Pressable>
                                </View>
                                <Text1
                                  style={{
                                    fontSize: 13,
                                    maxWidth: 400,
                                    textAlign: "justify",
                                  }}
                                >
                                  Please inspect your order before confirming
                                  receipt. Kindly know that you can't LOG A
                                  RETURN after order receipt confirmation.
                                  However, you can re-list your product for sale
                                  at this point
                                </Text1>
                              </View>
                            </View>
                          </Modal>
                        </>
                      )}
                    {orderitem.trackingNumber && (
                      <Text1 style={{ marginRight: 20 }}>
                        Tracking Number: {orderitem.trackingNumber}
                      </Text1>
                    )}
                  </View>

                  <View style={styles.horizontalLine} />
                  <View style={styles.detailButton}>
                    <View style={styles.orderItem}>
                      <Image
                        source={{ uri: orderitem.product.images[0] }}
                        style={styles.image}
                      />
                      <View style={styles.details1}>
                        <Text1 style={styles.name}>
                          {orderitem.product.name}
                        </Text1>
                        <Text1 style={styles.quantity}>
                          QTY: {orderitem.quantity}
                        </Text1>
                        <Text1 style={styles.itemPrice}>
                          Unit Price: {currency(orderitem.product.region)}
                          {orderitem.price}
                        </Text1>
                        <Text1 style={styles.itemPrice}>
                          Total: {currency(orderitem.product.region)}
                          {orderitem.price * orderitem.quantity}
                        </Text1>
                      </View>
                    </View>
                    <View style={styles.actionButton}>
                      <Pressable
                        style={[
                          styles.button,
                          { backgroundColor: colors.primary },
                        ]}
                        onPress={() => {
                          navigation.push("Product", {
                            slug: orderitem.product.slug,
                          })
                        }}
                      >
                        <Text style={styles.link}>Buy Again</Text>
                      </Pressable>
                      {user?.role === "Admin" && (
                        <Pressable
                          onPress={() =>
                            deliverOrderHandler(
                              orderitem.deliveryTracking.currentStatus
                                .status === "Hold"
                                ? "UnHold"
                                : "Hold",
                              orderitem
                            )
                          }
                          style={[
                            styles.button,
                            {
                              backgroundColor: colors.secondary,
                              marginTop: 10,
                            },
                          ]}
                        >
                          <Text style={styles.link}>
                            {orderitem.deliveryTracking.currentStatus.status ===
                            "Hold"
                              ? "UnHold"
                              : "Hold"}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setShowDelivery(
                        orderitem._id === showDelivery ? "" : orderitem._id
                      )
                    }
                    style={{ marginVertical: 10, flexDirection: "row" }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.secondary,
                        marginRight: 5,
                      }}
                    >
                      {showDelivery === orderitem._id ? "Less" : "More"} details
                    </Text>
                    <Ionicons
                      name={
                        orderitem._id === showDelivery
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={15}
                      color={colors.onBackground}
                    />
                  </TouchableOpacity>
                  {showDelivery === orderitem._id ? (
                    <>
                      {Object.entries(orderitem.deliveryOption).map(
                        ([key, value]) =>
                          key === "total" ? null : (
                            <View
                              style={{
                                flexDirection: "row",
                              }}
                              key={key}
                            >
                              <Text1 style={styles.deliveryKey}>{key}:</Text1>
                              {key === "fee" ? (
                                <Text1 style={styles.deliveryValue}>
                                  {currency(region())}
                                  {value}
                                </Text1>
                              ) : (
                                <Text1 style={styles.deliveryValue}>
                                  {value}
                                </Text1>
                              )}
                            </View>
                          )
                      )}
                      <View style={{ marginTop: 20 }}>
                        <Text1>Seller Information</Text1>
                        <View style={styles.userCont}>
                          <Image
                            source={{ uri: orderitem.seller.image }}
                            style={styles.userImg}
                          />
                          <View>
                            <Pressable
                              onPress={() =>
                                navigation.push("MyAccount", {
                                  username: orderitem.seller.username,
                                })
                              }
                            >
                              <Text1 style={styles.username}>
                                @{orderitem.seller.username}
                              </Text1>
                            </Pressable>
                            <Text1 style={styles.username}>
                              {orderitem.seller.firstName}{" "}
                              {orderitem.seller.lastName}
                            </Text1>
                          </View>
                        </View>
                      </View>
                      {user?.role === "Admin" ? (
                        <View style={{ marginTop: 20 }}>
                          <Text1>Buyer Information</Text1>
                          <View style={styles.userCont}>
                            <Image
                              source={{ uri: order.buyer.image }}
                              style={styles.userImg}
                            />
                            <View>
                              <Pressable
                                onPress={() =>
                                  navigation.push("MyAccount", {
                                    username: order.buyer.username,
                                  })
                                }
                              >
                                <Text1 style={styles.username}>
                                  @{order.buyer.username}
                                </Text1>
                              </Pressable>
                              <Text1 style={styles.username}>
                                {order.buyer.firstName} {order.buyer.lastName}
                              </Text1>
                            </View>
                          </View>
                        </View>
                      ) : null}
                    </>
                  ) : null}
                </View>
              )
            )}

            <Modal
              animationType="slide"
              visible={showDeliveryHistory}
              onRequestClose={() => {
                setShowDeliveryHistory(!showDeliveryHistory)
              }}
            >
              <DeliveryHistory
                status={currentDeliveryHistory}
                setShowDeliveryHistory={setShowDeliveryHistory}
              />
            </Modal>
            <View style={styles.paymentDlivery}>
              <View style={styles.paymentDliveryItem}>
                <Text1 style={[styles.heading, { marginLeft: 10 }]}>
                  Payment
                </Text1>
                <View
                  style={[
                    styles.sumaryContDetails,
                    {
                      backgroundColor: colors.elevation.level2,
                      marginHorizontal: 10,
                    },
                  ]}
                >
                  {/* TODO: ask about payment status  */}
                  {/* <Text1 style={styles.name}>Payment Status</Text1>
                  <View style={styles.itemNum}>
                    {order.isPaid ? (
                      <Text style={{ color: colors.primary }}>Paid</Text>
                    ) : (
                      <Text style={{ color: colors.secondary }}>Not Paid</Text>
                    )}
                  </View> */}
                  <View style={styles.horizontalLine} />
                  <Text1 style={styles.name}>Payment Method</Text1>
                  <View style={styles.itemNum}>
                    <Text1>{order.paymentMethod}</Text1>
                  </View>
                  <View style={styles.horizontalLine} />
                  <View style={styles.paymentRow}>
                    <View style={{ width: "100%" }}>
                      <Text1 style={styles.name}>Payment Details</Text1>
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <Text1 style={styles.deliveryKey}>Item Total:</Text1>
                        <Text1 style={styles.deliveryValue}>
                          {currency(region())}
                          {isSeller ? itemsPrice : order.totalAmount}
                        </Text1>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <Text1 style={styles.deliveryKey}>Shipping Fee:</Text1>
                        <Text1 style={styles.deliveryValue}>
                          {currency(region())}
                          {/* TODO: */}
                          {/* {isSeller ? shippingPrice : order.shippingPrice} */}
                          {isSeller ? shippingPrice : order.totalAmount}
                        </Text1>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <Text1 style={styles.deliveryKey}>Total:</Text1>
                        <Text1 style={styles.deliveryValue}>
                          <Text1 style={styles.itemPrice}>
                            {currency(region())}
                            {isSeller
                              ? itemsPrice + shippingPrice
                              : order.totalAmount}
                          </Text1>
                        </Text1>
                      </View>
                    </View>
                    {isSeller && (
                      <>
                        <View style={styles.horizontalLine} />
                        <View style={styles.commision}>
                          <View style={styles.itemNum}>
                            <Text1 style={styles.key}>Total cost:</Text1>
                            <Text1 style={styles.value}>
                              {" "}
                              {currency(region())}
                              {itemsPrice + shippingPrice}
                            </Text1>
                          </View>
                          <View style={styles.itemNum}>
                            <Text1 style={styles.key}>
                              Repeddle Commision (7.9%):
                            </Text1>
                            <Text1 style={styles.value}>
                              {" "}
                              {currency(region())}
                              {(
                                (7.9 / 100) *
                                (itemsPrice + shippingPrice)
                              ).toFixed(2)}
                            </Text1>
                          </View>
                          <View style={styles.itemNum}>
                            <Text1 style={styles.key}>You will Receive:</Text1>
                            <Text1 style={styles.value}>
                              {" "}
                              {currency(region())}
                              {(
                                itemsPrice +
                                shippingPrice -
                                (7.9 / 100) * (itemsPrice + shippingPrice)
                              ).toFixed(2)}
                            </Text1>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </ViewShot>
      ) : null}
    </View>
  )
}

export default OrderDetails

type TextaProps = PropsWithChildren<{
  style?: StyleProp<TextStyle>
}> &
  TextProps

const Text1 = ({ style, children, ...props }: TextaProps) => {
  return (
    <Text style={[style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
    textTransform: "capitalize",
    color: "white",
  },
  sumaryContDetails: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sumaryCont: {
    // paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 3,
    paddingBottom: 10,
    marginTop: 10,
  },
  heading: {
    paddingVertical: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    // width: '100%',
    marginTop: 15,
  },
  itemNum: {
    flexDirection: "row",
  },
  orderItem: {
    flexDirection: "row",
    // flex: 8,
    marginBottom: 10,
  },
  image: {
    resizeMode: "cover",
    width: 80,
    height: 100,
  },
  details1: {
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    textTransform: "capitalize",
    fontWeight: "600",
    marginBottom: 5,
  },
  quantity: {
    marginBottom: 10,
  },
  itemPrice: {
    fontWeight: "bold",
  },
  actionButton: {
    // flex: 2,
    alignItems: "center",
  },
  detailButton: {
    flexDirection: "column",
    justifyContent: "center",
  },
  paymentDlivery: {
    flexDirection: "row",
    marginBottom: 15,
  },
  paymentDliveryItem: {
    flex: 1,
    height: "100%",
  },
  received: {
    color: "white",
    paddingVertical: 3,
    paddingHorizontal: 7,
    height: 30,
    borderRadius: 3,
    marginRight: 30,
  },
  afterAction: {
    flexDirection: "row",
    justifyContent: "center",
  },
  afterActionCont: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: 10,
  },
  userCont: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  username: {
    marginHorizontal: 20,
    fontWeight: "bold",
  },
  paymentRow: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  commision: {
    width: "100%",
    marginTop: 20,
  },
  key: {
    flex: 1,
  },
  value: {
    flex: 1,
  },
  trackingCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  cont123: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  deliveryKey: {
    flex: 1,
    textTransform: "capitalize",
    fontSize: 13,
  },
  deliveryValue: {
    flex: 2,
    textTransform: "capitalize",
    fontSize: 13,
  },
  subSumaryContDetails: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "grey",
    borderRadius: 5,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  link: { color: "white", fontWeight: "bold" },
  horizontalLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#00000030",
    marginVertical: 10,
  },
  printButton: {
    marginHorizontal: 20,
    padding: 5,
    borderRadius: 5,
  },
  printText: { color: "white" },
})
