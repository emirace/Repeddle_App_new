import * as React from "react"
import { View, StyleSheet, Alert } from "react-native"
import { Text, TextInput, Button, Card, Appbar } from "react-native-paper"
import { WithdrawNavigationProp } from "../../types/navigation/stack"

const Withdraw: React.FC<WithdrawNavigationProp> = ({ navigation }) => {
  const [amount, setAmount] = React.useState("")

  // Example user account information
  const accountInfo = {
    accountNumber: "1234567890",
    bankName: "Sample Bank",
    accountName: "John Doe",
  }

  const handleWithdraw = () => {
    if (amount === "" || isNaN(parseFloat(amount))) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.")
      return
    }
    // Handle the withdrawal logic here
    Alert.alert(
      "Success",
      `You have withdrawn ₦${amount} to ${accountInfo.accountName}.`
    )
  }

  return (
    <View style={styles.container}>
      <Appbar.Header mode="large">
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          titleStyle={{ color: "white" }}
          title="Withdraw Funds"
        />
        <Appbar.Action iconColor="white" icon="plus" onPress={() => {}} />
        <Appbar.Action iconColor="white" icon="history" onPress={() => {}} />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1 }}>
          <Card style={styles.card} mode="contained">
            <Card.Title
              title="Account Information"
              titleStyle={{ textAlign: "center" }}
            />
            <Card.Content style={{ alignItems: "center" }}>
              <Text style={styles.accountTo}>To {accountInfo.accountName}</Text>
              <Text style={styles.accountText}>
                {accountInfo.bankName}
                <Text style={styles.accountText}>
                  {" "}
                  ({accountInfo.accountNumber})
                </Text>
              </Text>
            </Card.Content>
          </Card>
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
  },
  withdrawButton: {},
})

export default Withdraw
