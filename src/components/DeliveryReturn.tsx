import {
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native"
import React, { PropsWithChildren, useState } from "react"
import { Button, Text, useTheme } from "react-native-paper"
import { IDeliveryMeta, IReturn } from "../types/order"
import useToastNotification from "../hooks/useToastNotification"
import useReturn from "../hooks/useReturn"
import { currency, goto, region } from "../utils/common"
import { Ionicons } from "@expo/vector-icons"
import WebView from "react-native-webview"
import { Picker } from "@react-native-picker/picker"
import { postnet, pudo, states } from "../utils/constants"

type Props = {
  setShowModel: (show: boolean) => void
  returned: IReturn
  setReturned: (returned: IReturn) => void
  showModel: boolean
}

const DeliveryReturn = ({
  setShowModel,
  returned,
  setReturned,
  showModel,
}: Props) => {
  const { addNotification } = useToastNotification()
  const { updateReturnAddress, error } = useReturn()
  const { colors } = useTheme()

  const [deliveryOption, setDeliveryOption] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [meta, setMeta] = useState<IDeliveryMeta>({})
  const [value, setValue] = useState<number>()
  const [showModel1, setShowModel1] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)

  const error1 = ""
  const currencys = currency(region())

  const submitHandler = async () => {
    if (!deliveryOption) {
      addNotification({
        message: "Select a method of delivery",
        error: true,
      })
      return
    }

    setLoading(true)

    if (
      !returned.deliverySelected &&
      returned.deliveryOption.method !== "Pick up from Seller"
    ) {
      // TODO:  method for other delivery methods
    } else {
      const res = await updateReturnAddress(returned._id, {
        method: deliveryOption,
        fee: value ?? 0,
        meta,
      })

      if (res) {
        setReturned(res)
        setShowModel(false)
        addNotification({
          message: "address added",
        })
      } else {
        addNotification({
          message: error || "Failed to update address",
          error: true,
        })
      }
    }

    setLoading(false)
  }

  const [validationError, setValidationError] = useState<{
    [key in keyof IDeliveryMeta]: string
  }>({})

  return (
    <Modal
      visible={showModel}
      transparent={true}
      onRequestClose={() => setShowModel(false)}
      animationType="slide"
    >
      <View style={[styles.modalOverlay]}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Pressable style={styles.close} onPress={() => setShowModel(false)}>
              <Ionicons
                name="close-outline"
                size={24}
                color={colors.onBackground}
              />
            </Pressable>
            <View style={{ marginBottom: 12, width: "100%" }}>
              <Text style={styles.title}>Delivery Method</Text>
              <Text style={[styles.subtitle, { color: colors.inverseSurface }]}>
                Please select a method of delivery
              </Text>
              <View>
                {error1 && (
                  <Text style={{ color: "red" }}>
                    {error1}
                    <Text
                      onPress={() => setShowModel1(true)}
                      style={{
                        color: colors.primary,
                        textDecorationLine: "underline",
                      }}
                    >
                      {" "}
                      Fund now
                    </Text>
                  </Text>
                )}

                <View>
                  {[
                    {
                      name: returned.deliveryOption.method,
                      value: returned.deliveryOption.fee,
                    },
                  ].map((x) => (
                    <View style={{ marginBottom: 16 }} key={x.name}>
                      <View style={{ marginVertical: 10 }}>
                        <RadioButton
                          options={[{ text: x.name, value: x.value }]}
                          type={x.name}
                          handleChange={(val) => {
                            setMeta({
                              ...meta,
                              deliveryOption: val.name,
                              fee: +val.value,
                              cost: +val.value,
                            })
                            setDeliveryOption(val.name)
                            setValue(x.value)
                            setMeta({})
                          }}
                        />
                        {deliveryOption === x.name ? (
                          deliveryOption === "Paxi PEP store" ? (
                            <View style={styles.plans}>
                              <View style={styles.plan}>
                                <Pressable
                                  style={{
                                    height: 40,
                                    borderWidth: 1,
                                    borderColor: colors.onBackground,
                                    borderRadius: 5,
                                    paddingHorizontal: 15,
                                    justifyContent: "center",
                                  }}
                                  onPress={() => {
                                    setShowMap(true)
                                    setValidationError({
                                      ...validationError,
                                      shortName: "",
                                    })
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "grey",
                                    }}
                                  >
                                    {meta.shortName ||
                                      "Choose the closest pick up point"}
                                  </Text>
                                </Pressable>
                                {validationError?.shortName && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.shortName}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                {showMap && (
                                  <WebView
                                    source={{
                                      html: ` 
                              <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;overflow:hidden;">
                              <iframe style="height:100vh" width="100%" height="100%" src="https://map.paxi.co.za?size=l,m,s&status=1,3,4&maxordervalue=1000&output=nc,sn&select=true" frameBorder="0" allow="geolocation" ></iframe
                              <script>
            // Example: post a message from iframe (only works if iframe content does it)
            window.addEventListener('message', function(event) {
              if (event.data) {
                window.ReactNativeWebView.postMessage("Iframe said: " + event.data);
              }
            });

            // Or you can simulate a message after delay for test
            setTimeout(() => {
              window.ReactNativeWebView.postMessage("Loaded iframe or some custom event");
            }, 2000);
          </script>
        </body>
      </html>`,
                                    }}
                                    onMessage={(e) =>
                                      JSON.stringify(e, null, 2)
                                    }
                                    style={{ height: 200 }}
                                  />
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      phone: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, phone: e })
                                  }
                                  placeholder="Phone number"
                                  value={meta.phone}
                                />
                                {validationError.phone && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.phone}
                                  </Text1>
                                )}
                              </View>

                              <Text
                                style={[
                                  styles.link,
                                  { color: colors.secondary },
                                ]}
                                onPress={() =>
                                  goto("https://www.paxi.co.za/#send-a-parcel")
                                }
                              >
                                How Paxi works
                              </Text>
                            </View>
                          ) : deliveryOption === "PUDO Locker-to-Locker" ? (
                            <View style={styles.plans}>
                              <View style={styles.plan}>
                                <Text1 style={styles.label}>Province</Text1>

                                <Picker
                                  selectedValue={meta.province}
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    padding: 5,
                                    color: "grey",
                                  }}
                                  onValueChange={(itemValue, itemIndex) => {
                                    setMeta({ ...meta, province: itemValue })
                                    setValidationError({
                                      ...validationError,
                                      province: "",
                                    })
                                  }}
                                >
                                  <Picker.Item
                                    style={{
                                      backgroundColor: colors.elevation.level2,
                                      color: colors.onBackground,
                                    }}
                                    label={"--select province--"}
                                    value={""}
                                  />
                                  {states.SouthAfrican.map((name, index) => (
                                    <Picker.Item
                                      style={{
                                        backgroundColor:
                                          colors.elevation.level2,
                                        color: colors.onBackground,
                                      }}
                                      key={index}
                                      label={name}
                                      value={name}
                                    />
                                  ))}
                                </Picker>
                                {validationError.province && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.province}
                                  </Text1>
                                )}
                              </View>

                              <Text
                                style={[
                                  styles.link,
                                  { color: colors.secondary },
                                ]}
                                onPress={() =>
                                  goto(
                                    "https://www.pudo.co.za/where-to-find-us.php"
                                  )
                                }
                              >
                                Find locker near your location
                              </Text>
                              <View style={styles.plan}>
                                <Text1 style={styles.label}>
                                  Pick Up Locker
                                </Text1>

                                <Picker
                                  selectedValue={meta.shortName}
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    padding: 5,
                                    color: "grey",
                                  }}
                                  onValueChange={(itemValue, itemIndex) => {
                                    setMeta({ ...meta, shortName: itemValue })
                                    setValidationError({
                                      ...validationError,
                                      shortName: "",
                                    })
                                  }}
                                >
                                  <Picker.Item
                                    style={{
                                      backgroundColor: colors.elevation.level2,
                                      color: colors.onBackground,
                                    }}
                                    label={"-- select locker --"}
                                    value={""}
                                  />
                                  {pudo[meta.province as keyof typeof pudo] &&
                                    pudo[
                                      meta.province as keyof typeof pudo
                                    ].map((name, index) => (
                                      <Picker.Item
                                        style={{
                                          backgroundColor:
                                            colors.elevation.level2,
                                          color: colors.onBackground,
                                        }}
                                        key={index}
                                        label={name}
                                        value={name}
                                      />
                                    ))}
                                </Picker>
                                {validationError.shortName && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.shortName}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      phone: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, phone: e })
                                  }
                                  placeholder="Phone"
                                  value={meta.phone}
                                />
                                {validationError.phone && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.phone}
                                  </Text1>
                                )}
                              </View>
                              <Text
                                style={[
                                  styles.link,
                                  { color: colors.secondary },
                                ]}
                                onPress={() =>
                                  goto(
                                    "https://www.pudo.co.za/how-it-works.php"
                                  )
                                }
                              >
                                How PUDO works
                              </Text>
                              <View style={styles.plan}>
                                <Text
                                  style={[
                                    styles.link,
                                    { color: colors.secondary },
                                  ]}
                                  onPress={() =>
                                    goto("https://www.pudo.co.za/faq.php")
                                  }
                                >
                                  PUDO FAQ
                                </Text>
                              </View>
                            </View>
                          ) : deliveryOption === "PostNet-to-PostNet" ? (
                            <View style={styles.plans}>
                              <View style={styles.plan}>
                                <Text1 style={styles.label}>Province</Text1>
                                <Picker
                                  selectedValue={meta.province}
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    padding: 5,
                                    color: "grey",
                                  }}
                                  onValueChange={(itemValue, itemIndex) => {
                                    setMeta({ ...meta, province: itemValue })
                                    setValidationError({
                                      ...validationError,
                                      province: "",
                                    })
                                  }}
                                >
                                  <Picker.Item
                                    style={{
                                      backgroundColor: colors.elevation.level2,
                                      color: colors.onBackground,
                                    }}
                                    label={"--select province--"}
                                    value={""}
                                  />
                                  {states.SouthAfrican.map((name, index) => (
                                    <Picker.Item
                                      style={{
                                        backgroundColor:
                                          colors.elevation.level2,
                                        color: colors.onBackground,
                                      }}
                                      key={index}
                                      label={name}
                                      value={name}
                                    />
                                  ))}
                                </Picker>
                                {validationError.province && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.province}
                                  </Text1>
                                )}
                              </View>

                              <Text
                                style={[
                                  styles.link,
                                  { color: colors.secondary },
                                ]}
                                onPress={() =>
                                  goto("https://www.postnet.co.za/stores")
                                }
                              >
                                Find store near your location
                              </Text>
                              <View style={styles.plan}>
                                <Text1 style={styles.label}>
                                  Pick Up Locker
                                </Text1>
                                <Picker
                                  selectedValue={meta.pickUp}
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    padding: 5,
                                    color: "grey",
                                  }}
                                  onValueChange={(itemValue, itemIndex) => {
                                    setMeta({ ...meta, pickUp: itemValue })
                                    setValidationError({
                                      ...validationError,
                                      pickUp: "",
                                    })
                                  }}
                                >
                                  <Picker.Item
                                    style={{
                                      backgroundColor: colors.elevation.level2,
                                      color: colors.onBackground,
                                    }}
                                    label={"-- select locker --"}
                                    value={""}
                                  />
                                  {postnet[
                                    meta.province as keyof typeof postnet
                                  ] &&
                                    postnet[
                                      meta.province as keyof typeof postnet
                                    ].map((name, index) => (
                                      <Picker.Item
                                        style={{
                                          backgroundColor:
                                            colors.elevation.level2,
                                          color: colors.onBackground,
                                        }}
                                        key={index}
                                        label={name}
                                        value={name}
                                      />
                                    ))}
                                </Picker>

                                {validationError.pickUp && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.pickUp}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      phone: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, phone: e })
                                  }
                                  placeholder="Phone"
                                  value={meta.phone}
                                />
                                {validationError.phone && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.phone}
                                  </Text1>
                                )}
                              </View>
                              <Text
                                style={[
                                  styles.link,
                                  { color: colors.secondary },
                                ]}
                                onPress={() =>
                                  goto(
                                    "https://www.postnet.co.za/domestic-postnet2postnet"
                                  )
                                }
                              >
                                How PostNet works
                              </Text>
                            </View>
                          ) : deliveryOption === "Aramex Store-to-Door" ? (
                            <View style={styles.plans}>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      name: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, name: e })
                                  }
                                  placeholder="Name"
                                  value={meta.name}
                                />
                                {validationError.name && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.name}
                                  </Text1>
                                )}
                              </View>

                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      phone: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, phone: e })
                                  }
                                  placeholder="Phone"
                                  value={meta.phone}
                                />
                                {validationError.phone && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.phone}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      email: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, email: e })
                                  }
                                  placeholder="E-mail"
                                  value={meta.email}
                                />
                                {validationError.email && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.email}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      company: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, company: e })
                                  }
                                  placeholder="Company name (if applicable)"
                                  value={meta.company}
                                />
                                {validationError.company && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.company}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      address: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, address: e })
                                  }
                                  placeholder="Address (P.O. box not accepted"
                                  value={meta.address}
                                />
                                {validationError.address && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.address}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      suburb: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, suburb: e })
                                  }
                                  placeholder="Suburb"
                                  value={meta.suburb}
                                />
                                {validationError.suburb && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.suburb}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      city: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, city: e })
                                  }
                                  placeholder="City/Town"
                                  value={meta.city}
                                />
                                {validationError.city && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.city}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Input
                                  onFocus={() =>
                                    setValidationError({
                                      ...validationError,
                                      postalcode: "",
                                    })
                                  }
                                  onChangeText={(e) =>
                                    setMeta({ ...meta, postalcode: e })
                                  }
                                  placeholder="Postal Code"
                                  value={meta.postalcode}
                                />
                                {validationError.postalcode && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.postalcode}
                                  </Text1>
                                )}
                              </View>
                              <View style={styles.plan}>
                                <Picker
                                  selectedValue={meta.province}
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    padding: 5,
                                    color: "grey",
                                  }}
                                  onValueChange={(itemValue, itemIndex) => {
                                    setMeta({ ...meta, province: itemValue })
                                    setValidationError({
                                      ...validationError,
                                      province: "",
                                    })
                                  }}
                                >
                                  <Picker.Item
                                    style={{
                                      backgroundColor: colors.elevation.level2,
                                      color: colors.onBackground,
                                    }}
                                    label={"--select province--"}
                                    value={""}
                                  />
                                  {states.SouthAfrican.map((name, index) => (
                                    <Picker.Item
                                      style={{
                                        backgroundColor:
                                          colors.elevation.level2,
                                        color: colors.onBackground,
                                      }}
                                      key={index}
                                      label={name}
                                      value={name}
                                    />
                                  ))}
                                </Picker>
                                {validationError.province && (
                                  <Text1 style={{ color: "red" }}>
                                    {validationError.province}
                                  </Text1>
                                )}
                              </View>
                              <Text
                                style={[
                                  styles.link,
                                  { color: colors.secondary },
                                ]}
                                onPress={() =>
                                  goto(
                                    "https://www.youtube.com/watch?v=VlUQTF064y8"
                                  )
                                }
                              >
                                How Aramex works
                              </Text>
                            </View>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </View>
                    </View>
                  ))}
                  <View style={{ marginBottom: 16 }}>
                    <Button
                      mode="contained"
                      style={{ width: "100%" }}
                      loading={loading}
                      onPress={submitHandler}
                      disabled={loading}
                    >
                      Continue
                    </Button>
                  </View>
                </View>
                {/* <Modal isOpen={showModel1} onClose={() => setShowModel1(false)}>
                  <AddFund
                    setShowModel={setShowModel}
                    currency={currencys === "₦" ? "NGN" : "ZAR"}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                </Modal> */}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const Input = (props: TextInputProps) => {
  const { colors } = useTheme()
  return (
    <TextInput
      placeholderTextColor="grey"
      {...props}
      style={{
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        borderColor: colors.onBackground,
        color: colors.onBackground,
        width: "100%",
      }}
    />
  )
}

