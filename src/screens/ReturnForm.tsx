import {
  ActivityIndicator,
  Alert,
  Image,
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
import { currency, deliveryNumber, uploadImage } from "../utils/common"
import { OrderItem } from "../types/order"
import * as ImagePicker from "expo-image-picker"
import useToastNotification from "../hooks/useToastNotification"

type Props = ReturnFormNavigationProp

const ReturnForm = ({ navigation, route }: Props) => {
  const { orderItems, orderId, waybillNumber } = route.params
  const { colors } = useTheme()
  const { addNotification } = useToastNotification()

  const [tab, setTab] = useState("items")
  const [current, setCurrent] = useState<OrderItem>()
  const [error, setError] = useState("")
  const [reason, setReason] = useState("")
  const [sending, setSending] = useState("")
  const [refund, setRefund] = useState("")
  const [description, setDescription] = useState("")
  const [invalidImage, setInvalidImage] = useState("")
  const [image, setImage] = useState("")
  const [loadingUpload, setLoadingUpload] = useState(false)

  const loading = false

  const addConversation = async (sellerId: string, itemId: string) => {}

  const deliverOrderHandler = async (
    deliveryStatus: string,
    productId: string,
    orderitem: OrderItem
  ) => {}

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

    deliverOrderHandler("Return Logged", current._id, current)

    setImage("")
    navigation.goBack()
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      let localUri = result.assets[0].uri
      let filename = localUri.split("/").pop()
      if (!filename) return
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`

      uploadImageHandler({ uri: localUri, name: filename, type })
      console.log({ uri: localUri, name: filename, type })
    }
  }

  const uploadImageHandler = async (photo: any) => {
    const file = photo as File
    const bodyFormData = new FormData()
    bodyFormData.append("file", file)
    setLoadingUpload(true)
    try {
      const res = await uploadImage(file)
      setImage(res)
    } catch (error) {
      addNotification({ message: error as string, error: true })
    }
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
                      source={{ uri: orderitem.product.images[0] }}
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
                  source={{ uri: current.product.images[0] }}
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
                  navigation.push("EditProduct", {
                    id: current.product._id,
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
              <TouchableOpacity
                style={[styles.option]}
                onPress={() =>
                  current && addConversation(current.seller._id, current._id)
                }
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
                  source={{ uri: current.product.images[0] }}
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
                <SelectDropdown
                  data={[
                    "Missing or wrong product, not what i ordered",
                    "Product condition is significantly not as described",
                    "The product is totally defective or completely damage",
                  ]}
                  onSelect={(selectedItem, index) => {
                    setReason(selectedItem)
                  }}
                  defaultButtonText="Reasons for Return"
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                  buttonTextStyle={{
                    fontSize: 13,
                    color: colors.onBackground,
                    // textAlign: "right",
                  }}
                  buttonStyle={{
                    height: 30,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: colors.elevation.level3,
                    borderRadius: 5,
                    backgroundColor: colors.background,
                  }}
                />
              </View>
              <View style={styles.inputCont}>
                <Text style={styles.label}>Preferred Sending Method</Text>

                <SelectDropdown
                  data={[current?.deliveryOption]}
                  onSelect={(selectedItem, index) => {
                    setSending(selectedItem)
                  }}
                  defaultButtonText="Preferred Sending Method"
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                  buttonTextStyle={{
                    fontSize: 13,
                    color: colors.onBackground,
                    // textAlign: "right",
                  }}
                  buttonStyle={{
                    height: 30,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: colors.elevation.level3,
                    borderRadius: 5,
                    backgroundColor: colors.background,
                  }}
                />
              </View>
              <View style={styles.inputCont}>
                <Text style={styles.label}>Preferred Refund Method</Text>

                <SelectDropdown
                  data={[
                    "Refund to my original payment method",
                    "Credit my Repeddle wallet",
                  ]}
                  onSelect={(selectedItem, index) => {
                    setRefund(selectedItem)
                  }}
                  defaultButtonText="Preferred Refund Method"
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                  buttonTextStyle={{
                    fontSize: 13,
                    color: colors.onBackground,
                    // textAlign: "right",
                  }}
                  buttonStyle={{
                    height: 30,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: colors.elevation.level3,
                    borderRadius: 5,
                    backgroundColor: colors.background,
                  }}
                />
              </View>
              <View style={[styles.inputCont, { width: "90%" }]}>
                <Text style={styles.label}>More Information</Text>
                <TextInput
                  style={[
                    styles.textarea,
                    { backgroundColor: colors.elevation.level2 },
                  ]}
                  multiline={true}
                  placeholder="   More information"
                  placeholderTextColor={colors.onBackground}
                  numberOfLines={5}
                  onChangeText={(text) => setDescription(text)}
                  value={description}
                />
              </View>
              <View
                style={[
                  styles.inputCont,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <TouchableOpacity onPress={pickImage} style={styles.label1}>
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color={colors.onBackground}
                    style={{ marginRight: 10 }}
                  />
                  <Text>Upload Image</Text>
                </TouchableOpacity>
                {invalidImage ? (
                  <Text style={{ color: "red" }}>{invalidImage}</Text>
                ) : null}
                {loadingUpload ? (
                  <ActivityIndicator size={"large"} color={colors.primary} />
                ) : null}
                {image.length !== 0 ? (
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    Image Uploaded
                  </Text>
                ) : null}
              </View>
              <View
                style={{
                  padding: 10,
                  width: "100%",
                }}
              >
                <Button
                  mode="contained"
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={handleReturn}
                  loading={loading}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    Submit
                  </Text>
                </Button>
              </View>
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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Wishlist" />
        <Appbar.Action
          icon="cart-outline"
          onPress={() => navigation.push("Cart")}
        />
      </Appbar.Header>

      <View>{displayTab()}</View>
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
    fontWeight: "bold",
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
    // width: "100%",
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
})
