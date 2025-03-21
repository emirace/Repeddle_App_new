import { useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { Text, TextInput, Button, Appbar, useTheme } from "react-native-paper"
import { FundNavigationProp } from "../../types/navigation/stack"
import useAuth from "../../hooks/useAuth"
import { generateTransactionRef, region } from "../../utils/common"
import PayWithFlutterwave from "flutterwave-react-native"
import Payfast from "../../components/paymentMethod/Payfast"
import useToastNotification from "../../hooks/useToastNotification"
import FlutterwaveInitError from "flutterwave-react-native/dist/utils/FlutterwaveInitError"
import { RedirectParams } from "flutterwave-react-native/dist/PayWithFlutterwave"
import useWallet from "../../hooks/useWallet"

const Fund: React.FC<FundNavigationProp> = ({ navigation }) => {
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()
  const { addNotification } = useToastNotification()
  const { colors } = useTheme()
  const { fundWalletFlutter } = useWallet()

  const onAbort = () => {
    setIsLoading(false)
  }

  const onError = (err: FlutterwaveInitError) => {
    setIsLoading(false)
    addNotification({
      message: err.message || "Failed to fund wallet",
      error: true,
    })
  }

  const handleFundWallet = async ({
    paymentMethod,
    transId,
  }: {
    paymentMethod: string
    transId: string
  }) => {
    if (amount === "" || isNaN(parseFloat(amount))) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.")
      return
    }
    // Handle the wallet funding logic here
    Alert.alert("Success", `Your wallet has been funded with ₦${amount}.`)
    return undefined
  }

  const onApprove = async (res: RedirectParams) => {
    const { error, result } = await fundWalletFlutter({
      amount: parseInt(amount),
      paymentProvider: "Flutterwave",
      transactionId: res.transaction_id?.toString() || res.tx_ref,
    })

    if (!error) {
      addNotification({ message: result })
      // setShowSuccess && setShowSuccess(true)
      setAmount("0")
    } else {
      addNotification({ message: result, error: true })
    }
  }

  const handleOnRedirect = async (result: RedirectParams) => {
    console.log(result, "res")
    try {
      if (result.status !== "successful") {
        console.log("unsuccessfull")
        setIsLoading(false)
        return
      }
      addNotification({ message: "Payment successful" })
      await onApprove(result)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={styles.container}>
      <Appbar.Header mode="large">
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Fund Wallet" />
        {/* <Appbar.Action icon="plus" onPress={() => {}} /> */}
        <Appbar.Action iconColor="white" icon="history" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.context}>
        <View style={{ flex: 1 }}>
          <TextInput
            label="Enter Amount"
            value={`${amount}`}
            onChangeText={(amount) => setAmount(amount)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {region() !== "NGN" ? (
          <Payfast
            placeOrderHandler={handleFundWallet}
            totalPrice={parseInt(amount)}
          />
        ) : (
          <PayWithFlutterwave
            onRedirect={handleOnRedirect}
            onInitializeError={onError}
            onAbort={onAbort}
            options={{
              tx_ref: generateTransactionRef(10),
              authorization: "FLWPUBK_TEST-6a1e30713a8c6962ecb7d6cfbda2df69-X",
              customer: {
                email: user?.email ?? "",
                name: `${user?.firstName} ${user?.lastName}`,
              },
              amount: parseInt(amount),
              currency: "NGN",
              payment_options: "card",
              customizations: {
                title: "Repeddle",
                description: "Payment for order",
                //   logo: "https://assets.piedpiper.com/logo.png",
              },
              meta: {
                purpose: "Make Payment",
                userId: user?._id,
                image:
                  "https://res.cloudinary.com/emirace/image/upload/v1674796101/fundwallet_rgdi9s.jpg",
                description: "Payment for items in cart",
              },
            }}
            customButton={(props) => (
              <Button
                onPress={() => {
                  setIsLoading(true)
                  props.onPress()
                }}
                children="Fund Wallet"
                loading={isLoading}
                mode="contained"
                style={[styles.button, { backgroundColor: colors.primary }]}
                labelStyle={{
                  color: "white",
                  fontFamily: "chronicle-text-bold",
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  context: { padding: 20, flex: 1 },
  input: {
    marginBottom: 20,
  },
  fundButton: {},
  button: {},
})

export default Fund
