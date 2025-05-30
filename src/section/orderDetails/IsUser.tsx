import { Image, Modal, Pressable, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { Button, Text, useTheme } from "react-native-paper"
import { displayDeliveryStatus } from "../../utils/render"
import moment from "moment"
import { IOrder, OrderItem } from "../../types/order"
import { orderDetailsStyle as styles } from "./style"
import { IUser } from "../../types/user"
import useAuth from "../../hooks/useAuth"
import useToastNotification from "../../hooks/useToastNotification"
import { currency, daydiff, deliveryNumber, region } from "../../utils/common"
import { OrderDetailsNavigationProp } from "../../types/navigation/stack"
import { baseURL } from "../../services/api"
import { Ionicons } from "@expo/vector-icons"

type Props = {
  order: IOrder
  orderItem: OrderItem
  userOrdered: IUser
  setShowDeliveryHistory: (val: boolean) => void
  setCurrentDeliveryHistory: (val: number) => void
  handleCancelOrder: (val: OrderItem) => void
  refund: (val: OrderItem) => void
  paySeller: (val: OrderItem) => void
  deliverOrderHandler: (
    deliveryStatus: string,
    orderItem: OrderItem
  ) => Promise<void>
  updatingStatus: boolean
  toggleOrderHoldStatus: (item: OrderItem) => Promise<void>
  navigation: OrderDetailsNavigationProp["navigation"]
  id: string
}

const IsUser = ({
  orderItem,
  deliverOrderHandler,
  handleCancelOrder,
  paySeller,
  refund,
  setCurrentDeliveryHistory,
  setShowDeliveryHistory,
  toggleOrderHoldStatus,
  updatingStatus,
  userOrdered,
  order,
  navigation,
  id,
}: Props) => {
  const { colors, dark } = useTheme()
  const { user } = useAuth()
  const { addNotification } = useToastNotification()

  const [afterAction, setAfterAction] = useState(false)
  const [showDelivery, setShowDelivery] = useState(false)

  const placeOrderOnHold = () => {
    addNotification({ message: "Order placed on Hold", error: true })
  }

  const paymentRequest = async () => {
    // the below function accepts the current status then uses the next function to update
    await deliverOrderHandler("Delivered", orderItem)
    setAfterAction(false)
  }

  return (
    <View
      style={[
        styles.sumaryContDetails,
        {
          backgroundColor: colors.elevation.level2,
          marginHorizontal: 10,
        },
      ]}
      key={orderItem._id}
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
              orderItem.deliveryTracking.currentStatus.status
            )}
            <TouchableOpacity
              onPress={() => {
                setShowDeliveryHistory(true)
                setCurrentDeliveryHistory(
                  deliveryNumber(
                    orderItem.deliveryTracking.currentStatus.status
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

          <Text>
            On{" "}
            {moment(orderItem.deliveryTracking.currentStatus.timestamp).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </Text>
        </View>
        {orderItem.trackingNumber && (
          <Text>Tracking Number: {orderItem.trackingNumber}</Text>
        )}
        {user &&
          userOrdered._id === user._id &&
          !orderItem.isHold &&
          orderItem.deliveryTracking.currentStatus.status === "Delivered" && (
            <>
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.background,
                    marginTop: 5,
                    borderWidth: 1,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() =>
                  orderItem.isHold ? placeOrderOnHold() : setAfterAction(true)
                }
              >
                <Text
                  style={[
                    styles.link,
                    { color: colors.primary, paddingVertical: 10 },
                  ]}
                >
                  Confirm you have received your order
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
                      backgroundColor: !dark ? "#00000040" : "#00000070",
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
                    <Text
                      style={{
                        fontSize: 13,
                        maxWidth: 400,
                        textAlign: "justify",
                      }}
                    >
                      Please inspect your order before confirming receipt.
                      Kindly know that you can't LOG A RETURN after order
                      receipt confirmation. However, you can re-list your
                      product for sale at this point
                    </Text>
                    <View style={styles.afterAction}>
                      <Button
                        style={[
                          styles.button,
                          {
                            margin: 10,
                            width: "40%",
                          },
                        ]}
                        onPress={() => {
                          deliverOrderHandler("Received", orderItem)
                          paymentRequest()
                          setAfterAction(false)
                        }}
                        mode="contained"
                        loading={updatingStatus}
                        disabled={updatingStatus}
                      >
                        Confirm order
                      </Button>
                      <Button
                        style={[
                          styles.button,
                          {
                            backgroundColor: colors.secondary,
                            margin: 10,
                            width: "40%",
                          },
                        ]}
                        onPress={() => {
                          if (updatingStatus) return
                          navigation.push("ReturnForm", {
                            orderItems: order.items,
                            // deliveryMethod: order.deliveryMethod,
                            orderId: id,
                          })
                          setAfterAction(false)
                        }}
                      >
                        Log a return
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          )}

        {deliveryNumber(orderItem.deliveryTracking.currentStatus.status) >= 4 &&
          !orderItem.isHold &&
          daydiff(orderItem.deliveryTracking.currentStatus.timestamp, 3) >=
            0 && (
            <Pressable
              onPress={() =>
                navigation.push("ReturnForm", {
                  orderItems: order.items,
                  orderId: id,
                  waybillNumber: orderItem.trackingNumber,
                })
              }
              style={{
                flexDirection: "row",
                gap: 4,
                marginVertical: 10,
                alignSelf: "center",
              }}
            >
              <Text style={{ fontFamily: "chronicle-text-bold" }}>
                Log a return
              </Text>
              {daydiff(orderItem.deliveryTracking.currentStatus.timestamp, 3) >=
                0 && (
                <Text style={{ color: "red" }}>
                  {daydiff(
                    orderItem.deliveryTracking.currentStatus.timestamp,
                    3
                  )}{" "}
                  days left
                </Text>
              )}
            </Pressable>
          )}

        {user?.role === "Admin" && (
          <Button
            mode="contained"
            onPress={() => handleCancelOrder(orderItem)}
            style={{ backgroundColor: colors.secondary, borderRadius: 10 }}
          >
            Cancel Order
          </Button>
        )}
      </View>

      <View style={styles.horizontalLine} />
      <View style={styles.detailButton}>
        <View style={styles.orderItem}>
          <Image
            source={{ uri: baseURL + orderItem.product.images[0] }}
            style={[styles.image, { backgroundColor: "black" }]}
          />
          <View style={styles.details1}>
            <Text style={styles.name}>{orderItem.product.name}</Text>
            <Text style={styles.quantity}>QTY: {orderItem.quantity}</Text>
            <Text style={styles.itemPrice}>
              Unit Price: {currency(orderItem.product.region)}
              {orderItem.price}
            </Text>
            <Text style={styles.itemPrice}>
              Total: {currency(orderItem.product.region)}
              {orderItem.price * orderItem.quantity}
            </Text>
          </View>
        </View>
        <View style={styles.actionButton}>
          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => {
              navigation.push("Product", {
                slug: orderItem.product.slug,
              })
            }}
          >
            <Text style={styles.link}>Buy Again</Text>
          </Pressable>
          {user?.role === "Admin" &&
            daydiff(orderItem.deliveryTracking.currentStatus.timestamp, 3) <=
              0 &&
            !orderItem.isHold &&
            deliveryNumber(orderItem.deliveryTracking.currentStatus.status) ===
              11 && (
              <Button
                onPress={() => refund(orderItem)}
                mode="contained"
                style={{ borderRadius: 10, backgroundColor: colors.secondary }}
              >
                Refund
              </Button>
            )}
          {user?.role === "Admin" && (
            <Pressable
              onPress={() => () => toggleOrderHoldStatus(orderItem)}
              style={[
                styles.button,
                {
                  backgroundColor: colors.secondary,
                  marginTop: 10,
                },
              ]}
            >
              <Text style={styles.link}>
                {orderItem.isHold ? "UnHold" : "Hold"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {user?.role === "Admin" &&
        ((daydiff(orderItem.deliveryTracking.currentStatus.timestamp, 3) <= 0 &&
          deliveryNumber(orderItem.deliveryTracking.currentStatus.status) ===
            4) ||
          deliveryNumber(orderItem.deliveryTracking.currentStatus.status) ===
            5) &&
        !orderItem.isHold && (
          <Button
            onPress={() => paySeller(orderItem)}
            mode="contained"
            style={{
              backgroundColor: colors.secondary,
              borderRadius: 10,
              marginTop: 10,
            }}
            textColor="white"
            loading={updatingStatus}
            disabled={updatingStatus}
          >
            Pay Seller
          </Button>
        )}

      <TouchableOpacity
        onPress={() => setShowDelivery(!showDelivery)}
        style={{
          marginVertical: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: colors.secondary,
            marginRight: 5,
          }}
        >
          {showDelivery ? "Less" : "More"} details
        </Text>
        <Ionicons
          name={showDelivery ? "chevron-up" : "chevron-down"}
          size={15}
          color={colors.secondary}
        />
      </TouchableOpacity>
      {showDelivery ? (
        <>
          {Object.entries(orderItem.deliveryOption).map(([key, value]) =>
            key === "total" ? null : (
              <View
                style={{
                  flexDirection: "row",
                }}
                key={key}
              >
                <Text style={styles.deliveryKey}>{key}:</Text>
                {key === "fee" ? (
                  <Text style={styles.deliveryValue}>
                    {currency(region())}
                    {value}
                  </Text>
                ) : (
                  <Text style={styles.deliveryValue}>{value}</Text>
                )}
              </View>
            )
          )}
          <View style={{ marginTop: 20 }}>
            <Text>Seller Information</Text>
            <View style={styles.userCont}>
              <Image
                source={{ uri: baseURL + orderItem.seller.image }}
                style={styles.userImg}
              />
              <View>
                <Pressable
                  onPress={() =>
                    navigation.push("MyAccount", {
                      username: orderItem.seller.username,
                    })
                  }
                >
                  <Text style={styles.username}>
                    @{orderItem.seller.username}
                  </Text>
                </Pressable>
                <Text style={styles.username}>
                  {orderItem.seller.firstName} {orderItem.seller.lastName}
                </Text>
              </View>
            </View>
          </View>
          {user?.role === "Admin" ? (
            <View style={{ marginTop: 20 }}>
              <Text>Buyer Information</Text>
              <View style={styles.userCont}>
                <Image
                  source={{ uri: baseURL + order.buyer.image }}
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
                    <Text style={styles.username}>@{order.buyer.username}</Text>
                  </Pressable>
                  <Text style={styles.username}>
                    {order.buyer.firstName} {order.buyer.lastName}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  )
}

export default IsUser
