import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useState } from "react"
import { Appbar, Button, IconButton, Text, useTheme } from "react-native-paper"
import moment from "moment"
import useAuth from "../../hooks/useAuth"
import DeliveryHistory from "../../components/DeliveryHistory"
import { deliveryNumber, deliveryStatusMap } from "../../utils/common"
import { ReturnDetailNavigationProp } from "../../types/navigation/stack"
import { IReturn } from "../../types/order"
import Loader from "../../components/ui/Loader"
import useReturn from "../../hooks/useReturn"
import useToastNotification from "../../hooks/useToastNotification"
import { baseURL } from "../../services/api"

type Props = ReturnDetailNavigationProp

const ReturnDetail = ({ navigation, route }: Props) => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const {
    fetchReturnById,
    error,
    updateReturnStatusAdmin,
    updateReturnStatus,
  } = useReturn()
  const { addNotification } = useToastNotification()

  const { id: returnId } = route.params

  const [reasonText, setReasonText] = useState("")
  const [showModel, setShowModel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingReturn, setLoadingReturn] = useState(false)
  const [returned, setReturned] = useState<IReturn>()
  const [showTracking, setShowTracking] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

  console.log(returned)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      if (!returnId)
        return addNotification({ message: "Id not found", error: true })
      const res = await fetchReturnById(returnId)
      if (typeof res !== "string") {
        setReturned(res)
      } else {
        addNotification({ message: error, error: true })
      }

      setLoading(false)
    }

    getData()
  }, [])

  const showNextStatus = (status: string) => {
    const entries = Object.entries(deliveryStatusMap)
    const currentNumber = deliveryNumber(status)

    return entries[currentNumber]
  }

  const handleReturn = async (type: string) => {
    console.log(returnId)
    if (type === "Declined") {
      if (!reasonText.length) {
        addNotification({ message: "Enter Reason for Decline", error: true })
        return
      }
      setLoadingReturn(true)

      const res = await updateReturnStatusAdmin(returnId ?? "", {
        adminReason: reasonText,
        status: type,
      })

      if (typeof res !== "string") {
        setReturned(res)
      } else {
        addNotification({ message: error, error: true })
      }
    } else {
      setLoadingReturn(true)

      const res = await updateReturnStatusAdmin(returnId ?? "", {
        adminReason: reasonText,
        status: type,
      })

      if (typeof res !== "string") {
        setReturned(res)
      } else {
        addNotification({ message: error, error: true })
      }
    }

    setLoadingReturn(false)
  }

  const updateTracking = async () => {
    if (!returned) return

    const nextStatus = showNextStatus(
      returned.deliveryTracking.currentStatus.status
    )

    if (nextStatus[1] === 9 && !trackingNumber) {
      setShowTracking(true)
    } else {
      setLoadingReturn(true)
      const body: { status: string; trackingNumber?: string } = {
        status: nextStatus[0],
      }

      if (trackingNumber) body["trackingNumber"] = trackingNumber

      const res = await updateReturnStatus(returned._id, body)

      if (typeof res !== "string") {
        setReturned(res)
        addNotification({ message: "Item status updated" })
      } else
        addNotification({
          message: error || "Failed to update status",
          error: true,
        })

      setLoadingReturn(false)
    }
  }

  const confirmTracking = async () => {
    if (!trackingNumber)
      addNotification({ message: "Tracking number is required", error: true })

    await updateTracking()

    setShowTracking(false)
    setTrackingNumber("")
  }

  const paymentRequest = async (
    userId: string,
    cost: number,
    type: string
  ) => {}

  return loading ? (
    <Loader />
  ) : returned ? (
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
        <Appbar.Content
          titleStyle={{ color: "white" }}
          title="Return Details"
        />
      </Appbar.Header>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Return ID MRRN: {returnId}</Text>
        <View style={[styles.summaryContDetails]}>
          <Text style={styles.name}>Product</Text>
          <View style={styles.productContainer}>
            <Image
              source={{ uri: baseURL + returned.productId.images[0] }}
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
                username: returned.orderId.buyer.username,
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
                username: returned.productId.seller.username,
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
          {returned.image && (
            <>
              <View style={styles.hr} />
              <Text style={styles.name}>Image</Text>
              <Image
                style={styles.itemImage}
                source={{ uri: baseURL + returned.image }}
              />
            </>
          )}
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
                    color: returned.status === "Declined" ? "red" : "green",
                  },
                ]}
              >
                {returned.status}
              </Text>
              {returned.status === "Declined" && (
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
                  style={[
                    styles.textarea,
                    { textAlignVertical: "top", color: "white" },
                  ]}
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
                    children="Approve"
                    mode="contained"
                    style={{ borderRadius: 5 }}
                    onPress={() => handleReturn("Approved")}
                    loading={loadingReturn}
                    disabled={loadingReturn}
                  />
                </View>
                <Button
                  children="Decline"
                  mode="contained"
                  style={{ borderRadius: 5, backgroundColor: colors.secondary }}
                  onPress={() => handleReturn("Declined")}
                  loading={loadingReturn}
                  disabled={loadingReturn}
                />
              </View>
            </>
          ) : (
            <Text style={{ color: "red" }}>Waiting Admin Approval/Decline</Text>
          )}
          <View>
            {returned.orderId.items.map(
              (orderitem) =>
                (orderitem.product as unknown) === returned.productId._id && (
                  <View key={orderitem._id}>
                    {returned.productId.seller._id === user?._id ? (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.name}>Update Delivery Status</Text>
                        {deliveryNumber(
                          returned.deliveryTracking.currentStatus.status
                        ) === 10 ? (
                          <Button
                            onPress={updateTracking}
                            loading={loadingReturn}
                            disabled={loadingReturn}
                            style={{ borderRadius: 5 }}
                            mode="contained"
                          >
                            {`Mark as ${
                              showNextStatus(
                                returned.deliveryTracking.currentStatus.status
                              )[0]
                            }`}
                          </Button>
                        ) : null}
                      </View>
                    ) : returned.orderId.buyer._id === user?._id ? (
                      showTracking ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <TextInput
                            style={[
                              styles.textarea,
                              {
                                textAlignVertical: "top",
                                color: "white",
                                marginBottom: 0,
                              },
                            ]}
                            placeholderTextColor={"grey"}
                            value={trackingNumber}
                            onChangeText={(text) => setTrackingNumber(text)}
                            placeholder="Enter Tracking number..."
                          />
                          <Button
                            mode="contained"
                            onPress={confirmTracking}
                            loading={loadingReturn}
                            disabled={loadingReturn}
                            style={{ borderRadius: 5 }}
                          >
                            Confirm
                          </Button>
                        </View>
                      ) : (
                        <>
                          {returned?.trackingNumber && (
                            <Text style={{ marginBottom: 10 }}>
                              Tracking Number: {returned.trackingNumber}
                            </Text>
                          )}
                          {deliveryNumber(
                            returned.deliveryTracking.currentStatus.status
                          ) > 7 &&
                            deliveryNumber(
                              returned.deliveryTracking.currentStatus.status
                            ) < 10 && (
                              <Button
                                mode="contained"
                                onPress={updateTracking}
                                loading={loadingReturn}
                                disabled={loadingReturn}
                                style={{ borderRadius: 5 }}
                              >
                                {`Mark as ${
                                  showNextStatus(
                                    returned.deliveryTracking.currentStatus
                                      .status
                                  )[0]
                                }`}
                              </Button>
                            )}
                        </>
                      )
                    ) : // Other cases
                    null}
                    <View style={{ marginTop: 15 }}>
                      <DeliveryHistory
                        status={deliveryNumber(
                          returned.deliveryTracking.currentStatus.status
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
  ) : null
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
    marginBottom: 20,
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
    // height: 50,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    flex: 1,
  },
  itemImage: {
    width: 120,
    height: 200,
    marginBottom: 20,
  },
})
