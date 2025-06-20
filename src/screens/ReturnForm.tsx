import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useState } from "react"
import { Appbar, Button, Text, useTheme } from "react-native-paper"
import { ReturnFormNavigationProp } from "../types/navigation/stack"
import SelectDropdown from "react-native-select-dropdown"
import { Entypo, Ionicons } from "@expo/vector-icons"
import { currency, deleteImage, deliveryNumber } from "../utils/common"
import { OrderItem } from "../types/order"
import * as ImagePicker from "expo-image-picker"
import useToastNotification from "../hooks/useToastNotification"
import useReturn from "../hooks/useReturn"
import { baseURL } from "../services/api"
import useMessage from "../hooks/useMessage"
import { uploadOptimizeImage } from "../utils/image"
import { Picker } from "@react-native-picker/picker"

type Props = ReturnFormNavigationProp

const ReturnForm = ({ navigation, route }: Props) => {
  const { orderItems, orderId = "233", waybillNumber } = route.params
  const { colors } = useTheme()
  const { addNotification } = useToastNotification()
  const { createReturns } = useReturn()
  const { createMessage, error: messageError } = useMessage()

  const [tab, setTab] = useState("items")
  const [current, setCurrent] = useState<OrderItem>()
  const [error, setError] = useState("")
  const [reason, setReason] = useState("")
  const [sending, setSending] = useState("")
  const [refund, setRefund] = useState("")
  const [description, setDescription] = useState("")
  const [invalidImage, setInvalidImage] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [messageLoading, setMessageLoading] = useState(false)
  const [handledImage, setHandledImage] = useState<number>()

  const addConversation = async (sellerId?: string, userId?: string) => {
    if (!sellerId || !userId) return

    setMessageLoading(true)
    try {
      const convo = await createMessage({
        participantId: sellerId,
        type: "Chat",
      })
      navigation.push("Chat", { conversationId: convo._id })
    } catch (error) {
      addNotification({
        message: messageError || (error as string),
        error: true,
      })
    }

    setMessageLoading(false)
  }

  const deliverOrderHandler = async (
    deliveryStatus: string,
    orderitem: OrderItem
  ) => {
    if (!reason.length) {
      addNotification({
        message: "Please select a reason for return",
        error: true,
      })
      return
    }
    if (!sending) {
      addNotification({
        message: "Please select a method of sending",
        error: true,
      })
      return
    }
    if (!refund.length) {
      addNotification({
        message: "Please select a method of refund",
        error: true,
      })
      return
    }

    if (!current) {
      addNotification({
        message: "Please select the item you want to return",
        error: true,
      })
      return
    }

    setUpdatingStatus(true)

    const res = await createReturns({
      deliveryOption: orderitem.deliveryOption,
      images,
      image: images[0],
      orderId,
      others: description,
      productId: orderitem.product._id,
      reason,
      refund,
    })
    if (res) {
      addNotification({ message: "Return logged successfully" })
      setImages([])
      setReason("")
      setDescription("")
      setSending("")
      setRefund("")
      navigation.navigate("ReturnDetail", { id: res._id })
    } else {
      addNotification({
        message: error || "Failed to update status",
        error: true,
      })
    }

    setUpdatingStatus(false)
  }

  const handleReturn = async () => {
    if (!reason.length) {
      setError("Please select a reason for return")
      return
    }
    if (!sending) {
      setError("Please select a method of sending")
      return
    }
    if (!refund.length) {
      setError("Please select a method of refund")
      return
    }

    if (!current) {
      setError("Please select an item")
      return
    }

    // Send request

    await deliverOrderHandler("Return Logged", current)

    setImages([])
  }

  const pickImage = async () => {
    try {
      setLoadingUpload(true)

      const res = await uploadOptimizeImage()
      setImages([...images, res as string])
    } catch (error: any) {
      addNotification({
        message: error || "Unable to upload image try again later",
        error: true,
      })
    } finally {
      setLoadingUpload(false)
    }
  }

  const onDeleteImage = async (key: number) => {
    if (!images[key]) return
    setHandledImage(key)
    try {
      setLoadingUpload(true)
      const imageName = (images[key] as string).split("/").pop()
      if (imageName) {
        const res = await deleteImage(imageName)
        addNotification({ message: res })
        setImages(images.filter((_, index) => index !== key))
      }
    } catch (error) {
      addNotification({ message: "Failed to delete image", error: true })
    }
    setHandledImage(undefined)
    setLoadingUpload(false)
  }

  const displayTab = () => {
    switch (tab) {
      case "items":
        return (
          <View style={styles.content}>
            <Text style={styles.heading}>Select a Product to Return</Text>
            {orderItems.map((orderitem) => (
              <View
                key={orderitem._id}
                style={{
                  backgroundColor: colors.elevation.level2,
                  width: "100%",
                  marginVertical: 10,
                }}
              >
                <TouchableOpacity
                  style={styles.itemCont}
                  onPress={() => {
                    setTab("option")
                    setCurrent(orderitem)
                  }}
                >
                  <View style={styles.orderItem}>
                    <Image
                      style={styles.image}
                      source={{ uri: baseURL + orderitem.product.images[0] }}
                    />
                    <View style={styles.details1}>
                      <Text style={[styles.name]}>
                        {orderitem.product.name}
                      </Text>
                      <Text style={[styles.quantity]}>
                        QTY: {orderitem.quantity}
                      </Text>
                      <Text style={[styles.itemPrice]}>
                        {currency(orderitem.product.region)}{" "}
                        {orderitem.quantity * orderitem.price}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={colors.onBackground}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )
      case "option":
        return (
          <View style={styles.content}>
            {current ? (
              <View style={[styles.orderItem, { marginVertical: 10 }]}>
                <Image
                  source={{ uri: baseURL + current.product.images[0] }}
                  style={styles.image}
                />
                <View style={styles.details1}>
                  <Text style={[styles.name]}>{current.product.name}</Text>
                  <Text style={[styles.quantity]}>QTY: {current.quantity}</Text>
                  <Text style={[styles.itemPrice]}>
                    {currency(current.product.region)} {current.price}
                  </Text>
                </View>
              </View>
            ) : (
              <>{setTab("items")}</>
            )}
            <Text style={[styles.heading]}>Preferred Resolution Method</Text>
            <View style={styles.options}>
              <TouchableOpacity
                style={[styles.option]}
                onPress={() =>
                  current &&
                  navigation.push("Sell", {
                    id: current.product._id,
                    slug: current.product.slug,
                    relist: true,
                    orderId: orderId,
                  })
                }
              >
                <View style={{ flexDirection: "row" }}>
                  <Entypo
                    name="shop"
                    size={18}
                    color={colors.primary}
                    style={{ paddingHorizontal: 20 }}
                  />
                  <View>
                    <Text style={[styles.optionName]}>
                      Re-list and sell my product
                    </Text>

                    <Text style={[styles.text3]}>
                      Become a seller and sell the product
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {messageLoading ? (
                <ActivityIndicator />
              ) : (
                <TouchableOpacity
                  style={[styles.option]}
                  onPress={() =>
                    current && addConversation(current.seller._id, current._id)
                  }
                  disabled={messageLoading}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Entypo
                      name="message"
                      size={18}
                      color={colors.primary}
                      style={{ paddingHorizontal: 20 }}
                    />
                    <View>
                      <Text style={[styles.optionName]}>Message seller</Text>

                      <Text style={[styles.text3]}>
                        Contact the seller and make complains
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {current &&
              deliveryNumber(current.deliveryTracking.currentStatus.status) ===
                4 ? (
                <TouchableOpacity
                  style={[styles.option]}
                  onPress={() => setTab("form")}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Entypo
                      name="new-message"
                      size={18}
                      color={colors.primary}
                      style={{ paddingHorizontal: 20 }}
                    />
                    <View>
                      <Text style={[styles.optionName]}>Return form</Text>

                      <Text style={[styles.text3]}>
                        Fill a return form and await admin Approval
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )
      case "form":
        return (
          <View style={styles.content}>
            {current ? (
              <View style={[styles.orderItem, { marginVertical: 10 }]}>
                <Image
                  style={styles.image}
                  source={{ uri: baseURL + current.product.images[0] }}
                />
                <View style={styles.details1}>
                  <Text style={styles.name}>{current.product.name}</Text>
                  <Text style={styles.quantity}>QTY: {current.quantity}</Text>
                  <Text style={styles.itemPrice}>
                    {currency(current.product.region)} {current.price}
                  </Text>
                </View>
              </View>
            ) : (
              <>{setTab("items")}</>
            )}
            <View style={styles.form}>
              {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
              <View style={styles.inputCont}>
                <Text style={styles.label}>Reasons for Return</Text>
                <Picker
                  selectedValue={reason}
                  style={{
                    backgroundColor: colors.elevation.level3,
                    paddingHorizontal: 0,
                    fontSize: 8,
                    color: colors.onBackground,
                  }}
                  onValueChange={(itemValue) => {
                    setReason(itemValue)
                  }}
                  mode="dropdown"
                >
                  <Picker.Item
                    style={{
                      backgroundColor: colors.elevation.level2,
                      color: colors.onBackground,
                    }}
                    label={"--select--"}
                    value={""}
                  />
                  {[
                    "Missing or wrong product, not what i ordered",
                    "Product condition is significantly not as described",
                    "The product is totally defective or completely damage",
                  ].map((val, index) => (
                    <Picker.Item
                      style={{
                        backgroundColor: colors.elevation.level2,
                        color: colors.onBackground,
                      }}
                      key={index}
                      label={val}
                      value={val}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputCont}>
                <Text style={styles.label}>Preferred Sending Method</Text>

                <Picker
                  selectedValue={sending}
                  style={{
                    backgroundColor: colors.elevation.level3,
                    paddingHorizontal: 0,
                    fontSize: 8,
                    color: colors.onBackground,
                  }}
                  onValueChange={(itemValue) => {
                    setSending(itemValue)
                  }}
                  mode="dropdown"
                >
                  <Picker.Item
                    style={{
                      backgroundColor: colors.elevation.level2,
                      color: colors.onBackground,
                    }}
                    label={"--select--"}
                    value={""}
                  />
                  {[current?.deliveryOption.method].map((val, index) => (
                    <Picker.Item
                      style={{
                        backgroundColor: colors.elevation.level2,
                        color: colors.onBackground,
                      }}
                      key={index}
                      label={val}
                      value={val}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputCont}>
                <Text style={styles.label}>Preferred Refund Method</Text>
                <Picker
                  selectedValue={refund}
                  style={{
                    backgroundColor: colors.elevation.level3,
                    paddingHorizontal: 0,
                    fontSize: 8,
                    color: colors.onBackground,
                  }}
                  onValueChange={(itemValue) => {
                    setRefund(itemValue)
                  }}
                  mode="dropdown"
                >
                  <Picker.Item
                    style={{
                      backgroundColor: colors.elevation.level2,
                      color: colors.onBackground,
                    }}
                    label={"--select--"}
                    value={""}
                  />
                  {[
                    "Refund to my original payment method",
                    "Credit my Repeddle wallet",
                  ].map((val, index) => (
                    <Picker.Item
                      style={{
                        backgroundColor: colors.elevation.level2,
                        color: colors.onBackground,
                      }}
                      key={index}
                      label={val}
                      value={val}
                    />
                  ))}
                </Picker>
              </View>
              <View style={[styles.inputCont, { width: "90%" }]}>
                <Text style={styles.label}>More Information</Text>
                <TextInput
                  style={[
                    styles.textarea,
                    {
                      backgroundColor: colors.elevation.level2,
                      textAlignVertical: "top",
                      color: colors.onBackground,
                    },
                  ]}
                  multiline={true}
                  placeholder="   More information"
                  placeholderTextColor={colors.onBackground}
                  numberOfLines={5}
                  onChangeText={(text) => setDescription(text)}
                  value={description}
                />
              </View>
              <View style={[styles.inputCont, { alignItems: "center" }]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginBottom: 20,
                    gap: 15,
                    width: "100%",
                  }}
                >
                  {images.map((image, index) => (
                    <>
                      {handledImage === index ? (
                        <ActivityIndicator
                          size={"large"}
                          color={colors.primary}
                        />
                      ) : (
                        <View>
                          <Image
                            source={{ uri: baseURL + image }}
                            style={styles.image}
                            key={index}
                          />
                          <Pressable
                            style={styles.trash}
                            onPress={() => onDeleteImage(index)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color="black"
                            />
                          </Pressable>
                        </View>
                      )}
                    </>
                  ))}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {images.length < 3 && (
                    <TouchableOpacity onPress={pickImage} style={styles.label1}>
                      <Ionicons
                        name="camera-outline"
                        size={24}
                        color={colors.onBackground}
                        style={{ marginRight: 10 }}
                      />
                      <Text>Upload Image</Text>
                    </TouchableOpacity>
                  )}
                  {invalidImage ? (
                    <Text style={{ color: "red" }}>{invalidImage}</Text>
                  ) : null}
                  {loadingUpload ? (
                    <ActivityIndicator size={"large"} color={colors.primary} />
                  ) : null}
                </View>
              </View>
              {/* <View
                style={{
                  padding: 10,
                  width: "100%",
                }}
              > */}
              <Button
                mode="contained"
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.primary,
                    maxWidth: "90%",
                    marginHorizontal: "auto",
                    marginTop: 10,
                  },
                ]}
                onPress={handleReturn}
                loading={updatingStatus}
                disabled={updatingStatus}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "600",
                    width: "90%",
                  }}
                >
                  Submit
                </Text>
              </Button>
              {/* </View> */}
            </View>
          </View>
        )
      default:
        break
    }
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
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Return Form" />
      </Appbar.Header>

      <ScrollView>
        <View>{displayTab()}</View>
      </ScrollView>
    </View>
  )
}

export default ReturnForm

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  heading: { fontSize: 18, paddingVertical: 10, fontWeight: "600" },
  orderItem: {
    flexDirection: "row",
    // width: "100%",
  },
  image: {
    resizeMode: "cover",
    width: 80,
    height: 100,
  },
  details1: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  name: {
    textTransform: "capitalize",
    fontWeight: "600",
    marginBottom: 10,
  },
  quantity: {
    marginBottom: 10,
  },
  itemPrice: {
    fontFamily: "absential-sans-bold",
  },
  itemCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  inputCont: {
    marginVertical: 10,
    marginHorizontal: 20,
    width: "90%",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  label1: {
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  textarea: {
    // height: 100,
    borderRadius: 5,
    width: "100%",
    padding: 10,
  },
  button: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 5,
  },
  form: {
    width: "100%",
    alignItems: "flex-start",
  },
  selectOpt: {
    margin: 5,
    padding: 5,
    borderRadius: 5,
  },
  options: {
    width: "100%",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    justifyContent: "space-between",
    marginVertical: 10,
  },
  optionName: {
    textTransform: "capitalize",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  text3: { fontSize: 12, opacity: 0.5 },
  trash: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 2,
    borderRadius: "50%",
    backgroundColor: "white",
  },
})
