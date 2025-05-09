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

const Withdraw: React.FC<WithdrawNavigationProp> = ({ navigation }) => {
  const [amount, setAmount] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { withdrawWalletFlutter, loading, fetchWallet } = useWallet()
  const { addNotification } = useToastNotification()
  const { colors } = useTheme()

  const { user } = useAuth()

  const handleWithdraw = async () => {
    if (amount === "" || isNaN(parseFloat(amount))) {
      addNotification({ message: "Invalid Amount", error: true })
      return
    }

    if (!user?.accountName || !user.accountNumber || !user.bankName) {
      addNotification({ message: "Add an to be a to withdraw" })
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
          <TextInput
            label="Enter Amount"
            value={amount}
            onChangeText={(amount) => setAmount(amount)}
            keyboardType="numeric"
            style={styles.input}
            //   mode="outlined"
          />
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
    marginVertical: 50,
    width: "100%",
  },
  withdrawButton: {},
})

export default Withdraw
