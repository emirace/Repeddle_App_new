import {
  Modal,
  ScrollView,
  StyleProp,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Appbar, Text, useTheme } from "react-native-paper";
import useOrder from "../../hooks/useOrder";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { OrderDetailsNavigationProp } from "../../types/navigation/stack";
import { IOrder, OrderItem } from "../../types/order";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import {
  currency,
  deliveryNumber,
  deliveryStatusMap,
  region,
  timeDifference,
} from "../../utils/common";
import DeliveryHistory from "../../components/DeliveryHistory";
import Loader from "../../components/ui/Loader";
import useToastNotification from "../../hooks/useToastNotification";
import CartIcon from "../../components/ui/cartIcon";
import IsSeller from "../../section/orderDetails/IsSeller";
import IsUser from "../../section/orderDetails/IsUser";
import { orderDetailsStyle as styles } from "../../section/orderDetails/style";
import usePayments from "../../hooks/usePayment";

type Props = OrderDetailsNavigationProp;

const OrderDetails = ({ navigation, route }: Props) => {
  const { colors, dark } = useTheme();
  const {
    fetchOrderById,
    error,
    updateOrderItemTracking,
    updateOrderItemStatus,
  } = useOrder();
  const { user } = useAuth();
  const { addNotification } = useToastNotification();
  const { paySeller, refundBuyer } = usePayments();
  const { id } = route.params;

  const viewShotRef = useRef<ViewShot>(null);

  const [order, setOrder] = useState<IOrder>();

  const [loading, setLoading] = useState(false);
  const [showDeliveryHistory, setShowDeliveryHistory] = useState(false);
  const [currentDeliveryHistory, setCurrentDeliveryHistory] = useState(0);
  const [showTracking, setShowTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [afterAction, setAfterAction] = useState(false);
  const [showDelivery, setShowDelivery] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showError, setShowError] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const res = await fetchOrderById(id);
      if (res) {
        setOrder(res);
        if (user) {
          const existSell = res.items.filter((x) => x.seller._id === user._id);
          if (existSell.length) {
            setIsSeller(true);
          }
        }
      } else {
        setShowError(true);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [id, refresh]);

  const comfirmWaybill = async (order: OrderItem) => {
    if (!trackingNumber) return;

    await deliverOrderHandler("Dispatched", order, order._id);
    setShowTracking(false);
  };

  const daydiff = (start: Date | string | number, end: number) => {
    if (!start) return 0;
    const startNum = timeDifference(new window.Date(start), new window.Date());
    return end - startNum;
  };

  const generatePDF = async () => {
    if (!viewShotRef.current?.capture) return;
    console.log(viewShotRef.current.capture);

    // Take a snapshot of the screen
    const snapshot = await viewShotRef.current.capture();
    console.log("eeeeeeee1", snapshot);
    // Create the PDF file

    const ul =
      "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg";
    const pdfDocument = await Print.printToFileAsync({
      html: `<html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body style="text-align: center;">
        <img
          src="${snapshot}"
          style="width: 90vw; height:100vh" />
      </body>
    </html>`,
    });

    // const pdfDocument = await Print.printToFileAsync({
    //   html: `<html><body><img src="${ul}" /></body></html>`,
    // })

    console.log("eeeeeeee3", pdfDocument);
    const pdfUri = pdfDocument.uri;
    await FileSystem.moveAsync({
      from: pdfUri,
      to: FileSystem.documentDirectory + "your-screen.pdf",
    });
    await Print.printAsync({
      html: `<html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <body style="text-align: center;">
        <img
          src="${snapshot}"
          style="width: 90vw; height:100vh" />
      </body>
    </html>`,
    });
    console.log("PDF saved successfully!");
  };

  const showNextStatus = (status: string) => {
    const entries = Object.entries(deliveryStatusMap);
    const currentNumber = deliveryNumber(status);

    return entries[currentNumber];
  };

  const deliverOrderHandler = async (
    currentStatus: string,
    orderItem: OrderItem,
    trackingNumber?: string
  ) => {
    if (!order) return;
    const nextStatus = showNextStatus(currentStatus);

    if (nextStatus[1] === 2) {
      if (!trackingNumber) {
        addNotification({
          message: "Tracking number is required to dispatch item",
          error: true,
        });
        return;
      }
    }

    setUpdatingStatus(true);

    const res = await updateOrderItemTracking(
      order._id,
      orderItem.product._id,
      {
        status: nextStatus[0],
        trackingNumber,
      }
    );
    if (res) {
      addNotification({ message: "Item status has been updated" });
      setOrder(res);
    } else {
      addNotification({
        message: error || "Failed to update status",
        error: true,
      });
    }

    setUpdatingStatus(false);
  };

  const handleCancelOrder = (item: OrderItem) => {
    console.log(item);
  };

  const onRefund = async (item: OrderItem) => {
    if (!order) return;
    setUpdatingStatus(true);
    const data = await refundBuyer(
      order._id,
      item.product._id,
      order.buyer._id
    );

    if (typeof data !== "string") {
      addNotification({ message: data.message });
    } else addNotification({ message: data, error: true });

    setUpdatingStatus(false);
  };

  const onPaySeller = async (item: OrderItem) => {
    if (!order) return;
    setUpdatingStatus(true);
    const data = await paySeller(order._id, item.product._id, item.seller._id);

    if (typeof data === "string") {
      addNotification({ message: data, error: true });
      setUpdatingStatus(false);
      return;
    }

    addNotification({ message: data.message });

    setRefresh(true);

    setUpdatingStatus(false);
  };

  const toggleOrderHoldStatus = async (item: OrderItem) => {
    if (!id) return;

    const res = await updateOrderItemStatus(
      id,
      item._id,
      item.isHold ? "unhold" : "hold"
    );
    if (res) {
      setOrder(res);
      addNotification({ message: "Item status has been updated" });
    } else {
      addNotification({ message: "Failed to update status", error: true });
    }
  };

  const paymentRequest = async (
    seller: string,
    cost: number,
    itemCurrency: string,
    sellerImage: string
  ) => {};

  let shippingPrice = 0;
  let itemsPrice = 0;

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
        <Appbar.Content
          style={{ flex: 0 }}
          title={
            <View>
              <CartIcon
                iconColor="white"
                onPress={() => navigation.push("Cart")}
              />
            </View>
          }
        />
      </Appbar.Header>

      {loading ? (
        <Loader />
      ) : showError && error ? (
        <Text1 style={{ color: "red" }}>{error}</Text1>
      ) : order ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
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
            </View>

            {order.items.map((orderitem) =>
              orderitem.seller._id === user?._id ? (
                <IsSeller
                  userOrdered={order.buyer}
                  orderItem={orderitem}
                  deliverOrderHandler={deliverOrderHandler}
                  handleCancelOrder={handleCancelOrder}
                  paySeller={onPaySeller}
                  refund={onRefund}
                  setCurrentDeliveryHistory={setCurrentDeliveryHistory}
                  setShowDeliveryHistory={setShowDeliveryHistory}
                  updatingStatus={updatingStatus}
                  toggleOrderHoldStatus={toggleOrderHoldStatus}
                  order={order}
                  navigation={navigation}
                />
              ) : (
                <IsUser
                  orderItem={orderitem}
                  userOrdered={order.buyer}
                  deliverOrderHandler={deliverOrderHandler}
                  handleCancelOrder={handleCancelOrder}
                  paySeller={onPaySeller}
                  refund={onRefund}
                  setCurrentDeliveryHistory={setCurrentDeliveryHistory}
                  setShowDeliveryHistory={setShowDeliveryHistory}
                  updatingStatus={updatingStatus}
                  toggleOrderHoldStatus={toggleOrderHoldStatus}
                  navigation={navigation}
                  order={order}
                  id={id}
                />
              )
            )}

            <Modal
              animationType="slide"
              visible={showDeliveryHistory}
              onRequestClose={() => {
                setShowDeliveryHistory(!showDeliveryHistory);
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
                  <Text1 style={styles.name}>Payment Status</Text1>
                  <View style={styles.itemNum}>
                    {order.paymentMethod ? (
                      <Text style={{ color: colors.primary }}>Paid</Text>
                    ) : (
                      <Text style={{ color: colors.secondary }}>Not Paid</Text>
                    )}
                  </View>
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

                          {isSeller
                            ? shippingPrice
                            : order.items.reduce(
                                (prev, curr) => prev + curr.deliveryOption.fee,
                                0
                              )}
                          {shippingPrice}
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
                              ? itemsPrice +
                                order.items.reduce(
                                  (prev, curr) =>
                                    prev + curr.deliveryOption.fee,
                                  0
                                )
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
                              {itemsPrice +
                                order.items.reduce(
                                  (prev, curr) =>
                                    prev + curr.deliveryOption.fee,
                                  0
                                )}
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
                                (itemsPrice +
                                  order.items.reduce(
                                    (prev, curr) =>
                                      prev + curr.deliveryOption.fee,
                                    0
                                  ))
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
                                order.items.reduce(
                                  (prev, curr) =>
                                    prev + curr.deliveryOption.fee,
                                  0
                                ) -
                                (7.9 / 100) *
                                  (itemsPrice +
                                    order.items.reduce(
                                      (prev, curr) =>
                                        prev + curr.deliveryOption.fee,
                                      0
                                    ))
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
          </ViewShot>
        </ScrollView>
      ) : null}
    </View>
  );
};

export default OrderDetails;

type TextaProps = PropsWithChildren<{
  style?: StyleProp<TextStyle>;
}> &
  TextProps;

const Text1 = ({ style, children, ...props }: TextaProps) => {
  return (
    <Text style={[style]} {...props}>
      {children}
    </Text>
  );
};
