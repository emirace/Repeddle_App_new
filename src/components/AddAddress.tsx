import { Modal, StyleProp, StyleSheet, TextStyle, View } from "react-native"
import React, { PropsWithChildren, useState } from "react"
import { Button, IconButton, Text, useTheme } from "react-native-paper"
import { currentAddress, goto, region } from "../utils/common"
import Input from "./Input"
import { states } from "../utils/constants"
import { Picker } from "@react-native-picker/picker"
import useAuth from "../hooks/useAuth"
import { ProductNavigationProp } from "../types/navigation/stack"
import useToastNotification from "../hooks/useToastNotification"

type Props = {
  isFocused: boolean
  navigation: ProductNavigationProp["navigation"]
  addressVerified: boolean
  setIsClosed: (val: boolean) => void
}

const AddAddress = ({
  isFocused,
  navigation,
  addressVerified,
  setIsClosed,
}: Props) => {
  const { colors } = useTheme()
  const { updateUser, error: userError, user } = useAuth()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [input, setInput] = useState({
    street: user?.address?.street ?? "",
    apartment: user?.address?.apartment ?? "",
    state: user?.address?.state ?? "",
    zipcode: user?.address?.zipcode?.toString() ?? "",
  })

  const [notification, setNotification] = useState<{
    message: string
    error: boolean
  }>()

  const [error, setError] = useState({
    street: "",
    apartment: "",
    zipcode: "",
    state: "",
  })

  // useEffect(() => {
  //   const checkSeller = () => {
  //     const verified = user?.address?.street && user?.address?.state
  //     if (isFocused === true) {
  //       if (user?.role !== "Seller" || !verified) {
  //         setShowAddress(true)
  //       }
  //     } else {
  //       setShowAddress(false)
  //     }
  //   }
  //   checkSeller()
  // }, [user, isFocused])

  const handleOnChange = (text: string, inputVal: keyof typeof input) => {
    setInput((prevState) => ({ ...prevState, [inputVal]: text }))
  }

  const handleError = (errorMessage: string, inputVal: keyof typeof error) => {
    setError((prevState) => ({ ...prevState, [inputVal]: errorMessage }))
  }

  const validate = () => {
    let valid = true
    if (!input.street) {
      handleError("Enter your street", "street")
      valid = false
    }
    if (!input.apartment) {
      handleError("Enter your apartment", "apartment")
      valid = false
    }
    if (!input.state) {
      handleError("Select your state/province", "state")
      valid = false
    }
    if (!input.zipcode) {
      handleError("Enter your zip code", "zipcode")
      valid = false
    }

    if (valid) {
      submitHandler()
    }
  }
  const submitHandler = async () => {
    setNotification(undefined)
    setIsSubmitting(true)
    const res = await updateUser({
      address: {
        state: input.state,
        street: input.street,
        apartment: input.apartment,
        zipcode: +input.zipcode,
      },
      role: "Seller",
    })
    if (res) {
      setNotification({
        message: "Address Verified Successfully",
        error: false,
      })
      // setShowAddress(false)
    } else {
      setNotification({
        message: userError || "Failed to verify address",
        error: true,
      })
    }

    setIsSubmitting(false)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!addressVerified}
      onRequestClose={() => {
        setIsClosed(true)
        navigation.push("Main")
      }}
    >
      <View style={[styles.centeredView]}>
        <View
          style={[styles.modalView, { backgroundColor: colors.background }]}
        >
          <IconButton
            icon={"close"}
            style={{ position: "absolute", right: 10, top: 0 }}
            onPress={() => {
              setIsClosed(true)
              navigation.push("Main")
            }}
          />
          <View style={styles.heading}>
            <Text style={[styles.modalTitle]}>Add Address</Text>
          </View>
          <Text style={{ marginTop: 10 }}>
            The provided address may be use for return should there be a need.
            This address is not displayed to buyers
          </Text>
          <View style={{ paddingVertical: 20 }}>
            <Text1 style={styles.label}>Street</Text1>
            <Input
              value={input.street}
              icon="pencil-outline"
              onChangeText={(text) => handleOnChange(text, "street")}
              placeholder={input.street}
              error={error.street}
              onFocus={() => {
                handleError("", "street")
              }}
            />
            <Text1 style={styles.label}>Apartment/Complex</Text1>
            <Input
              value={input.apartment}
              icon="pencil-outline"
              onChangeText={(text) => handleOnChange(text, "apartment")}
              placeholder={input.apartment}
              error={error.apartment}
              onFocus={() => {
                handleError("", "apartment")
              }}
            />
            <Text1 style={styles.label}>Province</Text1>

            <Picker
              selectedValue={input.state}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue, itemIndex) => {
                handleOnChange(itemValue, "state")
                handleError("", "state")
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
            <Text1 style={styles.label}>Zip Code</Text1>
            <Input
              value={input.zipcode?.toString() || ""}
              icon="pencil-outline"
              keyboardType="numeric"
              onChangeText={(text) => handleOnChange(text, "zipcode")}
              placeholder={input.zipcode ? `${input.zipcode}` : ""}
              error={error.zipcode}
              onFocus={() => {
                handleError("", "zipcode")
              }}
            />

            <Text
              style={{
                marginVertical: 10,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              Note: This can be edited later in your profile screen
            </Text>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#eb9f40",
                  textDecorationLine: "underline",
                  fontFamily: "chronicle-text-bold",
                }}
                onPress={() => goto(`${currentAddress(region())}/sell`)}
              >
                Easy Steps To Sell
              </Text>
            </View>

            {notification?.message ? (
              <Text
                style={{
                  color: notification.error ? colors.error : "green",
                  marginVertical: 5,
                }}
              >
                {notification.message}
              </Text>
            ) : null}

            <Button
              mode="contained"
              style={{ borderRadius: 5 }}
              children="Submit"
              loading={isSubmitting}
              onPress={validate}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

type TextProps = PropsWithChildren<{ style: StyleProp<TextStyle> }>

const Text1 = ({ children, style }: TextProps) => {
  return <Text style={[styles.label, style]}>{children}</Text>
}

export default AddAddress

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: "chronicle-text-bold",
    fontSize: 20,
    textTransform: "capitalize",
    color: "white",
  },
  content: {
    flex: 1,
    paddingTop: 30,
    width: "100%",
    paddingHorizontal: 20,
  },
  image: { width: 80 },

  form: { marginTop: 30, paddingBottom: 40 },
  label: { marginBottom: 5, fontSize: 15 },
  textarea: {
    borderRadius: 5,
    marginVertical: 10,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalTitle: { fontFamily: "chronicle-text-bold", fontSize: 20 },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    alignItems: "center",
  },
})
