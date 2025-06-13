import * as React from "react"
import { View, StyleSheet, Alert } from "react-native"
import {
  Text,
  TextInput,
  Button,
  Card,
  Appbar,
  useTheme,
} from "react-native-paper"
import { WithdrawNavigationProp } from "../../types/navigation/stack"
import useWallet from "../../hooks/useWallet"
import useToastNotification from "../../hooks/useToastNotification"
import useAuth from "../../hooks/useAuth"
import { currency } from "../../utils/common"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"

const Withdraw: React.FC<WithdrawNavigationProp> = ({ navigation }) => {
  const { wallet, withdrawWalletFlutter, loading, fetchWallet } = useWallet()
  const { user } = useAuth()

  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fee, setFee] = useState(0)
  const [errormsg, setErrormsg] = useState("")
  const { addNotification } = useToastNotification()
  const { colors } = useTheme()

  var region: "NGN" | "ZAR" = "NGN"

  useEffect(() => {
    fetchWallet()
  }, [])

  const handleWithdraw = async () => {
    if (amount === "" || isNaN(parseFloat(amount))) {
      addNotification({ message: "Invalid Amount", error: true })
      return
    }

    if (!user?.accountName || !user.accountNumber || !user.bankName) {
      addNotification({ message: "Add an account to be a to withdraw" })
      return
    }

    if (amount === "" || Number(amount) > wallet.balance) {
      addNotification({ message: "Enter a valid amount" })
      return
    }

    setIsLoading(true)
    const { error, result } = await withdrawWalletFlutter(parseInt(amount))

    if (!error) {
      addNotification({ message: result, error: true })
      await fetchWallet()
      setAmount("")
      navigation.navigate("Profile")
    } else {
      addNotification({ message: result, error: true })
    }
    setIsLoading(false)
  }

  const handleChange = (e: any) => {
    setAmount(e)
    const fees =
      region === "ZAR"
        ? 10
        : e <= 5000
        ? 10.75
        : e > 5000 && e <= 50000
        ? 26.88
        : 53.75
    setFee(fees)
    const totalMoney = Number(e) + Number(fees)
    if (totalMoney > wallet.balance) {
      setErrormsg(
        "Insufficient funds, Please enter a lower amount to complete your withdrawal"
      )
      return
    }
    if (!e) {
      setErrormsg("Please enter the amount you want to withdraw")
      return
    }
    setErrormsg("")
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: colors.primary }}>
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          titleStyle={{ color: "white" }}
          title="Withdraw Funds"
        />
        <Appbar.Action
          iconColor="white"
          icon="plus"
          onPress={() => {
            navigation.navigate("Fund")
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
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1 }}>
          {user?.accountName ? (
            <Card style={styles.card} mode="contained">
              <Card.Title
                title="Account Information"
                titleStyle={{ textAlign: "center" }}
              />
              <Card.Content style={{ alignItems: "center" }}>
                <Text style={styles.accountTo}>To {user?.accountName}</Text>
                <Text style={styles.accountText}>
                  {user?.bankName}
                  <Text style={styles.accountText}>
                    {" "}
                    ({user?.accountNumber})
                  </Text>
                </Text>
              </Card.Content>
            </Card>
          ) : null}
          <Text style={{ color: "grey", textAlign: "right" }}>
            Balance: {currency(region)}
            {wallet.balance}
          </Text>
          <View>
            <TextInput
              label="Enter Amount"
              value={amount}
              onChangeText={(amount) => handleChange(amount)}
              keyboardType="numeric"
              style={styles.input}
              //   mode="outlined"
            />
            <Text
              onPress={() => setAmount(wallet.balance.toString())}
              style={{
                position: "absolute",
                right: 10,
                top: 18,
                fontSize: 20,
                color: colors.primary,
                fontWeight: "700",
                padding: 15,
              }}
            >
              All
            </Text>
          </View>

          {errormsg ? (
            <Text
              style={{
                color: "red",
                fontSize: 14,
                textAlign: "center",
                lineHeight: 15,
                marginBottom: 10,
              }}
            >
              {errormsg}
            </Text>
          ) : null}

          {amount ? (
            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.elevation.level1,
                padding: 10,
                borderRadius: 10,
                marginTop: 15,
                gap: 10,
                alignItems: "center",
              }}
            >
              <Ionicons name="alert-circle" size={26} color={colors.primary} />
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 20,
                }}
              >
                You will be charged {wallet.currency}
                {fee} for payment gateway withdrawal processing fee
              </Text>
            </View>
          ) : null}
        </View>
        <Button
          mode="contained"
          onPress={handleWithdraw}
          style={styles.withdrawButton}
          disabled={isLoading}
          loading={isLoading}
        >
          Withdraw
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { padding: 20, flex: 1 },
  card: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  accountText: {
    fontSize: 20,
    marginBottom: 5,
  },
  accountTo: { fontWeight: "600", fontSize: 20 },
  input: {
    marginVertical: 10,
    width: "100%",
  },
  withdrawButton: {},
})

export default Withdraw
