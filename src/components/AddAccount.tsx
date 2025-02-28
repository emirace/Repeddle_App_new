import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native"
import React, { PropsWithChildren, useEffect, useState } from "react"
import { Button, IconButton, Text, useTheme } from "react-native-paper"
import { region } from "../utils/common"
import Input from "./Input"
import useAuth from "../hooks/useAuth"
import { SellNavigationProp } from "../types/navigation/stack"
import { Picker } from "@react-native-picker/picker"
import { banks } from "../utils/constants"
import useToastNotification from "../hooks/useToastNotification"

type Props = {
  isFocused: boolean
  navigation: SellNavigationProp["navigation"]
  accountVerified: boolean
  setIsClosed: (val: boolean) => void
}

const AddAccount = ({
  isFocused,
  navigation,
  accountVerified,
  setIsClosed,
}: Props) => {
  const { colors } = useTheme()
  const { updateUser, error: userError, user } = useAuth()

  const [input, setInput] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    error: boolean
  }>()

  const [error, setError] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  })

  // useEffect(() => {
  //   const checkSeller = () => {
  //     const verified = user?.bankName && user?.accountName && user?.accountName
  //     if (isFocused === true) {
  //       if (!verified || user?.role !== "Seller") {
  //         setShowAccount(true)
  //       }
  //     } else {
  //       setShowAccount(false)
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

  const submitHandler = async () => {
    setNotification(undefined)
    setIsSubmitting(true)
    const res = await updateUser({
      accountName: input.accountName,
      accountNumber: +input.accountNumber,
      bankName: input.bankName,
    })
    if (res) {
      setNotification({
        message: "Account Verified Successfully",
        error: false,
      })
      // setShowAccount(false)
    } else {
      setNotification({
        message: userError || "Failed to verify account",
        error: true,
      })
    }
    setIsSubmitting(false)
  }

  const validate = () => {
    let valid = true
    if (!input.accountNumber) {
      handleError("Enter a valid account number", "accountNumber")
      valid = false
    }
    if (!input.accountName) {
      handleError("Enter a valid account name", "accountName")
      valid = false
    }
    if (!input.bankName) {
      handleError("Select a valid bank", "bankName")
      valid = false
    }

    if (valid) {
      submitHandler()
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!accountVerified}
      onRequestClose={() => {
        setIsClosed(true)
        navigation.push("Main")
      }}
    >
      <View style={[styles.centeredView]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.modalView, { backgroundColor: colors.background }]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <IconButton
                icon={"close"}
                style={{ position: "absolute", right: 0, top: -15 }}
                onPress={() => navigation.push("Main")}
              />
              <View style={styles.heading}>
                <TouchableOpacity></TouchableOpacity>
                <Text style={[styles.modalTitle]}>Add Bank Account</Text>
              </View>
              <Text1 style={{ marginTop: 10 }}>
                To become a Seller, kindly provide your banking details where
                you can transfer your earnings deposited in your Repeddle wallet
              </Text1>
              <View style={{ paddingVertical: 20 }}>
                <Text1 style={styles.label}>Account Name</Text1>
                <Input
                  value={input.accountName}
                  icon="pencil-outline"
                  onChangeText={(text) => handleOnChange(text, "accountName")}
                  placeholder={input.accountName}
                  error={error.accountName}
                  onFocus={() => {
                    handleError("", "accountName")
                  }}
                />
                <Text1 style={styles.label}>Account Number</Text1>
                <Input
                  value={input.accountNumber}
                  icon="pencil-outline"
                  onChangeText={(text) => handleOnChange(text, "accountNumber")}
                  placeholder={
                    input.accountNumber ? `${input.accountNumber}` : ""
                  }
                  error={error.accountNumber}
                  onFocus={() => {
                    handleError("", "accountNumber")
                  }}
                />
                <Text1 style={styles.label}>Bank Name</Text1>

                <Picker
                  selectedValue={input.bankName}
                  style={{
                    backgroundColor: colors.elevation.level2,
                    padding: 5,
                    color: "grey",
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    handleOnChange(itemValue, "bankName")
                    handleError("", "bankName")
                  }}
                >
                  <Picker.Item
                    style={{
                      backgroundColor: colors.elevation.level2,
                      color: colors.onBackground,
                    }}
                    label={"--select bank--"}
                    value={""}
                  />
                  {region() === "NGN"
                    ? banks.Nigeria.map((name, index) => (
                        <Picker.Item
                          style={{
                            backgroundColor: colors.elevation.level2,
                            color: colors.onBackground,
                          }}
                          key={index}
                          //   label={name}
                          value={name}
                        />
                      ))
                    : banks.SouthAfrica.map((name, index) => (
                        <Picker.Item
                          style={{
                            backgroundColor: colors.elevation.level2,
                            color: colors.onBackground,
                          }}
                          key={index}
                          //   label={name}
                          value={name}
                        />
                      ))}
                </Picker>

                <Text style={{ color: colors.error, marginVertical: 5 }}>
                  Note: This cannot be change once saved, contact support to
                  make any changes.
                </Text>

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
                  disabled={isSubmitting}
                  onPress={validate}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

type TextProps = PropsWithChildren<{ style: StyleProp<TextStyle> }>

const Text1 = ({ children, style }: TextProps) => {
  return <Text style={[styles.label, style]}>{children}</Text>
}

export default AddAccount

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontFamily: "absential-sans-bold",
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
    height: "auto",
    maxHeight: Math.min(Dimensions.get("screen").height * 0.8, 530),
  },
  modalTitle: { fontFamily: "absential-sans-bold", fontSize: 20 },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    alignItems: "center",
  },
})
