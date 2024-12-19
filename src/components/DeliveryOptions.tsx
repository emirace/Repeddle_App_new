import {
  ActivityIndicator,
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
import React, { PropsWithChildren, useEffect, useRef, useState } from "react"
import { Appbar, Text, useTheme } from "react-native-paper"
import { CartItem } from "../contexts/CartContext"
import { IDeliveryOption, Stations } from "../types/product"
import RebundlePoster from "./RebundlePoster"
import { IRebundle } from "../types/user"
import { currency, goto, region } from "../utils/common"
import WebView from "react-native-webview"
import { Picker } from "@react-native-picker/picker"
import { postnet, pudo, states } from "../utils/constants"
import SelectDropdown from "react-native-select-dropdown"
import { fetchStations, getGigPrice } from "../services/others"
import { IDeliveryMeta } from "../types/order"
import useCart from "../hooks/useCart"
import useToastNotification from "../hooks/useToastNotification"

type Props = {
  setShowModel: (val: boolean) => void
  item: CartItem
}

const DeliveryOptions = ({ item, setShowModel }: Props) => {
  const { colors } = useTheme()
  const { addToCart } = useCart()

  const { addNotification } = useToastNotification()

  const [deliveryOption, setDeliveryOption] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [meta, setMeta] = useState<IDeliveryMeta>({})
  const [value, setValue] = useState<number>()
  const [token, setToken] = useState({ userId: "", token: "", username: "" })
  const [isRebundle, setIsRebundle] = useState<IRebundle>()
  // TODO: location
  const location1 = { error: "", coordinates: { lat: "", lng: "" } }
  const [locationerror, setLocationerror] = useState("")
  const [loadingGig, setLoadingGig] = useState(false)
  const [loadingStations, setLoadingStations] = useState(false)
  const [stations, setStations] = useState<Stations[]>([])

  const selectRefProvince = useRef(null)

  const validation = () => {
    var valid = true
    if (!deliveryOption) {
      valid = false
    }
    if (deliveryOption === "Paxi PEP store") {
      if (!meta.shortName) {
        setValidationError({
          ...validationError,
          shortName: "Select a pick up point ",
        })
        valid = false
      }
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        })
        valid = false
      }
    }
    if (deliveryOption === "PUDO Locker-to-Locker") {
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        })
        valid = false
      }
      if (!meta.province) {
        setValidationError({
          ...validationError,
          province: "Select province",
        })
        valid = false
      }
      if (!meta.shortName) {
        setValidationError({
          ...validationError,
          shortName: "Select a pick up point ",
        })
        valid = false
      }
    }
    if (deliveryOption === "PostNet-to-PostNet") {
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        })
        valid = false
      }

      if (!meta.province) {
        setValidationError({
          ...validationError,
          province: "Select province",
        })
        valid = false
      }
      if (!meta.pickUp) {
        setValidationError({
          ...validationError,
          pickUp: "Select a pick up locker ",
        })
        valid = false
      }
    }
    if (deliveryOption === "Aramex Store-to-Door") {
      if (!meta.province) {
        setValidationError({
          ...validationError,
          province: "Select province",
        })
        valid = false
      }
      if (!meta.postalcode) {
        setValidationError({
          ...validationError,
          postalcode: "Enter your postal code ",
        })
        valid = false
      }
      if (!meta.city) {
        setValidationError({
          ...validationError,
          city: "Enter your city ",
        })
        valid = false
      }
      if (!meta.suburb) {
        setValidationError({
          ...validationError,
          suburb: "Enter your suburb ",
        })
        valid = false
      }
      if (!meta.address) {
        setValidationError({
          ...validationError,
          address: "Enter your address ",
        })
        valid = false
      }
      if (!meta.email) {
        setValidationError({
          ...validationError,
          email: "Enter your email ",
        })
        valid = false
      }
      if (!meta.name) {
        setValidationError({
          ...validationError,
          name: "Enter your name ",
        })
        valid = false
      }
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        })
        valid = false
      }
    }
    if (deliveryOption === "GIG Logistics") {
      if (!meta.stationId) {
        setValidationError({
          ...validationError,
          stationId: "Select a station ",
        })
        valid = false
      }
      if (!meta.address) {
        setValidationError({
          ...validationError,
          address: "Enter your address ",
        })
        valid = false
      }
      if (!meta.name) {
        setValidationError({
          ...validationError,
          name: "Enter your name ",
        })
        valid = false
      }
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        })
        valid = false
      }
    }

    if (valid) {
      submitHandler()
    }
  }

  const submitHandler = async () => {
    let deliverySelect = {}

    if (deliveryOption === "GIG Logistics") {
      if (location1.error) {
        setLocationerror("Location is require for proper delivery")

        addNotification({
          message: "Location is require for proper delivery",
          error: true,
        })
        return
      }
      try {
        setLoadingGig(true)

        const data = await getGigPrice(item, meta, location1.coordinates, token)

        console.log(data)
        if (data) {
          deliverySelect = {
            "delivery Option": deliveryOption,
            cost: data.DeliveryPrice,
            ...meta,
            lat: location1.coordinates.lat,
            lng: location1.coordinates.lng,
            total: { status: true, cost: data.DeliveryPrice },
          }
        } else {
          setLoadingGig(false)
          setLocationerror(
            "Error selecting delivery method, try again later or try other delivery method"
          )
          return
        }
      } catch (err) {
        setLoadingGig(false)
        console.log(err)
      }
    } else {
      deliverySelect = {
        "delivery Option": deliveryOption,
        cost: value,
        ...meta,
        total: { status: true, cost: value },
      }
    }

    // const valid = true
    // TODO:
    // const allowData = await rebundleIsActive(user, item.seller._id, cart, valid)
    // console.log("allow", allowData, deliveryOption)
    // if (
    //   allowData?.countAllow > 0 &&
    //   allowData?.seller?.deliveryMethod === deliveryOption
    // ) {
    //   deliverySelect = {
    //     ...deliverySelect,
    //     total: { status: true, cost: 0 },
    //   }
    // }
    addToCart({
      ...item,
      deliverySelect,
    })
    setShowModel(false)
    // navigate("/placeorder");
    setLoadingGig(false)
  }

  const [validationError, setValidationError] = useState<{
    [key in keyof IDeliveryMeta]: string
  }>({})

  useEffect(() => {
    const getStations = async () => {
      setLoadingStations(true)
      const data = await fetchStations()
      if (data) {
        setStations(data.stations)
        setToken(data.token)
      }

      setLoadingStations(false)
    }

    getStations()
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.Action
          iconColor="white"
          icon="arrow-left"
          onPress={() => setShowModel(false)}
        />
        <Appbar.Content
          title="Select Delivery option"
          titleStyle={{ color: "white" }}
        />
      </Appbar.Header>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowModel(false)}>
          <IconButton icon="chevron-back" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: "white" }]}>
          select Delivery option
        </Text>
        <View style={{ width: 40, height: 40 }} />
      </View> */}
      <View style={{ padding: 20, justifyContent: "center", flex: 1 }}>
        {isRebundle?.status && <RebundlePoster />}
        <ScrollView>
          {item.deliveryOption.map((x) => (
            <View key={x.name}>
              <View style={styles.optioncont}>
                <TouchableOpacity
                  onPress={() => {
                    setMeta({
                      ...meta,
                      "delivery Option": x.name,
                      cost: x.value,
                    })
                    setDeliveryOption(x.name)
                    setValue(x.value)
                    setMeta({})
                  }}
                  style={styles.option}
                >
                  <Radio x={x} deliveryOption={deliveryOption} />
                  <Text1 style={styles.label}>
                    {x.name}{" "}
                    {x.value === 0 ? (
                      ""
                    ) : isRebundle?.status && isRebundle.method === x.name ? (
                      <Text1
                        style={{
                          color: colors.primary,
                          fontSize: 11,
                          fontWeight: "bold",
                          marginLeft: 10,
                        }}
                      >
                        Free delivery for {isRebundle?.count} item
                      </Text1>
                    ) : (
                      `+ ${currency(region())} ${x.value}`
                    )}
                  </Text1>
                </TouchableOpacity>
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
                              html: ' <iframe  width="100%" height="100%" src="https://map.paxi.co.za?size=l,m,s&status=1,3,4&maxordervalue=1000&output=nc,sn&select=true" frameBorder="0" allow="geolocation" ></iframe',
                            }}
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
                          onChangeText={(e) => setMeta({ ...meta, phone: e })}
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
                        style={[styles.link, { color: colors.secondary }]}
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
                          {region() === "NGN"
                            ? states.Nigeria.map((name, index) => (
                                <Picker.Item
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    color: colors.onBackground,
                                  }}
                                  key={index}
                                  label={name}
                                  value={name}
                                />
                              ))
                            : states.SouthAfrican.map((name, index) => (
                                <Picker.Item
                                  style={{
                                    backgroundColor: colors.elevation.level2,
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
                        style={[styles.link, { color: colors.secondary }]}
                        onPress={() =>
                          goto("https://www.pudo.co.za/where-to-find-us.php")
                        }
                      >
                        Find locker near your location
                      </Text>
                      <View style={styles.plan}>
                        <Text1 style={styles.label}>Pick Up Locker</Text1>

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
                            pudo[meta.province as keyof typeof pudo].map(
                              (name, index) => (
                                <Picker.Item
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    color: colors.onBackground,
                                  }}
                                  key={index}
                                  label={name}
                                  value={name}
                                />
                              )
                            )}
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
                          onChangeText={(e) => setMeta({ ...meta, phone: e })}
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
                        style={[styles.link, { color: colors.secondary }]}
                        onPress={() =>
                          goto("https://www.pudo.co.za/how-it-works.php")
                        }
                      >
                        How PUDO works
                      </Text>
                      <View style={styles.plan}>
                        <Text
                          style={[styles.link, { color: colors.secondary }]}
                          onPress={() => goto("https://www.pudo.co.za/faq.php")}
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
                          {region() === "NGN"
                            ? states.Nigeria.map((name, index) => (
                                <Picker.Item
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    color: colors.onBackground,
                                  }}
                                  key={index}
                                  label={name}
                                  value={name}
                                />
                              ))
                            : states.SouthAfrican.map((name, index) => (
                                <Picker.Item
                                  style={{
                                    backgroundColor: colors.elevation.level2,
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
                        style={[styles.link, { color: colors.secondary }]}
                        onPress={() => goto("https://www.postnet.co.za/stores")}
                      >
                        Find store near your location
                      </Text>
                      <View style={styles.plan}>
                        <Text1 style={styles.label}>Pick Up Locker</Text1>
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
                          {postnet[meta.province as keyof typeof postnet] &&
                            postnet[meta.province as keyof typeof postnet].map(
                              (name, index) => (
                                <Picker.Item
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    color: colors.onBackground,
                                  }}
                                  key={index}
                                  label={name}
                                  value={name}
                                />
                              )
                            )}
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
                          onChangeText={(e) => setMeta({ ...meta, phone: e })}
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
                        style={[styles.link, { color: colors.secondary }]}
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
                          onChangeText={(e) => setMeta({ ...meta, name: e })}
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
                          onChangeText={(e) => setMeta({ ...meta, phone: e })}
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
                          onChangeText={(e) => setMeta({ ...meta, email: e })}
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
                          onChangeText={(e) => setMeta({ ...meta, company: e })}
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
                          onChangeText={(e) => setMeta({ ...meta, address: e })}
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
                          onChangeText={(e) => setMeta({ ...meta, suburb: e })}
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
                          onChangeText={(e) => setMeta({ ...meta, city: e })}
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
                          {region() === "NGN"
                            ? states.Nigeria.map((name, index) => (
                                <Picker.Item
                                  style={{
                                    backgroundColor: colors.elevation.level2,
                                    color: colors.onBackground,
                                  }}
                                  key={index}
                                  label={name}
                                  value={name}
                                />
                              ))
                            : states.SouthAfrican.map((name, index) => (
                                <Picker.Item
                                  style={{
                                    backgroundColor: colors.elevation.level2,
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
                        style={[styles.link, { color: colors.secondary }]}
                        onPress={() =>
                          goto("https://www.youtube.com/watch?v=VlUQTF064y8")
                        }
                      >
                        How Aramex works
                      </Text>
                    </View>
                  ) : deliveryOption === "GIG Logistics" ? (
                    <View style={styles.plans}>
                      {locationerror && (
                        <Text1 style={{ color: "red", textAlign: "center" }}>
                          {locationerror}
                        </Text1>
                      )}
                      <View style={styles.plan}>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              name: "",
                            })
                          }
                          onChangeText={(e) => setMeta({ ...meta, name: e })}
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
                          onChangeText={(e) => setMeta({ ...meta, phone: e })}
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
                              address: "",
                            })
                          }
                          onChangeText={(e) => setMeta({ ...meta, address: e })}
                          placeholder="Address"
                          value={meta.address}
                        />
                        {validationError.address && (
                          <Text1 style={{ color: "red" }}>
                            {validationError.address}
                          </Text1>
                        )}
                      </View>
                      <View style={styles.plan}>
                        <SelectDropdown
                          ref={selectRefProvince}
                          data={
                            loadingStations
                              ? ["Loading"]
                              : stations.map((station) => station.StateName)
                          }
                          onSelect={(selectedItem, index) => {
                            setMeta({ ...meta, stationId: selectedItem })
                            setValidationError({
                              ...validationError,
                              stationId: "",
                            })
                          }}
                          defaultButtonText="Select Station"
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
                            height: 40,
                            width: "100%",
                            backgroundColor: colors.elevation.level2,
                            borderRadius: 5,
                          }}
                        />
                        {validationError.stationId && (
                          <Text1 style={{ color: "red" }}>
                            {validationError.stationId}
                          </Text1>
                        )}
                      </View>
                      <Text1 link>How GIG works</Text1>
                    </View>
                  ) : deliveryOption === "Pick up from Seller" ? (
                    <View style={styles.plans}>
                      <View style={styles.plan}>
                        <Text1 style={{ fontSize: 12 }}>
                          When using Pick Up From Seller, our system is
                          unfortunately not able to record the delivery process.
                          This means (you) the buyer makes arrangement with the
                          seller to pick up your order. The risk involved in
                          getting your product is expressly yours and not of
                          Repeddle, any affiliate or Delivery companies offered
                          on Repeddle.
                        </Text1>
                      </View>
                    </View>
                  ) : null
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>
        {loadingGig ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              { marginVertical: 20, backgroundColor: colors.primary },
            ]}
            onPress={loadingGig ? undefined : validation}
          >
            <Text style={{ color: "white" }}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
      }}
    />
  )
}

type RadioProps = {
  deliveryOption: string
  x: IDeliveryOption
}

const Radio = ({ x, deliveryOption }: RadioProps) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: deliveryOption === x.name ? colors.primary : undefined,
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

export default DeliveryOptions

const styles = StyleSheet.create({
  container: { flex: 1 },

  //   header: {
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     padding: 10,
  //     backgroundColor: colors.primary,
  //   },
  title: { fontWeight: "bold", fontSize: 20, textTransform: "capitalize" },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    marginHorizontal: 10,
    textTransform: "capitalize",
  },
  optioncont: { marginVertical: 5 },
  plans: {
    margin: 5,
    padding: 5,
  },
  link: {
    fontSize: 14,
    paddingLeft: 10,
    textDecorationLine: "underline",
  },
  plan: {
    alignItems: "stretch",
    marginVertical: 10,
    justifyContent: "center",
  },
  button: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
})
