import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useState } from "react"
import { Appbar, Text, useTheme } from "react-native-paper"
import moment from "moment"
import useAuth from "../../hooks/useAuth"
import { Picker } from "@react-native-picker/picker"
import DeliveryHistory from "../../components/DeliveryHistory"
import { deliveryNumber } from "../../utils/common"
import { ReturnDetailNavigationProp } from "../../types/navigation/stack"
import { returns } from "../../utils/data"
import { IReturn } from "../../types/order"
import Loader from "../../components/ui/Loader"
import useReturn from "../../hooks/useReturn"

type Props = ReturnDetailNavigationProp

const ReturnDetail = ({ navigation, route }: Props) => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { createReturns, error: creatingError } = useReturn()

  const { id: returnId } = route.params

  const [refresh, setRefresh] = useState(true)
  const [enterwaybil, setEnterwaybil] = useState(false)
  const [waybillNumber, setWaybillNumber] = useState("")
  const [reasonText, setReasonText] = useState("")

  const loading = false
  const returned = returns[0]

  const paymentRequest = async (
    userId: string,
    cost: number,
    type: string
  ) => {}

  const handleReturn = async (type: string) => {}

  const deliverOrderHandler = async (
    deliveryStatus: string,
    productId: string
  ) => {}

  const comfirmWaybill = async (product: IReturn) => {
    if (!waybillNumber) return

    await deliverOrderHandler("Return Dispatched", product._id)
    setEnterwaybil(false)
  }

  return loading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Orders" />
        <Appbar.Action
          icon="cart-outline"
          onPress={() => navigation.push("Cart")}
        />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Return ID MRRN: {returnId}</Text>
        <View style={[styles.summaryContDetails]}>
          <Text style={styles.name}>Product</Text>
          <View style={styles.productContainer}>
            <Image
              source={{ uri: returned.productId.images[0] }}
              style={styles.productImage}
            />
            <TouchableOpacity
              onPress={() => {
                // navigate to product details screen
                navigation.push("Product", {
                  slug: returned.productId.slug,
                })
              }}
              style={styles.productNameContainer}
            >
              <Text style={{ color: colors.secondary }}>
                {returned.productId.name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hr} />
          <Text style={styles.name}>Order ID</Text>
          <TouchableOpacity
            onPress={() => {
              // navigate to order details screen
              navigation.push("OrderDetails", {
                id: returned.orderId._id,
              })
            }}
          >
            <Text style={{ color: colors.secondary }}>
              {returned.orderId._id}
            </Text>
          </TouchableOpacity>
          <View style={styles.hr} />
          <Text style={styles.name}>Date</Text>
          <Text style={styles.itemNum}>
            {moment(returned.createdAt).format("MMM DD YY, h:mm a")}
          </Text>
          <View style={styles.hr} />
          <Text style={styles.name}>Buyer</Text>
          <TouchableOpacity
            onPress={() => {
              // navigate to order details screen
              navigation.push("MyAccount", {
                username: returned.orderId.buyer._id,
              })
            }}
          >
            <Text style={{ color: colors.secondary }}>
              {returned.orderId.buyer.username}
            </Text>
          </TouchableOpacity>
          <View style={styles.hr} />
          <Text style={styles.name}>Seller</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.push("MyAccount", {
                username: returned.productId.seller._id,
              })
            }}
          >
            <Text style={{ color: colors.secondary }}>
              {returned.productId.seller.username}
            </Text>
          </TouchableOpacity>
          <View style={styles.hr} />
          <Text style={styles.name}>Preferred Resolution Method</Text>
          <Text style={styles.itemNum}>Report Form</Text>
          <View style={styles.hr} />
          <Text style={styles.name}>Reasons for Return</Text>
          <Text style={styles.itemNum}>{returned.reason}</Text>
          <View style={styles.hr} />
          <Text style={styles.name}>Preferred Sending Method</Text>
          <Text style={styles.itemNum}>{returned.deliveryOption.method}</Text>
          <View style={styles.hr} />
          <Text style={styles.name}>Preferred Refund Method</Text>
          <Text style={styles.itemNum}>{returned.refund}</Text>
          <View style={styles.hr} />
          <Text style={styles.name}>Other Information</Text>
          <Text style={styles.itemNum}>{returned.others}</Text>
          <View style={styles.hr} />
          <Text style={styles.name}>Image</Text>
          <Image style={styles.itemImage} source={{ uri: returned.image }} />
          {returned.status !== "Pending" ? (
            <>
              <View style={styles.hr} />
              <Text style={[styles.name, { color: colors.primary }]}>
                Status
              </Text>
              <Text
                style={[
                  styles.itemNum,
                  {
                    color: returned.status === "Decline" ? "red" : "green",
                  },
                ]}
              >
                {returned.status}
              </Text>
              {returned.status === "Decline" && (
                <Text style={styles.itemNum}>
                  Reason: {returned.adminReason}
                </Text>
              )}
              <View style={styles.hr} />
            </>
          ) : user?.role === "Admin" ? (
            <>
              <View style={styles.container}>
                <TextInput
                  style={styles.textarea}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={"grey"}
                  value={reasonText}
                  onChangeText={setReasonText}
                  placeholder="Enter Reason for Decline here..."
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginRight: 10 }}>
                  <Button
                    title="Approve"
                    onPress={() => handleReturn("Approved")}
                    color={colors.primary}
                  />
                </View>
                <Button
                  title="Decline"
                  onPress={() => handleReturn("Decline")}
                  color={colors.secondary}
                />
              </View>
            </>
          ) : (
            <Text style={{ color: "red" }}>Waiting Admin Approver/Decline</Text>
          )}
          <View>
            {returned.orderId.items.map(
              (orderitem) =>
                orderitem._id === returned.productId._id && (
                  <View key={orderitem._id}>
                    {returned.productId.seller._id === user?._id ? (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.name}>Update Delivery Status</Text>
                        <Picker
                          selectedValue={
                            orderitem.deliveryTracking.currentStatus.status
                          }
                          style={{
                            backgroundColor: colors.elevation.level2,
                            padding: 5,
                            color: "grey",
                          }}
                          onValueChange={(itemValue) => {
                            deliverOrderHandler(
                              itemValue,
                              returned.productId._id
                            )
                            returned.orderId.items.map(async (item) => {
                              if (item._id === returned.productId._id) {
                                await paymentRequest(
                                  returned.orderId.buyer._id,
                                  returned.deliveryOption.fee * 2 +
                                    returned.productId.sellingPrice *
                                      item.quantity,
                                  "Return Completed"
                                )
                              }
                            })
                          }}
                        >
                          <Picker.Item
                            label="--select--"
                            value=""
                            style={{
                              backgroundColor: colors.elevation.level2,
                              color: colors.onBackground,
                            }}
                            enabled={false}
                          />
                          <Picker.Item
                            label="Return Received"
                            value="Return Received"
                            style={{
                              backgroundColor: colors.elevation.level2,
                              color: colors.onBackground,
                            }}
                            enabled={
                              deliveryNumber(
                                orderitem.deliveryTracking.currentStatus.status
                              ) === 10
                            }
                          />
                        </Picker>
                      </View>
                    ) : returned.orderId.buyer._id === user?._id ? (
                      enterwaybil ? (
                        <View>
                          <TextInput
                            style={styles.textarea}
                            placeholderTextColor={"grey"}
                            value={waybillNumber}
                            onChangeText={(text) => setWaybillNumber(text)}
                            placeholder="Enter Tracking number..."
                          />
                          <TouchableOpacity
                            style={{ backgroundColor: colors.primary }}
                            onPress={() => comfirmWaybill(orderitem)}
                          ></TouchableOpacity>
                        </View>
                      ) : (
                        <>
                          <View>
                            <Picker
                              style={{
                                backgroundColor: colors.background,
                                padding: 5,
                                color: "grey",
                              }}
                              selectedValue={
                                orderitem.deliveryTracking.currentStatus.status
                              }
                              onValueChange={(itemValue) => {
                                if (itemValue === "Return Dispatched") {
                                  setEnterwaybil(true)
                                } else {
                                  deliverOrderHandler(
                                    itemValue,
                                    returned.productId._id
                                  )
                                }
                              }}
                            >
                              <Picker.Item
                                label="Update Delivery Status"
                                value=""
                                style={{
                                  backgroundColor: colors.elevation.level2,
                                  color: colors.onBackground,
                                }}
                                enabled={false}
                              />
                              <Picker.Item
                                label="Return Dispatched"
                                value="Return Dispatched"
                                style={{
                                  backgroundColor: colors.elevation.level2,
                                  color: colors.onBackground,
                                }}
                                enabled={
                                  !!(
                                    deliveryNumber(
                                      orderitem.deliveryTracking.currentStatus
                                        .status
                                    ) === 8 && returned.returnDelivery
                                  )
                                }
                              />
                              <Picker.Item
                                label="Return Delivered"
                                value="Return Delivered"
                                enabled={
                                  deliveryNumber(
                                    orderitem.deliveryTracking.currentStatus
                                      .status
                                  ) === 9
                                }
                              />
                            </Picker>
                          </View>
                        </>
                      )
                    ) : // Other cases
                    null}
                    <View style={{ marginTop: 15 }}>
                      <DeliveryHistory
                        status={deliveryNumber(
                          orderitem.deliveryTracking.currentStatus.status
                        )}
                      />
                    </View>
                  </View>
                )
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ReturnDetail

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 10 },
  title: {
    fontSize: 25,
    lineHeight: 25,
    fontFamily: "absential-sans-medium",
    marginBottom: 10,
  },
  itemNum: {
    flexDirection: "row",
  },
  name: {
    textTransform: "capitalize",
    fontWeight: "800",
    marginBottom: 5,
  },
  summaryContDetails: {
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    resizeMode: "cover",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productNameContainer: { marginLeft: 20 },
  hr: {
    width: "100%",
    height: 1,
    marginVertical: 15,
    backgroundColor: "grey",
    opacity: 0.4,
  },
  textarea: {
    // width: "50%",
    height: 100,
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
  },
  itemImage: {
    width: 120,
    height: 200,
  },
})