type TextProps = PropsWithChildren<{
  link?: boolean
  style?: StyleProp<TextStyle>
}>

const Text1 = ({ children, style, link }: TextProps) => {
  const { colors } = useTheme()
  return (
    <Text style={[style, link && { color: colors.secondary }]}>{children}</Text>
  )
}

type RadioProps = {
  options: { text: string; value: number }[]
  type: string
  handleChange: (val: { name: string; value: number }) => void
}

const RadioButton = ({ options, handleChange, type }: RadioProps) => {
  const [selectedOption, setSelectedOption] = useState("")
  const { colors } = useTheme()
  const currencys = currency(region())

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.text}
          style={styles.radioButton}
          onPress={() => {
            setSelectedOption(option.text)
            handleChange({ name: type, value: option.value })
          }}
        >
          <View
            style={[
              styles.radioButtonIcon,
              { borderColor: colors.onBackground },
            ]}
          >
            {selectedOption === option.text && (
              <View
                style={[
                  styles.radioButtonSelected,
                  { backgroundColor: colors.primary },
                ]}
              />
            )}
          </View>
          <Text>
            {option.text}{" "}
            {option.value === 1 ? "" : `+ ${currencys}${option.value}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default DeliveryReturn

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "90%",
    maxWidth: 400,
    alignSelf: "center",
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 8,
  },
  close: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  plans: {
    margin: 5,
    padding: 5,
  },
  plan: {
    // alignItems: "stretch",
    marginVertical: 10,
    justifyContent: "center",
  },
  link: {
    fontSize: 14,
    paddingLeft: 10,
    textDecorationLine: "underline",
  },
  label: {
    marginHorizontal: 10,
    textTransform: "capitalize",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    // justifyContent: "space-between",
  },
  radioButtonIcon: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
})
