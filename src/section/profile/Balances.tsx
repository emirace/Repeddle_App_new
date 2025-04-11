import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Text, Button, IconButton, useTheme } from "react-native-paper"
import useWallet from "../../hooks/useWallet"

const Balance: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme()
  const [show, setShow] = useState(true)
  const { wallet } = useWallet()

  return (
    <View
      style={[styles.container, { backgroundColor: colors.elevation.level2 }]}
    >
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>
          {show
            ? `${wallet.currency === "NGN" ? "₦" : "Z"} ` +
              (wallet.balance || 0)
            : "*****"}
        </Text>
        <View style={styles.balanceTextContainer}>
          <IconButton icon="wallet" iconColor={colors.primary} size={20} />
          <Text style={styles.balanceLabel}>Current Repeddle Balance</Text>
          <IconButton
            icon={show ? "eye-outline" : "eye-off-outline"}
            size={20}
            onPress={() => setShow(!show)}
          />
        </View>
      </View>

      <View style={styles.buttonCont}>
        <Button
          mode="contained"
          onPress={() => navigation.push("Fund")}
          style={styles.addButton}
          textColor="white"
        >
          Fund Wallet
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.push("Withdraw")}
          style={[styles.addButton, { backgroundColor: colors.secondary }]}
          textColor="white"
        >
          Request Payout
        </Button>
      </View>
      <Button
        mode="text"
        onPress={() => navigation.push("Transaction")}
        style={styles.historyButton}
      >
        Transaction History
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 10,
  },
  balanceContainer: {
    gap: 6,
    alignItems: "center",
  },
  balanceTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 18,
    marginLeft: 5,
  },
  balanceAmount: {
    fontSize: 30,
    fontFamily: "absential-sans-bold",
    height: 30,
    textAlign: "center",
  },
  historyButton: {
    margin: 0,
  },
  buttonCont: {
    flexDirection: "row",
    gap: 10,
    // marginVertical: 10,
  },
  addButton: {
    flex: 1,
  },
})

export default Balance
