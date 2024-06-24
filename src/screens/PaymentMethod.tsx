import { StyleSheet, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { Appbar, Text, useTheme } from "react-native-paper"
import useAuth from "../hooks/useAuth"
import useCart from "../hooks/useCart"
import { PaymentMethodNavigationProp } from "../types/navigation/stack"

type Props = PaymentMethodNavigationProp

const PaymentMethod = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const { total } = useCart()
  const { user } = useAuth()

  const [paymentMethodName, setPaymentMethod] = useState("Credit/Debit card")
  const [currency, setCurrency] = useState("")

  const handleSubmit = () => {
    // TODO: save payment method
    navigation.push("Checkout")
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
        <Appbar.Content title="My Orders" />
        <Appbar.Action icon="magnify" />
      </Appbar.Header>

      <View style={{ flex: 1, justifyContent: "space-between", padding: 20 }}>
        <View style={{ flex: 1 }}>
          <Radio
            label="Credit/Debit card"
            onPress={() => setPaymentMethod("Credit/Debit card")}
            paymentMethodName={paymentMethodName}
          />
          <Radio
            label={`Wallet (${currency}${(user?.balance ?? 0).toFixed(2)})`}
            onPress={() =>
              (user?.balance ?? 0) === 0 || (user?.balance ?? 0) < total
                ? ""
                : setPaymentMethod("Wallet")
            }
            paymentMethodName={paymentMethodName}
          />
          {(user?.balance ?? 0) <= total && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "red", fontSize: 13 }}>
                Insufficiant balance
              </Text>
              <Text style={{ color: colors.secondary, marginHorizontal: 20 }}>
                Fund Wallet Now
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { marginVertical: 20, backgroundColor: colors.primary },
          ]}
          onPress={handleSubmit}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PaymentMethod

type RadioProps = {
  label: string
  paymentMethodName: string
  onPress: () => void
}

const Radio = ({ label, paymentMethodName, onPress }: RadioProps) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={() => {
        onPress()
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        paddingVertical: 5,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.primary,
          backgroundColor:
            paymentMethodName === label ? colors.primary : undefined,
        }}
      />
      <Text style={{ marginLeft: 20 }}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  title: { fontWeight: "bold", fontSize: 20, textTransform: "capitalize" },
  button: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
})
