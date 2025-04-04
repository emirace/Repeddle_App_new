import { useState } from "react"
import { View, StyleSheet, Alert, ScrollView } from "react-native"
import {
  Text,
  TextInput,
  Button,
  Appbar,
  ActivityIndicator,
  useTheme,
} from "react-native-paper"
import { FundNavigationProp } from "../../types/navigation/stack"
import useWallet from "../../hooks/useWallet"
import useToastNotification from "../../hooks/useToastNotification"
import PayWithFlutterwave from "flutterwave-react-native"
import useAuth from "../../hooks/useAuth"
import { generateTransactionRef } from "../../utils/common"
import { API_KEY } from "../../utils/constants"

const Fund: React.FC<FundNavigationProp> = ({ navigation }) => {
  const { fundWalletFlutter } = useWallet()
  const { addNotification } = useToastNotification()
  const { user } = useAuth()
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const { colors } = useTheme()

  const onApprove = async (result: any) => {
    if (amount === "" || isNaN(parseFloat(amount))) {
      addNotification({
        message: "Invalid Amount, Please enter a valid amount.",
        error: true,
      })
      return
    }

    console.log(result)
    console.log(JSON.stringify(result, null, 2))
    const res = await fundWalletFlutter({
      amount: parseInt(amount),
      transactionId: result.reference || result.transaction_id || result.tx_ref,
      paymentProvider: "Flutterwave",
    })
    addNotification({
      message: res.result,
      error: res.error,
    })
    if (!res.error) navigation.navigate("Profile")
  }

  const handleOnRedirect = async (result: { status: string }) => {
    console.log(result)
    try {
      console.log(result)
      if (result.status !== "successful" && result.status !== "completed") {
        console.log("result", result.status !== "completed")

        addNotification({
          message: result.status,
          error: false,
        })
        return
      }
      await onApprove(result)
    } catch (err) {
      console.log("fund ", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAbort = () => {
    setIsLoading(false)
  }

  return (
    <View style={styles.container}>
      <Appbar.Header mode="small" style={{ backgroundColor: colors.primary }}>
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Fund Wallet" />
        <Appbar.Action
          icon="minus"
          iconColor="white"
          onPress={() => {
            navigation.navigate("Withdraw")
          }}
        />
        <Appbar.Action
          iconColor="white"
          icon="history"
          onPress={() => {
            navigation.navigate("Transaction")
          }}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.context}>
        <View style={{ flex: 1 }}>
          <TextInput
            label="Enter Amount"
            value={`${amount}`}
            onChangeText={(amount) => setAmount(amount)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <PayWithFlutterwave
          onRedirect={handleOnRedirect}
          onAbort={handleAbort}
          options={{
            tx_ref: generateTransactionRef(10),
            authorization: API_KEY,
            customer: {
              email: user?.email || "",
              name: user?.username,
            },
            amount: parseFloat(amount),
            currency: "NGN",
            // payment_options: "card",
            customizations: {
              title: "Repeddle",
              description: "Funding wallet",
              logo: "https://res.cloudinary.com/emirace/image/upload/v1674796101/fundwallet_rgdi9s.jpg",
            },
            meta: {
              purpose: "Funding wallet",
              userId: user?._id,
              image:
                "https://res.cloudinary.com/emirace/image/upload/v1674796101/fundwallet_rgdi9s.jpg",
              description: "Adding money to my wallet",
            },
          }}
          customButton={(props) =>
            isLoading ? (
              <ActivityIndicator size={"large"} />
            ) : (
              <Button
                mode="contained"
                onPress={() => {
                  setIsLoading(true)
                  props.onPress()
                }}
                style={styles.fundButton}
              >
                Fund Wallet
              </Button>
            )
          }
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  context: { padding: 20, paddingVertical: 25, flex: 1 },
  input: {
    marginBottom: 20,
  },
  fundButton: {},
})

export default Fund
