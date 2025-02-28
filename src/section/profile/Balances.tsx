import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Text, Button, IconButton, useTheme } from "react-native-paper"
import useAuth from "../../hooks/useAuth"
import { ProfileSettingsNavigationProp } from "../../types/navigation/stack"

const Balance: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme()
  const [show, setShow] = useState(true)
  const { user } = useAuth()

  return (
    <View
      style={[styles.container, { backgroundColor: colors.elevation.level2 }]}
    >
      <View style={styles.balanceContainer}>
        <View style={styles.balanceTextContainer}>
          <IconButton icon="wallet" iconColor={colors.primary} size={20} />
          <Text style={styles.balanceLabel}>Current Repeddle Balance</Text>
          <IconButton
            icon={show ? "eye-outline" : "eye-off-outline"}
            size={20}
            onPress={() => setShow(!show)}
          />
        </View>
        <Text style={styles.balanceAmount}>
          {show ? "₦ " + (user?.balance || 0) : "*****"}
        </Text>
      </View>
      <Button
        mode="text"
        onPress={() => navigation.push("Transaction")}
        style={styles.historyButton}
      >
        Transaction History
      </Button>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  balanceContainer: {
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
    marginVertical: 10,
  },
  buttonCont: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    flex: 1,
  },
})

export default Balance
