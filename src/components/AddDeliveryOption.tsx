import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useState } from "react"
import MyButton from "./MyButton"
import { Text, useTheme } from "react-native-paper"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { goto } from "../utils/common"
import Rebundle from "./Rebundle"
import {
  aramexOption,
  paxiOption,
  postnetOption,
  pudoOption,
} from "../utils/constants"
import { DeliveryMeta, IDeliveryOption } from "../types/product"
import Tooltip from "./Tooltip"

type Props = {
  modalVisible: boolean
  paxi: boolean
  setPaxi: (val: boolean) => void
  postnet: boolean
  setPostnet: (val: boolean) => void
  aramex: boolean
  setAramex: (val: boolean) => void
  pickup: boolean
  setPickup: (val: boolean) => void
  bundle: boolean
  setBundle: (val: boolean) => void
  deliveryOption: IDeliveryOption[]
  setDeliveryOption: (val: IDeliveryOption[]) => void
  setModalVisible: (val: boolean) => void
  meta: DeliveryMeta
  setMeta: (val: DeliveryMeta) => void
  pudo: boolean
  setPudo: (val: boolean) => void
  gig: boolean
  setGig: (val: boolean) => void
}

const AddDeliveryOption = ({
  aramex,
  bundle,
  deliveryOption,
  meta,
  paxi,
  pickup,
  postnet,
  setAramex,
  setBundle,
  setDeliveryOption,
  setMeta,
  setPaxi,
  setPickup,
  setPostnet,
  setModalVisible,
  modalVisible,
  pudo,
  setPudo,
}: Props) => {
  const { colors } = useTheme()

  const [error1, setError1] = useState("")

  const handleClose = () => {
    if (paxi) {
      const exist = deliveryOption.filter((x) => x.name === "Paxi PEP store")
      if (exist.length === 0) {
        setError1("Select a delivery price option for Paxi PEP store ")
        return
      }
    }
    if (pudo) {
      const exist = deliveryOption.filter(
        (x) => x.name === "PUDO Locker-to-Locker"
      )
      if (exist.length === 0) {
        setError1("Select a delivery price option for PUDO Locker-to-Locker ")
        return
      }
    }

    if (postnet) {
      const exist = deliveryOption.filter(
        (x) => x.name === "PostNet-to-PostNet"
      )
      if (exist.length === 0) {
        setError1("Select a delivery price option for PostNet-to-PostNet ")
        return
      }
    }
    if (aramex) {
      const exist = deliveryOption.filter(
        (x) => x.name === "Aramex Store-to-Door"
      )
      if (exist.length === 0) {
        setError1("Select a delivery price option for Aramex Store-to-Door ")
        return
      }
    }
    setModalVisible(!modalVisible)
  }

  const handleChange = (e: { name: string; value: number; gig?: boolean }) => {
    const { name, value } = e
    const exist = deliveryOption.filter((x) => x.name === name)
    if (e.gig) {
      // TODO: location
      //   if (location.error) {
      //     return
      //   } else {
      //     setMeta({
      //       ...meta,
      //       lat: location.coordinates.lat,
      //       lng: location.coordinates.lng,
      //     })
      //   }
    }
    const intValue = typeof value === "string" ? parseInt(value) : value

    if (exist) {
      const newArray = deliveryOption.filter((x) => x.name !== name)
      setDeliveryOption([...newArray, { name, value }])
    } else {
      setDeliveryOption([...deliveryOption, { name, value: intValue }])
    }
  }

  return (
    <View style={styles.centeredView}>
      <View
        style={[styles.modalView, { backgroundColor: colors.elevation.level2 }]}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: 5,
          }}
        >
          <Ionicons
            onPress={() => setModalVisible(!modalVisible)}
            name="close"
            size={24}
            color={colors.onBackground}
          />
        </View>
        <ScrollView style={[{ marginBottom: 10, flex: 1 }]}>
          <Text style={{ fontSize: 16, fontFamily: "chronicle-text-bold" }}>
            Select Delivery Option
          </Text>
          <Text style={styles.info}>
            Select as many as you like. Shops with multiple options sell faster.
            The Buyer will cover the delivery fee when purchasing.
          </Text>
          <View style={styles.optionCont}>
            <View style={styles.option}>
              <View style={styles.label}>
                <FontAwesome5
                  name="truck"
                  size={18}
                  color={colors.onBackground}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.name}>Paxi PEP store</Text>
                <Tooltip
                  content={`Store-to-store courier service anywhere in South Africa. Drop off the item at the nearest PEP store / PAXI collection point. The Buyer will collect the item from the pick-up point of their choice.`}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={colors.onBackground}
                    style={{ marginLeft: 10 }}
                  />
                </Tooltip>
              </View>
              <Switch
                value={paxi}
                trackColor={{ false: "grey", true: "grey" }}
                thumbColor={paxi ? colors.primary : "white"}
                onValueChange={(value) => {
                  setPaxi(value)
                  if (!value) {
                    setDeliveryOption(
                      deliveryOption.filter((x) => x.name !== "Paxi PEP store")
                    )
                  }
                }}
              />
            </View>
            <View style={styles.divider} />
            {paxi && (
              <View style={styles.plans}>
                <RadioButton
                  options={paxiOption}
                  handleChange={handleChange}
                  type="Paxi PEP store"
                />
                <Text
                  style={[styles.link, { color: colors.secondary }]}
                  onPress={() => {
                    goto(
                      "https://www.paxi.co.za/paxi-frequently-asked-questions"
                    )
                  }}
                >
                  How PAXI works
                </Text>
              </View>
            )}
          </View>
          <View style={styles.optionCont}>
            <View style={styles.option}>
              <View style={styles.label}>
                <FontAwesome5
                  name="truck"
                  size={18}
                  color={colors.onBackground}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.name}>PUDO Locker-to-Locker</Text>
                <Tooltip
                  content={`Locker-to-locker courier service anywhere in South Africa. Drop off the item at the nearest Pudo locker. The Buyer will collect the item from the locker of their choice. Pudo lockers are accessible 24/7, so you can drop off or pick up your package when it suits you best.
                         `}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={colors.onBackground}
                    style={{ marginLeft: 10 }}
                  />
                </Tooltip>
              </View>
              <Switch
                value={pudo}
                trackColor={{ false: "grey", true: "grey" }}
                thumbColor={pudo ? colors.primary : "white"}
                onValueChange={(value) => {
                  setPudo(value)
                  if (!value) {
                    setDeliveryOption(
                      deliveryOption.filter(
                        (x) => x.name !== "PUDO Locker-to-Locker"
                      )
                    )
                  }
                }}
              />
            </View>
            <View style={styles.divider} />
            {pudo && (
              <View style={styles.plans}>
                <RadioButton
                  options={pudoOption}
                  handleChange={handleChange}
                  type="PUDO Locker-to-Locker"
                />
                <Text
                  style={[styles.link, { color: colors.secondary }]}
                  onPress={() => {
                    goto("https://www.pudo.co.za/how-it-works.php")
                  }}
                >
                  How PUDO works
                </Text>
              </View>
            )}
          </View>

          <View style={styles.optionCont}>
            <View style={styles.option}>
              <View style={styles.label}>
                <FontAwesome5
                  name="truck"
                  size={18}
                  color={colors.onBackground}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.name}>PostNet-to-PostNet</Text>
                <Tooltip
                  content={`PostNet-to-PostNet courier service anywhere in South Africa. Drop off the item at the nearest PostNet counter. The Buyer will collect the item from the pick-up point of their choice. Your parcel will be delivered within 2-4 working days.
                          `}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={colors.onBackground}
                    style={{ marginLeft: 10 }}
                  />
                </Tooltip>
              </View>
              <Switch
                value={postnet}
                trackColor={{ false: "grey", true: "grey" }}
                thumbColor={postnet ? colors.primary : "white"}
                onValueChange={(value) => {
                  setPostnet(value)
                  if (!value) {
                    setDeliveryOption(
                      deliveryOption.filter(
                        (x) => x.name !== "PostNet-to-PostNet"
                      )
                    )
                  }
                }}
              />
            </View>
            <View style={styles.divider} />
            {postnet && (
              <View style={styles.plans}>
                <RadioButton
                  options={postnetOption}
                  handleChange={handleChange}
                  type="PostNet-to-PostNet"
                />
                <Text
                  style={[styles.link, { color: colors.secondary }]}
                  onPress={() => {
                    goto("https://www.postnet.co.za/domestic-postnet2postnet")
                  }}
                >
                  How Postnet works
                </Text>
              </View>
            )}
          </View>
          <View style={styles.optionCont}>
            <View style={styles.option}>
              <View style={styles.label}>
                <FontAwesome5
                  name="truck"
                  size={18}
                  color={colors.onBackground}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.name}>Aramex Store-to-Door</Text>
                <Tooltip
                  content={`Store-to-door courier service anywhere in South Africa. Aramex shipment sleeves can be bought at kiosks, selected Pick n Pay and Freshstop stores nationwide. The parcel will be delivered to buyer’s door.  `}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color={colors.onBackground}
                    style={{ marginLeft: 10 }}
                  />
                </Tooltip>
              </View>
              <Switch
                value={aramex}
                trackColor={{ false: "grey", true: "grey" }}
                thumbColor={aramex ? colors.primary : "white"}
                onValueChange={(value) => {
                  setAramex(value)
                  if (!value) {
                    setDeliveryOption(
                      deliveryOption.filter(
                        (x) => x.name !== "Aramex Store-to-Door"
                      )
                    )
                  }
                }}
              />
            </View>
            <View style={styles.divider} />
            {aramex && (
              <View style={styles.plans}>
                <RadioButton
                  options={aramexOption}
                  handleChange={handleChange}
                  type="Aramex Store-to-Door"
                />
                <Text
                  style={[styles.link, { color: colors.secondary }]}
                  onPress={() => {
                    goto("https://www.youtube.com/watch?v=VlUQTF064y8")
                  }}
                >
                  How Aramex works
                </Text>
              </View>
            )}
          </View>

          <View style={styles.optionCont}>
            <View style={styles.option}>
              <View style={styles.label}>
                <FontAwesome5
                  name="truck"
                  size={18}
                  color={colors.onBackground}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.name}>Pick up from Seller</Text>
              </View>
              <Switch
                value={pickup}
                trackColor={{ false: "grey", true: "grey" }}
                thumbColor={pickup ? colors.primary : "white"}
                onValueChange={(value) => {
                  setPickup(value)
                  handleChange({ name: "Pick up from Seller", value: 0 })
                  if (!value) {
                    setDeliveryOption(
                      deliveryOption.filter(
                        (x) => x.name !== "Pick up from Seller"
                      )
                    )
                  }
                }}
              />
            </View>
            <View style={styles.divider} />
          </View>
          <Rebundle bundle={bundle} setBundle={setBundle} />
        </ScrollView>
        {error1 ? (
          <Text style={{ color: "red", marginVertical: 5 }}>{error1}</Text>
        ) : null}
        <View
          style={{
            width: "100%",
            bottom: 5,
            paddingTop: 5,
          }}
        >
          <MyButton text="Done" onPress={handleClose} />
        </View>
      </View>
    </View>
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
          <Text>{option.text}</Text>
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
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default AddDeliveryOption

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "90%",
  },

  info: {
    color: "grey",
    padding: 10,
    textAlign: "justify",
    fontSize: 12,
  },
  optionCont: {
    marginBottom: 20,
  },
  option: {
    // marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontFamily: "absential-sans-bold",
    color: "grey",
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "grey",
    marginBottom: 5,
  },
  plans: {
    // marginLeft: 25,
  },
  plan: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  planName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  link: {
    fontSize: 14,
    textDecorationLine: "underline",
    marginTop: 5,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
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
  tips: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 35,
    zIndex: 100,
    width: "100%",
  },
})
