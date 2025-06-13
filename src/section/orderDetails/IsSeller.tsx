import { Image, Pressable, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { displayDeliveryStatus } from "../../utils/render";
import { Ionicons } from "@expo/vector-icons";
import {
  currency,
  daydiff,
  deliveryNumber,
  deliveryStatusMap,
  region,
} from "../../utils/common";
import { baseURL } from "../../services/api";
import { IOrder, OrderItem } from "../../types/order";
import useAuth from "../../hooks/useAuth";
import { orderDetailsStyle as styles } from "./style";
import moment from "moment";
import { OrderDetailsNavigationProp } from "../../types/navigation/stack";
import { IUser } from "../../types/user";

type Props = {
  orderItem: OrderItem;
  order: IOrder;
  setShowDeliveryHistory: (val: boolean) => void;
  setCurrentDeliveryHistory: (val: number) => void;
  deliverOrderHandler: (
    deliveryStatus: string,
    orderItem: OrderItem,
    trackingNumber?: string
  ) => Promise<void>;
  updatingStatus: boolean;
  toggleOrderHoldStatus: (item: OrderItem) => Promise<void>;
  navigation: OrderDetailsNavigationProp["navigation"];
  refund: (val: OrderItem) => void;
  paySeller: (val: OrderItem) => void;
  userOrdered: IUser;
  handleCancelOrder: (val: OrderItem) => void;
};

const IsSeller = ({
  orderItem,
  setCurrentDeliveryHistory,
  setShowDeliveryHistory,
  deliverOrderHandler,
  order,
  toggleOrderHoldStatus,
  updatingStatus,
  navigation,
  refund,
  paySeller,
  handleCancelOrder,
}: Props) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [showTracking, setShowTracking] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  const comfirmWaybill = async () => {
    if (!trackingNumber) return;

    await updateTracking();
    setShowTracking(false);
  };

  const showNextStatus = (status: string) => {
    const entries = Object.entries(deliveryStatusMap);
    const currentNumber = deliveryNumber(status);

    return entries[currentNumber];
  };

  const updateTracking = async () => {
    if (updatingStatus) return;

    const nextStatus = showNextStatus(
      orderItem.deliveryTracking.currentStatus.status
    );

    if (nextStatus[1] === 2 && !trackingNumber) {
      setShowTracking(true);
    } else {
      await deliverOrderHandler(
        orderItem.deliveryTracking.currentStatus.status,
        orderItem,
        trackingNumber
      );
    }
  };

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
      <View style={styles.subSumaryContDetails}>
        <Text style={{ display: "none" }}>
          {orderItem.price * orderItem.quantity}
          {orderItem.deliveryOption.fee}
        </Text>
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
                setShowDeliveryHistory(true);
                setCurrentDeliveryHistory(
                  deliveryNumber(
                    orderItem.deliveryTracking.currentStatus.status
                  )
                );
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
          <Text style={styles.name}>
            On{" "}
            {moment(orderItem.deliveryTracking.currentStatus.timestamp).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </Text>
        </View>
        {user &&
          order.buyer._id === user._id &&
          orderItem.deliveryTracking.currentStatus.status === "Delivered" && (
            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() =>
                !updatingStatus && deliverOrderHandler("Received", orderItem)
              }
            >
              <Text style={styles.link}>
                Confirm you have received your order
              </Text>
            </Pressable>
          )}
        {user && (
          <View>
            {showTracking ? (
              <View style={styles.trackingCont}>
                <TextInput
                  placeholder="Enter Tracking number"
                  value={trackingNumber}
                  onChangeText={(e) => setTrackingNumber(e)}
                  style={{ flex: 1, height: 40, marginVertical: 10 }}
                />

                <IconButton
                  size={20}
                  onPress={() => comfirmWaybill()}
                  disabled={updatingStatus}
                  loading={updatingStatus}
                  icon={"check"}
                  iconColor="white"
                  containerColor={colors.primary}
                />
              </View>
            ) : (
              <>
                {orderItem.trackingNumber && (
                  <Text style={[{ marginRight: 20 }]}>
                    Tracking Number: {orderItem.trackingNumber}
                  </Text>
                )}

                {deliveryNumber(
                  orderItem.deliveryTracking.currentStatus.status
                ) < 4 &&
                  !orderItem.isHold && (
                    <Button
                      onPress={() => updateTracking()}
                      children={`Mark as ${
                        showNextStatus(
                          orderItem.deliveryTracking.currentStatus.status
                        )[0]
                      }`}
                      mode="contained"
                      style={{ borderRadius: 5 }}
                      disabled={updatingStatus}
                      loading={updatingStatus}
                    />
                  )}
              </>
            )}
          </View>
        )}
      </View>

      {user?.role === "Admin" && (
        <Button
          style={{ backgroundColor: "red", marginVertical: 10 }}
          onPress={() => handleCancelOrder(orderItem)}
          textColor="white"
          labelStyle={{ color: "white" }}
        >
          Cancel Order
        </Button>
      )}

      <View style={styles.horizontalLine} />
      <View style={styles.detailButton}>
        <View style={styles.orderItem}>
          <Image
            source={{
              uri: baseURL + orderItem.product.images[0],
            }}
            style={styles.image}
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
            onPress={() => {
              navigation.push("Product", {
                slug: orderItem.product.slug,
              });
            }}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.link}>Buy Again</Text>
          </Pressable>
          {user?.role === "Admin" &&
            daydiff(orderItem.deliveryTracking.currentStatus.timestamp, 3) <=
              0 &&
            !orderItem.isHold &&
            deliveryNumber(orderItem.deliveryTracking.currentStatus.status) ===
              11 && (
              <Pressable
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.secondary,
                    marginTop: 5,
                  },
                ]}
                onPress={() => refund(orderItem)}
              >
                <Text style={styles.link}>Refund</Text>
              </Pressable>
            )}
          {user?.role === "Admin" && (
            <Pressable
              onPress={() => toggleOrderHoldStatus(orderItem)}
              style={[
                styles.button,
                {
                  backgroundColor: colors.secondary,
                  marginTop: 10,
                },
              ]}
            >
              <Text style={styles.link}>
                {orderItem?.isHold ? "UnHold" : "Hold"}
              </Text>
            </Pressable>
          )}
          {user?.role === "Admin" &&
            ((daydiff(orderItem.deliveryTracking.currentStatus.timestamp, 3) <=
              0 &&
              deliveryNumber(
                orderItem.deliveryTracking.currentStatus.status
              ) === 4) ||
              deliveryNumber(
                orderItem.deliveryTracking.currentStatus.status
              ) === 5) &&
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
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setShowDelivery(!showDelivery)}
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
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
          color={colors.onBackground}
        />
      </TouchableOpacity>
      {showDelivery ? (
        <>
          {Object.entries(orderItem.deliveryOption).map(([key, value]) =>
            key === "total" ? null : (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                }}
              >
                <Text style={styles.deliveryKey}>{key}:</Text>
                {key === "cost" ? (
                  <Text style={styles.deliveryKey}>
                    {currency(region())}
                    {value}
                  </Text>
                ) : (
                  <Text style={styles.deliveryKey}>{value}</Text>
                )}
              </View>
            )
          )}
          <View style={{ marginTop: 10 }}>
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
                <Text style={{ marginHorizontal: 20 }}>
                  {order.buyer.firstName} {order.buyer.lastName}
                </Text>
              </View>
            </View>
          </View>
          {user?.role === "Admin" && (
            <View style={{ marginTop: 20 }}>
              <Text>Seller Information</Text>
              <View style={styles.userCont}>
                <Image
                  source={{
                    uri: baseURL + orderItem.seller.image,
                  }}
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
                  <Text style={{ marginHorizontal: 20 }}>
                    {orderItem.seller.firstName} {orderItem.seller.lastName}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </>
      ) : null}
    </View>
  );
};

export default IsSeller;
